import React from 'react'
import { Link } from 'react-router-dom'
import InterestForm from '../components/InterestForm'
import { contactConfig, engagementModels, expertiseAreas, faqs, processSteps } from '../data/consulting'
import { projects } from '../data/projects'
import { linkedInProfile } from '../data/profile'
import '../consulting.css'

const useReveal = (): void => {
  React.useEffect(() => {
    const els = document.querySelectorAll('.c-reveal')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('c-revealed')),
      { threshold: 0.12 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

const ConsultingPage = (): JSX.Element => {
  const [selectedAreas, setSelectedAreas] = React.useState<string[]>([])
  useReveal()

  React.useEffect(() => {
    document.title = 'Paul Beauchamp | Technical Consulting: AI Pipelines, APIs, Infrastructure'
  }, [])

  const toggleArea = (id: string): void =>
    setSelectedAreas((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const interestIn = (id: string): void => {
    setSelectedAreas((prev) => (prev.includes(id) ? prev : [...prev, id]))
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  const proofProjects = projects.slice(0, 3)

  return (
    <div className="c-root">
      <div className="c-bgGlow" aria-hidden="true" />

      <nav className="c-nav" aria-label="Main">
        <a href="#top" className="c-logo">Paul Beauchamp<span>.</span></a>
        <div className="c-navLinks">
          <a href="#expertise">Expertise</a>
          <a href="#engagements">Engagements</a>
          <a href="#process">Process</a>
          <Link to="/portfolio">Portfolio</Link>
          <Link to="/blog">Blog</Link>
          <a href="#contact" className="c-btn c-btnPrimary c-btnSm">Let&apos;s talk</a>
        </div>
      </nav>

      <header className="c-hero" id="top">
        <div className="c-heroText">
          <div className="c-badge"><span className="c-pulse" aria-hidden="true" /> Available for select engagements</div>
          <h1>
            Senior technical consulting, from <span className="c-grad">AI pipelines</span> to production infrastructure.
          </h1>
          <p className="c-lead">
            18 years building reliable web systems, now helping businesses design, ship, and scale software:
            websites, APIs, event-driven systems, databases, cloud infrastructure, and the Agile and Lean processes that tie it all together.
          </p>
          <div className="c-ctaRow">
            <a id="hero-cta-contact" href="#contact" className="c-btn c-btnPrimary c-btnLg">Tell me about your project →</a>
            <a id="hero-cta-expertise" href="#expertise" className="c-btn c-btnGhost c-btnLg">See expertise</a>
          </div>
          <dl className="c-stats">
            <div><dt>18+</dt><dd>years in production</dd></div>
            <div><dt>8</dt><dd>areas of expertise</dd></div>
            <div><dt>AAA</dt><dd>scale experience</dd></div>
          </dl>
        </div>
        <div className="c-heroCard c-glass">
          <img src={linkedInProfile.avatarUrl} alt="Portrait of Paul Beauchamp" className="c-avatar" />
          <div className="c-heroCardName">{linkedInProfile.name}</div>
          <div className="c-heroCardRole">Backend Architect & Technical Consultant</div>
          <div className="c-heroCardLoc">{linkedInProfile.location}</div>
          <ul className="c-heroCardList">
            {expertiseAreas.slice(0, 5).map((a) => (
              <li key={a.id}><span aria-hidden="true">{a.icon}</span>{a.title}</li>
            ))}
          </ul>
        </div>
      </header>

      <main>
        <section id="expertise" className="c-section">
          <div className="c-sectionHead c-reveal">
            <p className="c-eyebrow">Expertise</p>
            <h2>Everything from the first commit to scaled production</h2>
            <p>Pick one area or mix and match. Most real problems cut across several.</p>
          </div>
          <div className="c-grid">
            {expertiseAreas.map((a) => (
              <article key={a.id} className={`c-card c-glass c-reveal${a.featured ? ' c-cardFeatured' : ''}`}>
                <div className="c-cardTop">
                  <span className="c-cardIcon" aria-hidden="true">{a.icon}</span>
                  <span className="c-cardYears">{a.years}</span>
                </div>
                <h3>{a.title}</h3>
                <p className="c-cardOutcome">{a.outcome}</p>
                <ul className="c-cardBullets">
                  {a.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
                <div className="c-tags">{a.tech.map((t) => <span key={t}>{t}</span>)}</div>
                {a.relatedProjectSlugs?.length ? (
                  <div className="c-related">
                    Related:{' '}
                    {a.relatedProjectSlugs.map((s, i) => (
                      <React.Fragment key={s}>
                        {i > 0 ? ', ' : ''}
                        <Link to={`/projects/${s}`}>{projects.find((p) => p.slug === s)?.name ?? s}</Link>
                      </React.Fragment>
                    ))}
                  </div>
                ) : null}
                <button id={`interest-${a.id}`} type="button" className="c-cardCta" onClick={() => interestIn(a.id)}>
                  I&apos;m interested →
                </button>
              </article>
            ))}
          </div>
        </section>

        <section id="engagements" className="c-section">
          <div className="c-sectionHead c-reveal">
            <p className="c-eyebrow">Ways to work together</p>
            <h2>Engagement models</h2>
            <p>Flexible formats sized to where you are. Pricing is tailored to scope, so let&apos;s talk.</p>
          </div>
          <div className="c-grid c-grid4">
            {engagementModels.map((m) => (
              <article key={m.name} className={`c-card c-glass c-reveal${m.highlight ? ' c-cardFeatured' : ''}`}>
                {m.highlight ? <span className="c-ribbon">Popular</span> : null}
                <h3>{m.name}</h3>
                <div className="c-duration">{m.duration}</div>
                <p>{m.summary}</p>
                <ul className="c-check">{m.includes.map((i) => <li key={i}>{i}</li>)}</ul>
                <a href="#contact" className="c-btn c-btnGhost c-btnFull">Let&apos;s talk</a>
              </article>
            ))}
          </div>
        </section>

        <section id="process" className="c-section">
          <div className="c-sectionHead c-reveal">
            <p className="c-eyebrow">Process</p>
            <h2>How an engagement works</h2>
          </div>
          <ol className="c-timeline">
            {processSteps.map((s, i) => (
              <li key={s.title} className="c-reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <span className="c-stepNum">{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="proof" className="c-section">
          <div className="c-sectionHead c-reveal">
            <p className="c-eyebrow">Proof of work</p>
            <h2>Recent builds</h2>
            <p>Open-source projects showing the hands-on side. <Link to="/portfolio">See the full portfolio →</Link></p>
          </div>
          <div className="c-grid c-grid3">
            {proofProjects.map((p) => (
              <Link key={p.slug} to={`/projects/${p.slug}`} className="c-proof c-glass c-reveal">
                {p.screenshotUrl ? <img src={p.screenshotUrl} alt="" loading="lazy" /> : null}
                <div className="c-proofBody">
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <div className="c-tags">{p.tags?.slice(0, 4).map((t) => <span key={t}>{t}</span>)}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section id="faq" className="c-section c-narrow">
          <div className="c-sectionHead c-reveal">
            <p className="c-eyebrow">FAQ</p>
            <h2>Common questions</h2>
          </div>
          {faqs.map((f) => (
            <details key={f.q} className="c-faq c-glass c-reveal" name="faq">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </section>

        <section id="contact" className="c-section c-narrow">
          <div className="c-sectionHead c-reveal">
            <p className="c-eyebrow">Get in touch</p>
            <h2>Interested? Let&apos;s see if it&apos;s a fit.</h2>
            <p>Share a few details and I&apos;ll reply within 1–2 business days. No commitment, no sales pitch.</p>
          </div>
          <div className="c-glass c-formWrap c-reveal">
            <InterestForm selectedAreas={selectedAreas} onToggleArea={toggleArea} />
          </div>
          <p className="c-altContact">
            Prefer direct? <a href={`mailto:${contactConfig.email}`}>{contactConfig.email}</a> ·{' '}
            <a href={contactConfig.linkedInUrl} target="_blank" rel="noreferrer">LinkedIn</a>
          </p>
        </section>
      </main>

      <footer className="c-footer">
        © {new Date().getFullYear()} Paul Beauchamp · <Link to="/portfolio">Portfolio</Link> · <Link to="/blog">Blog</Link> ·{' '}
        <Link to="/agent-prompts">How this site was built</Link>
      </footer>
    </div>
  )
}

export default ConsultingPage
