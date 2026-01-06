import React from 'react'
import promptLog from '../data/agent-prompts.json'
import type { SkillIconKind } from '../components/SkillIcon'
import { HeroScene } from '../components/CubeHeroScene'

type PromptEntry = {
  id: string
  at: string | null
  prompt: string
  verbatim?: boolean
  summary?: string
  files?: string[]
}

type PromptSession = {
  id: string
  startedAt?: string
  userPromptEntries?: PromptEntry[]
  // legacy
  userPrompts?: string[]
  highLevelSummary?: {
    outcome?: string
    keyTech?: string[]
    deploymentNotes?: string[]
    notableUX?: string[]
  }
}

type PromptLog = {
  schemaVersion: number
  note?: string
  sessions: PromptSession[]
}

const safeLower = (value: string): string => value.trim().toLowerCase()

const formatDateTime = (iso: string | null): string => {
  if (!iso) return 'Unknown time'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString()
}

const clipText = async (value: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch {
    return false
  }
}

const highlightMatch = (text: string, query: string): JSX.Element => {
  const q = query.trim()
  if (!q) return <>{text}</>

  const lowerText = text.toLowerCase()
  const lowerQ = q.toLowerCase()
  const index = lowerText.indexOf(lowerQ)
  if (index === -1) return <>{text}</>

  const before = text.slice(0, index)
  const match = text.slice(index, index + q.length)
  const after = text.slice(index + q.length)

  return (
    <>
      {before}
      <mark className="promptMark">{match}</mark>
      {after}
    </>
  )
}

const singleLine = (value: string): string => value.replace(/\s+/g, ' ').trim()

const shorten = (value: string, maxLen: number): string => {
  const v = singleLine(value)
  if (v.length <= maxLen) return v
  return `${v.slice(0, Math.max(0, maxLen - 1)).trimEnd()}…`
}

const AgentPromptsPage = (): JSX.Element => {
  const log = promptLog as unknown as PromptLog
  const session = log.sessions?.[log.sessions.length - 1]

  const [selectedSkill, setSelectedSkill] = React.useState<SkillIconKind | null>(null)

  const entries: PromptEntry[] = React.useMemo(() => {
    const fromEntries = session?.userPromptEntries ?? []
    if (fromEntries.length) return fromEntries

    const legacy = session?.userPrompts ?? []
    return legacy.map((prompt, index) => ({
      id: `legacy-${index + 1}`,
      at: null,
      prompt,
      verbatim: false
    }))
  }, [session])

  const [query, setQuery] = React.useState('')
  const [selectedId, setSelectedId] = React.useState<string | null>(entries[entries.length - 1]?.id ?? null)
  const [copied, setCopied] = React.useState(false)

  const filtered = React.useMemo(() => {
    const q = safeLower(query)
    if (!q) return entries

    return entries.filter((entry) => {
      const haystacks: string[] = [entry.prompt]
      if (entry.summary) haystacks.push(entry.summary)
      if (entry.files?.length) haystacks.push(entry.files.join(' '))
      return safeLower(haystacks.join('\n')).includes(q)
    })
  }, [entries, query])

  React.useEffect(() => {
    if (!filtered.length) {
      setSelectedId(null)
      return
    }

    const stillExists = selectedId ? filtered.some((e) => e.id === selectedId) : false
    if (!stillExists) setSelectedId(filtered[0].id)
  }, [filtered, selectedId])

  const selected = React.useMemo(() => filtered.find((e) => e.id === selectedId) ?? null, [filtered, selectedId])

  return (
    <div className="page">
      <header className="promptHeader">
        <div className="promptHeaderRow">
          <div>
            <a className="button secondary pageBackButton" href="#/" aria-label="Back to Home">
              Back to Home
            </a>
            <h1 className="promptTitle">Generated with Agent Prompts</h1>
            <p className="promptSubtitle">
              Search and review prompts from <span className="promptMono">src/data/agent-prompts.json</span>.
            </p>
          </div>
        </div>
      </header>

      <div className="pageCube" aria-label="3D rotating cube demo">
        <HeroScene selectedSkill={selectedSkill} onSelectSkill={setSelectedSkill} />
      </div>

      <section className="promptToolbar" aria-label="Prompt search">
        <label className="promptSearchLabel">
          <span className="promptSearchLabelText">Search</span>
          <input
            className="promptSearchInput"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search prompts, summaries, or filenames…"
            aria-label="Search prompts"
          />
        </label>

        <div className="promptStats" aria-label="Search results count">
          {filtered.length} / {entries.length}
        </div>
      </section>

      <section className="promptLayout" aria-label="Prompt viewer">
        <div className="promptList" role="list" aria-label="Prompt results">
          {filtered.map((entry) => {
            const isActive = entry.id === selectedId
            const title = shorten(entry.prompt, 110)
            const dateLine = formatDateTime(entry.at)

            return (
              <button
                key={entry.id}
                type="button"
                className={isActive ? 'promptItem promptItemActive' : 'promptItem'}
                onClick={() => setSelectedId(entry.id)}
              >
                <div className="promptItemTopRow">
                  <div className="promptItemTitle">{highlightMatch(title, query)}</div>
                  {entry.verbatim === false ? <span className="promptBadge">approx</span> : null}
                </div>
                <div className="promptItemMeta">
                  <span>{dateLine}</span>
                  {entry.files?.length ? <span className="promptMetaDot">•</span> : null}
                  {entry.files?.length ? <span>{entry.files.length} files</span> : null}
                </div>
              </button>
            )
          })}

          {!filtered.length ? <div className="promptEmpty">No matches.</div> : null}
        </div>

        <div className="promptDetail" aria-label="Prompt details">
          {selected ? (
            <>
              <div className="promptDetailHeader">
                <div>
                  <div className="promptDetailKicker">Prompt</div>
                  <div className="promptDetailMeta">{formatDateTime(selected.at)}</div>
                </div>

                <button
                  type="button"
                  className="button secondary"
                  onClick={async () => {
                    setCopied(false)
                    const ok = await clipText(selected.prompt)
                    setCopied(ok)
                    if (ok) setTimeout(() => setCopied(false), 1200)
                  }}
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              {selected.verbatim === false ? (
                <div className="promptNote" role="note" aria-label="Prompt capture note">
                  This entry was captured as an abbreviated summary (marked <strong>approx</strong>). If you want the
                  full original prompt here, replace the <span className="promptMono">prompt</span> field for this
                  entry in <span className="promptMono">src/data/agent-prompts.json</span>.
                </div>
              ) : null}

              <pre className="promptCode" aria-label="Full prompt text">
                {selected.prompt}
              </pre>

              {selected.summary ? (
                <div className="promptSummary" aria-label="Outcome summary">
                  <div className="promptDetailKicker">Outcome</div>
                  <div className="promptSummaryText">{selected.summary}</div>
                </div>
              ) : null}

              {selected.files?.length ? (
                <div className="promptFiles" aria-label="Files changed">
                  <div className="promptDetailKicker">Files</div>
                  <div className="promptChips">
                    {selected.files.map((file) => (
                      <span key={file} className="promptChip">
                        {file}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {session?.highLevelSummary?.outcome ? (
                <div className="promptSession" aria-label="Session summary">
                  <div className="promptDetailKicker">Session Summary</div>
                  <div className="promptSummaryText">{session.highLevelSummary.outcome}</div>
                </div>
              ) : null}
            </>
          ) : (
            <div className="promptEmpty">Select a prompt to view details.</div>
          )}
        </div>
      </section>
    </div>
  )
}

export default AgentPromptsPage
