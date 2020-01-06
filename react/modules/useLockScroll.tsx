import { useRef, useState, useEffect } from 'react'

// https://stackoverflow.com/a/3464890/5313009
const getScrollPosition = () => {
  const documentElement =
    window && window.document && window.document.documentElement
  if (!documentElement) {
    return 0
  }
  return (
    (window.pageYOffset || documentElement.scrollTop) -
    (documentElement.clientTop || 0)
  )
}

const useLockScroll = () => {
  const initialized = useRef(false)
  const [isLocked, setLocked] = useState(false)
  type ScrollPosition = number | null
  const [lockedScrollPosition, setLockedScrollPosition] = useState<
    ScrollPosition
  >(null)

  useEffect(() => {
    if (!initialized.current && !isLocked) {
      // Prevent this from running at first, if it's not locked.
      // Important because this triggers re-layout, thus slowing
      // down the rendering unnecessarily.
      initialized.current = true
      return
    }
    /** Locks scroll of the root HTML element if the
     * drawer menu is open
     */
    const shouldLockScroll = isLocked

    const documentElement =
      window && window.document && window.document.documentElement

    if (documentElement) {
      const bodyBounds = document.body.getBoundingClientRect()

      document.body.style.width = shouldLockScroll
        ? `${bodyBounds.width}px`
        : 'auto'

      documentElement.style.overflow = shouldLockScroll ? 'hidden' : 'auto'

      /** iOS doesn't lock the scroll of the body by just setting overflow to hidden.
       * It requires setting the position of the HTML element to fixed, which also
       * resets the scroll position.
       * This code is intended to record the scroll position and set it as
       * the element's position, and revert it once the menu is closed.
       */
      const scrollPosition =
        lockedScrollPosition == null
          ? getScrollPosition()
          : lockedScrollPosition

      if (lockedScrollPosition == null && shouldLockScroll) {
        setLockedScrollPosition(scrollPosition)
      }

      if (lockedScrollPosition != null && !shouldLockScroll) {
        window && window.scrollTo(0, scrollPosition)
        setLockedScrollPosition(null)
      }

      documentElement.style.position = shouldLockScroll ? 'fixed' : 'static'

      documentElement.style.top = shouldLockScroll
        ? `-${scrollPosition}px`
        : 'auto'

      documentElement.style.bottom = shouldLockScroll ? '0' : 'auto'
      documentElement.style.left = shouldLockScroll ? '0' : 'auto'
    }

    return () => {
      documentElement.style.overflow = 'auto'
      documentElement.style.position = 'static'

      documentElement.style.top = 'auto'
      documentElement.style.bottom = 'auto'
      documentElement.style.left = 'auto'
      document.body.style.width = 'auto'
    }
  }, [isLocked]) // eslint-disable-line react-hooks/exhaustive-deps
  // ☝️ no need to trigger this on lockedScrollPosition changes

  return setLocked
}

export default useLockScroll
