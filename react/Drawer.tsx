import React, { useState } from 'react'
import Overlay from './Overlay'

import { Animation } from 'vtex.store-components'
import { IconMenu } from 'vtex.store-icons'

const AnimationTypes : Record<string, string> = {
  down: 'drawerUp',
  left: 'drawerRight', 
  right: 'drawerLeft', 
  up: 'drawerDown',
}

const Drawer : StorefrontComponent<DrawerSchema> = ({
  actionIconId,
  dismissIconId,
  position,
  width,
  height,
  ...props
}: DrawerSchema) => {
  const [open, setOpen] = useState(false)

  return open ? (
    <>
      <Overlay visible={open}/>
      <Animation
      isActive={open}
      type={AnimationTypes[position]}
      className="fixed">

      </Animation>
    </>
  ) : (
    <div className="flex pa4 pointer" onClick={() => setOpen(true)}>
      <IconMenu size={20} />
    </div>
  )
}


Drawer.getSchema = props => {
  return {
    title: 'editor.sidebar.title',
  }
}

export default Drawer
