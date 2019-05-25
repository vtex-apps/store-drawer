import React, { useRef, useState, useEffect } from 'react'
import { defineMessages } from 'react-intl'
import { generateBlockClass, BlockClass } from '@vtex/css-handles'

import { IconClose, IconMenu } from 'vtex.store-icons'

import Overlay from './Overlay'
import Portal from './Portal'
import Swipable from './Swipable'

import styles from './drawer.css'

const useMenuState = () => {
  const [isMenuOpen, setIsOpen] = useState(false)
  const [isMenuTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    /** Locks scroll of the root HTML element if the
     * drawer menu is open
     */
    const documentElement =
      window && window.document && window.document.documentElement
    if (documentElement) {
      documentElement.style.overflow = isMenuOpen ? 'hidden' : 'auto'
    }

    return () => {
      documentElement.style.overflow = 'auto'
    }
  }, [isMenuOpen])

  let transitioningTimeout: number | null

  const setMenuOpen = (value: boolean) => {
    setIsOpen(value)
    setIsTransitioning(true)

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
