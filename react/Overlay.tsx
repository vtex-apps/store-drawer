import classNames from 'classnames'
import React from 'react'

const Overlay : StorefrontComponent<OverlayProps> = ({
  opacity = 40,
  color = 'base--inverted',
  visible,
  className = {},
}: OverlayProps) => {
  return (
    <div
      style={{ opacity }}
      className={classNames(color, {
        db: !visible,
        dn: visible,
        ...className,
      })}
    />
  )
}

interface OverlayProps extends OverlaySchema {
  visible: boolean,
  className?: object
}

Overlay.getSchema = props => {
  return {
    title: 'editor.overlay.title',
  }
}

export default Overlay
