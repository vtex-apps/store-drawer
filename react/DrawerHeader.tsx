import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

// The `closeIconContainer` handle is for backwards compatibility
// purposes, since the close button used to be contained by only
// this class. And, since we extracted it to this component, this need
// to be added here to avoid breaking layouts that used this to customize
const CSS_HANDLES = ['drawerHeader', 'closeIconContainer'] as const

const DrawerHeader: React.FC = ({ children }) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div
      className={`flex ${handles.drawerHeader} ${handles.closeIconContainer}`}
    >
      {children}
    </div>
  )
}

export default DrawerHeader
