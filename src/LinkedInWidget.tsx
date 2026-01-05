import React from 'react'

export type LinkedInWidgetProps = {
  profileUrl: string
  name: string
  headline: string
  location?: string
  company?: string
  avatarUrl?: string
  bannerUrl?: string
  variant?: 'section' | 'hero'
}

const LinkedInWidget = (props: LinkedInWidgetProps): JSX.Element => {
  const { profileUrl, name, headline, location, company, avatarUrl, bannerUrl, variant = 'section' } = props

  const Wrapper: React.ElementType = variant === 'hero' ? 'div' : 'section'
  const wrapperClassName = variant === 'hero' ? 'liHeroWrap' : 'section'
  const cardClassName = variant === 'hero' ? 'liCard liCardCompact' : 'liCard'

  return (
    <Wrapper className={wrapperClassName} id="linkedin">
      {variant === 'hero' ? null : <h2>LinkedIn</h2>}
      <a className={cardClassName} href={profileUrl} target="_blank" rel="noreferrer">
        <div className="liBanner" style={bannerUrl ? { backgroundImage: `url(${bannerUrl})` } : undefined} />
        <div className="liBody">
          <div className="liAvatar" aria-hidden="true">
            {avatarUrl ? <img className="liAvatarImg" src={avatarUrl} alt="" /> : null}
          </div>
          <div className="liMeta">
            <div className="liName">{name}</div>
            <div className="liHeadline">{headline}</div>
            {variant === 'hero' ? null : (
              <div className="liSub">
                {location ? <span>{location}</span> : null}
                {location && company ? <span className="liDot">•</span> : null}
                {company ? <span>{company}</span> : null}
              </div>
            )}
          </div>
          <div className="liCta">View profile</div>
        </div>
      </a>
    </Wrapper>
  )
}

export default LinkedInWidget
