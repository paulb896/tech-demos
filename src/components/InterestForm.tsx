import React from 'react'
import { budgetOptions, contactConfig, expertiseAreas, googleFormConfig, timelineOptions } from '../data/consulting'

type Status = 'idle' | 'sending' | 'submitted' | 'sent'

type GoogleFormValues = Omit<Record<keyof typeof googleFormConfig.entries, string>, 'areas'> & { areas: string[] }
const SENTINEL_FIELDS: Array<keyof typeof googleFormConfig.entries> = ['areas', 'timeline', 'budget']
const AREA_VALUE_BY_EXPERTISE_ID: Partial<Record<string, string>> = {
  ai: 'AI Workflows and Onboarding',
  data: 'Databases & Data Modeling',
  infra: 'Technical Infrastructure',
  process: 'Workflow Automation',
  arch: 'Architecture Design'
}
const TIMELINE_VALUE_MAP: Record<string, string> = {
  ASAP: 'ASAP',
  'Within 1 month': 'Within 30 Days',
  '1–3 months': 'Next Quarter'
}
const BUDGET_VALUE_MAP: Record<string, string> = {
  '$15k–$50k': '$15k–$50k',
  '$50k+': '$50k–$100k'
}

const submitToGoogleForm = async (values: GoogleFormValues): Promise<void> => {
  const body = new URLSearchParams()

  for (const [key, entryId] of Object.entries(googleFormConfig.entries)) {
    if (!entryId) continue
    const value = values[key as keyof GoogleFormValues]
    if (Array.isArray(value)) {
      value.forEach((v) => body.append(entryId, v))
      if (SENTINEL_FIELDS.includes(key as keyof typeof googleFormConfig.entries)) {
        body.append(`${entryId}_sentinel`, '')
      }
      continue
    }
    if (value) {
      body.append(entryId, value)
    }
    if (SENTINEL_FIELDS.includes(key as keyof typeof googleFormConfig.entries)) {
      body.append(`${entryId}_sentinel`, '')
    }
  }

  const fbzx = String(Date.now())
  body.append('fvv', '1')
  body.append('partialResponse', JSON.stringify([null, null, fbzx]))
  body.append('pageHistory', '0')
  body.append('fbzx', fbzx)
  body.append('submissionTimestamp', String(Date.now()))

  // Google Forms doesn't send CORS headers, so the response is opaque; a resolved fetch means it was delivered.
  await fetch(`https://docs.google.com/forms/d/e/${googleFormConfig.formId}/formResponse`, {
    method: 'POST',
    mode: 'no-cors',
    body
  })
}

type Props = {
  selectedAreas: string[]
  onToggleArea: (id: string) => void
}

const InterestForm = ({ selectedAreas, onToggleArea }: Props): JSX.Element => {
  const [status, setStatus] = React.useState<Status>('idle')

  const [draft, setDraft] = React.useState<{ subject: string; body: string } | null>(null)
  const [copied, setCopied] = React.useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    const form = e.currentTarget
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>
    const areas = expertiseAreas.filter((a) => selectedAreas.includes(a.id)).map((a) => a.title)

    const lines = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      data.company ? `Company: ${data.company}` : null,
      data.role ? `Role: ${data.role}` : null,
      `Interested in: ${areas.join(', ') || 'Not specified'}`,
      data.timeline ? `Timeline: ${data.timeline}` : null,
      data.budget ? `Budget: ${data.budget}` : null,
      '',
      data.message
    ].filter((l): l is string => l !== null)

    setDraft({ subject: `Consulting inquiry from ${data.company || data.name}`, body: lines.join('\n') })
    setCopied(false)

    if (!googleFormConfig.formId) {
      setStatus('sent')
      return
    }

    setStatus('sending')
    submitToGoogleForm({
      name: data.name ?? '',
      email: data.email ?? '',
      company: data.company ?? '',
      role: data.role ?? '',
      areas: selectedAreas.map((id) => AREA_VALUE_BY_EXPERTISE_ID[id]).filter((v): v is string => Boolean(v)),
      timeline: TIMELINE_VALUE_MAP[data.timeline ?? ''] ?? '',
      budget: BUDGET_VALUE_MAP[data.budget ?? ''] ?? '',
      message: [
        data.message ?? '',
        '',
        `Selected areas (site): ${areas.join(', ') || 'Not specified'}`,
        `Selected timeline (site): ${data.timeline || 'Not specified'}`,
        `Selected budget (site): ${data.budget || 'Not specified'}`
      ].join('\n')
    })
      .then(() => {
        setStatus('submitted')
        form.reset()
      })
      .catch(() => setStatus('sent'))
  }

  if (status === 'submitted') {
    return (
      <div className="c-formSuccess" role="status">
        <div className="c-formSuccessIcon" aria-hidden="true">✓</div>
        <h3>Thanks, your inquiry is in!</h3>
        <p>I&apos;ll get back to you within 1–2 business days.</p>
        <button type="button" className="c-btn c-btnGhost" onClick={() => setStatus('idle')}>
          Send another
        </button>
      </div>
    )
  }

  const copyDraft = async (): Promise<void> => {
    if (!draft) return
    try {
      await navigator.clipboard.writeText(`To: ${contactConfig.email}\nSubject: ${draft.subject}\n\n${draft.body}`)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  if (status === 'sent' && draft) {
    const to = encodeURIComponent(contactConfig.email)
    const su = encodeURIComponent(draft.subject)
    const body = encodeURIComponent(draft.body)
    const options = [
      { id: 'send-gmail', label: 'Gmail', href: `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${su}&body=${body}` },
      { id: 'send-outlook', label: 'Outlook', href: `https://outlook.office.com/mail/deeplink/compose?to=${to}&subject=${su}&body=${body}` },
      { id: 'send-yahoo', label: 'Yahoo', href: `https://compose.mail.yahoo.com/?to=${to}&subject=${su}&body=${body}` }
    ]
    return (
      <div className="c-formSuccess" role="status">
        <div className="c-formSuccessIcon" aria-hidden="true">✉</div>
        <h3>Almost done: choose how to send</h3>
        <p>Your message is ready. Pick the email you&apos;re already signed in to and it opens a pre-filled draft.</p>
        <div className="c-sendOptions">
          {options.map((o) => (
            <a key={o.id} id={o.id} className="c-btn c-btnPrimary" href={o.href} target="_blank" rel="noreferrer">
              {o.label}
            </a>
          ))}
          <a id="send-mailapp" className="c-btn c-btnGhost" href={`mailto:${contactConfig.email}?subject=${su}&body=${body}`}>
            Desktop mail app
          </a>
          <button id="send-copy" type="button" className="c-btn c-btnGhost" onClick={copyDraft}>
            {copied ? 'Copied ✓' : 'Copy message'}
          </button>
        </div>
        <pre className="c-draftPreview">{`To: ${contactConfig.email}\nSubject: ${draft.subject}\n\n${draft.body}`}</pre>
        <button type="button" className="c-cardCta" onClick={() => setStatus('idle')}>
          ← Edit details
        </button>
      </div>
    )
  }

  return (
    <form className="c-form" onSubmit={handleSubmit} noValidate id="interest-form">
      <div className="c-formGrid">
        <label className="c-field">
          <span>Name *</span>
          <input id="field-name" name="name" required autoComplete="name" />
        </label>
        <label className="c-field">
          <span>Work email *</span>
          <input id="field-email" name="email" type="email" required autoComplete="email" />
        </label>
        <label className="c-field">
          <span>Company</span>
          <input id="field-company" name="company" autoComplete="organization" />
        </label>
        <label className="c-field">
          <span>Role</span>
          <input id="field-role" name="role" autoComplete="organization-title" />
        </label>
      </div>

      <fieldset className="c-field c-chipsField">
        <legend>What are you interested in?</legend>
        <div className="c-chips">
          {expertiseAreas.map((a) => {
            const active = selectedAreas.includes(a.id)
            return (
              <button
                key={a.id}
                id={`chip-${a.id}`}
                type="button"
                className={active ? 'c-chip c-chipActive' : 'c-chip'}
                aria-pressed={active}
                onClick={() => onToggleArea(a.id)}
              >
                <span aria-hidden="true">{a.icon}</span> {a.title}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="c-formGrid">
        <label className="c-field">
          <span>Timeline</span>
          <select id="field-timeline" name="timeline" defaultValue="">
            <option value="" disabled>Select…</option>
            {timelineOptions.map((o) => <option key={o}>{o}</option>)}
          </select>
        </label>
        <label className="c-field">
          <span>Budget range</span>
          <select id="field-budget" name="budget" defaultValue="">
            <option value="" disabled>Select…</option>
            {budgetOptions.map((o) => <option key={o}>{o}</option>)}
          </select>
        </label>
      </div>

      <label className="c-field">
        <span>Tell me about your project *</span>
        <textarea id="field-message" name="message" rows={5} required minLength={10} placeholder="What are you trying to achieve? What's getting in the way?" />
      </label>

      <button id="submit-interest" type="submit" className="c-btn c-btnPrimary c-btnLg" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : googleFormConfig.formId ? 'Send inquiry →' : 'Compose email →'}
      </button>
    </form>
  )
}

export default InterestForm
