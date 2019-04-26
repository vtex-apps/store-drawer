import React, { useRef, useState } from 'react'
import Overlay from './Overlay'
import Portal from './Portal'

import Swipable from './Swipable'

import { IconClose, IconMenu } from 'vtex.store-icons'

const useMenuState = () => {
  const [isMenuOpen, setIsOpen] = useState(false)
  const [isMenuTransitioning, setIsTransitioning] = useState(false)

  let transitioningTimeout: number | null

  const setMenuOpen = (value: boolean) => {
    setIsOpen(value)
    setIsTransitioning(true)

    /** Locks scroll of the root HTML element */
    const documentElement =
      window && window.document && window.document.documentElement
    if (documentElement) {
      documentElement.style.overflow = value ? 'hidden' : 'auto'
    }

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

const Drawer: StorefrontComponent<DrawerSchema> = ({
  // actionIconId,
  // dismissIconId,
  // position,
  // width,
  // height,
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
            className="fixed top-0 left-0 bottom-0 bg-base z-999 flex flex-column"
            style={{
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

Drawer.getSchema = () => {
  return {
    title: 'editor.sidebar.title',
  }
}

export default Drawer
