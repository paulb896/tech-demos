import React from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

const restoreScroll = (y: number): void => {
  // Wait until layout settles (especially for images/fonts).
  requestAnimationFrame(() => {
    window.scrollTo({ top: y, left: 0, behavior: 'smooth' })
  })
}

export const ScrollRestoration = (): null => {
  const location = useLocation()
  const navigationType = useNavigationType()

  const scrollPositionsByKeyRef = React.useRef<Map<string, number>>(new Map())
  const prevLocationKeyRef = React.useRef<string | null>(null)

  React.useLayoutEffect(() => {
    const prevKey = prevLocationKeyRef.current
    if (prevKey) {
      scrollPositionsByKeyRef.current.set(prevKey, window.scrollY)
    }

    const y = scrollPositionsByKeyRef.current.get(location.key) ?? 0

    if (navigationType === 'POP') {
      restoreScroll(y)
    } else {
      restoreScroll(0)
    }

    prevLocationKeyRef.current = location.key
  }, [location.key, navigationType])

  return null
}
