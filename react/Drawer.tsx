import React, { useRef, useState, useEffect } from 'react'
import { defineMessages } from 'react-intl'
import { generateBlockClass, BlockClass } from '@vtex/css-handles'

import { IconClose, IconMenu } from 'vtex.store-icons'

import Overlay from './Overlay'
import Portal from './Portal'
import Swipable from './Swipable'

import styles from './drawer.css'

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
  const [isLocked, setLocked] = useState(false)
  type ScrollPosition = number | null
  const [lockedScrollPosition, setLockedScrollPosition] = useState<
    ScrollPosition
  >(null)

  useEffect(() => {
    /** Locks scroll of the root HTML element if the
     * drawer menu is open
     */
    const shouldLockScroll = isLocked

    const documentElement =
      window && window.document && window.document.documentElement
    if (documentElement) {
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
      documentElement.style.right = shouldLockScroll ? '0' : 'auto'
    }

    return () => {
      documentElement.style.overflow = 'auto'
      documentElement.style.position = 'static'

      documentElement.style.top = 'auto'
      documentElement.style.bottom = 'auto'
      documentElement.style.left = 'auto'
      documentElement.style.right = 'auto'
    }
  }, [isLocked]) // eslint-disable-line react-hooks/exhaustive-deps
  // ☝️ no need to trigger this on lockedScrollPosition changes

  return setLocked
}

const useMenuState = () => {
  const [isMenuOpen, setIsOpen] = useState(false)
  const [isMenuTransitioning, setIsTransitioning] = useState(false)
  const setLockScroll = useLockScroll()

  let transitioningTimeout: number | null

  const setMenuOpen = (value: boolean) => {
    setIsOpen(value)
    setIsTransitioning(true)
    setLockScroll(value)

    if (transitioningTimeout != null) {
      clearTimeout(transitioningTimeout)
      transitioningTimeout = null
    }
    transitioningTimeout =
      window &&
      window.setTimeout(() => {
        setIsTransitioning(false)
      }, 300)
  }

  const openMenu = () => setMenuOpen(true)
  const closeMenu = () => setMenuOpen(false)

  return { isMenuOpen, isMenuTransitioning, setMenuOpen, openMenu, closeMenu }
}

const Drawer: StorefrontComponent<DrawerSchema & BlockClass> = ({
  // actionIconId,
  // dismissIconId,
  // position,
  // width,
  // height,
  blockClass,
  children,
}) => {
  const {
    isMenuOpen,
    isMenuTransitioning,
    openMenu,
    closeMenu,
  } = useMenuState()

  const menuRef = useRef(null)

  return (
    <>
      <div className="pa4 pointer" onClick={openMenu} aria-hidden>
        <IconMenu size={20} />
      </div>
      <Portal>
        <Overlay visible={isMenuOpen} onClick={closeMenu} />

        <Swipable
          enabled={isMenuOpen}
          element={menuRef && menuRef.current}
          onSwipeLeft={closeMenu}
        >
          <div
            ref={menuRef}
            className={`${generateBlockClass(
              styles.drawer,
              blockClass
            )} fixed top-0 left-0 bottom-0 bg-base z-999 flex flex-column`}
            style={{
              WebkitOverflowScrolling: 'touch',
              overflowY: 'scroll',
              maxWidth: '85%',
              pointerEvents: isMenuOpen ? 'auto' : 'none',
              transform: `translate3d(${isMenuOpen ? '0' : '-100%'}, 0, 0)`,
              transition: isMenuTransitioning ? 'transform 300ms' : 'none',
              width: 300,
            }}
          >
            <div className="dib">
              <button
                className="pa4 pointer transparent bn pointer"
                onClick={closeMenu}
              >
                <IconClose size={30} type="line" />
              </button>
            </div>
            <div className="flex flex-grow-1">{children}</div>
          </div>
        </Swipable>
      </Portal>
    </>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.drawer.title',
  },
})

Drawer.getSchema = () => {
  return {
    title: messages.title.id,
  }
}

export default Drawer
