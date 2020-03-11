import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { IconClose } from 'vtex.store-icons'

import { useDrawer } from './Drawer'

const CSS_HANDLES = ['closeIconButton', 'closeIconContainer'] as const

const DrawerCloseButton: React.FC = () => {
  const { close } = useDrawer()

  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={`flex ${handles.closeIconContainer}`}>
      <button
        className={`${handles.closeIconButton} pa4 pointer bg-transparent transparent bn pointer`}
        onClick={close}
      >
        <IconClose size={30} type="line" />
      </button>
    </div>
  )
}

export default DrawerCloseButton
