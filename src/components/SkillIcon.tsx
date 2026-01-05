import React from 'react'

export type SkillIconKind = 'database' | 'node' | 'containers' | 'kubernetes' | 'graphql' | 'code'

type SkillIconProps = {
  kind: SkillIconKind
  size?: number
  title?: string
  className?: string
}

const SkillIcon = ({ kind, size = 14, title, className }: SkillIconProps): JSX.Element => {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 2.2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const
  }

  const svgTitle = title ? <title>{title}</title> : null

  switch (kind) {
    case 'database':
      return (
        <svg {...common} className={className} aria-hidden={title ? undefined : true} role={title ? 'img' : 'presentation'}>
          {svgTitle}
          <ellipse cx="12" cy="6" rx="7" ry="3" />
          <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
          <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
        </svg>
      )

    case 'node':
      return (
        <svg {...common} className={className} aria-hidden={title ? undefined : true} role={title ? 'img' : 'presentation'}>
          {svgTitle}
          <path d="M12 2l8 4.6v10.8L12 22l-8-4.6V6.6L12 2z" />
          <path d="M9 10.5c0-1 0.8-1.8 1.8-1.8h2.4c1 0 1.8 0.8 1.8 1.8v3c0 1-0.8 1.8-1.8 1.8h-2.4c-1 0-1.8-0.8-1.8-1.8v-3z" />
          <path d="M9 12h6" />
        </svg>
      )

    case 'containers':
      return (
        <svg {...common} className={className} aria-hidden={title ? undefined : true} role={title ? 'img' : 'presentation'}>
          {svgTitle}
          <rect x="4" y="7" width="16" height="10" rx="2" />
          <path d="M8 7v10" />
          <path d="M12 7v10" />
          <path d="M16 7v10" />
        </svg>
      )

    case 'kubernetes':
      return (
        <svg {...common} className={className} aria-hidden={title ? undefined : true} role={title ? 'img' : 'presentation'}>
          {svgTitle}
          <circle cx="12" cy="12" r="7" />
          <path d="M12 5v4" />
          <path d="M12 15v4" />
          <path d="M5 12h4" />
          <path d="M15 12h4" />
          <path d="M7.5 7.5l2.8 2.8" />
          <path d="M13.7 13.7l2.8 2.8" />
          <path d="M16.5 7.5l-2.8 2.8" />
          <path d="M10.3 13.7l-2.8 2.8" />
        </svg>
      )

    case 'graphql':
      return (
        <svg {...common} className={className} aria-hidden={title ? undefined : true} role={title ? 'img' : 'presentation'}>
          {svgTitle}
          <path d="M12 3l7 4v10l-7 4-7-4V7l7-4z" />
          <path d="M12 3v18" />
          <path d="M5 7l14 10" />
          <path d="M19 7L5 17" />
          <circle cx="12" cy="3" r="1" fill="currentColor" stroke="none" />
          <circle cx="19" cy="7" r="1" fill="currentColor" stroke="none" />
          <circle cx="19" cy="17" r="1" fill="currentColor" stroke="none" />
          <circle cx="12" cy="21" r="1" fill="currentColor" stroke="none" />
          <circle cx="5" cy="17" r="1" fill="currentColor" stroke="none" />
          <circle cx="5" cy="7" r="1" fill="currentColor" stroke="none" />
        </svg>
      )

    case 'code':
    default:
      return (
        <svg {...common} className={className} aria-hidden={title ? undefined : true} role={title ? 'img' : 'presentation'}>
          {svgTitle}
          <path d="M9 18l-6-6 6-6" />
          <path d="M15 6l6 6-6 6" />
          <path d="M14 4l-4 16" />
        </svg>
      )
  }
}

export default SkillIcon
