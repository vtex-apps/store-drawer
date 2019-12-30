import React from 'react'
import { animate } from './modules/animation'
import PropTypes from 'prop-types'

const HORIZONTAL = 'horizontal'
const VERTICAL = 'vertical'
const BOTH = 'both'

const LEFT = 'left'
const RIGHT = 'right'
export default class Swipable extends React.Component {
  constructor(props) {
    super(props)

    this.dragContainer = React.createRef()

    this.isDragging = false
    this.dragEnabled = false
    this.offset = 0
    this.dragStartPos = {
      x: 0,
      y: 0,
    }
    this.previousDragPositions = []
    this.willTrigger = false
  }

  componentDidMount() {
    if (!window || !window.document) {
      return
    }

    window.document.addEventListener('mousemove', this.handleDragMove)
    window.document.addEventListener('touchmove', this.handleDragMove)
    window.document.addEventListener('mouseup', this.handleDragEnd)
    window.document.addEventListener('touchend', this.handleDragEnd)
  }

  componentWillUnmount() {
    if (!window || !window.document) {
      return
    }

    window.document.removeEventListener('mousemove', this.handleDragMove)
    window.document.removeEventListener('touchmove', this.handleDragMove)
    window.document.removeEventListener('mouseup', this.handleDragEnd)
    window.document.removeEventListener('touchend', this.handleDragEnd)
  }

  getPointerPosition(event) {
    if (event.clientX && event.clientY) {
      return {
        x: event.clientX,
        y: event.clientY,
        source: 'mouse',
        timeStamp: event.timeStamp,
      }
    }

    const { touches } = event

    if (!touches || touches.length === 0) return null

    const touch = event.touches[0]

    return {
      x: touch.clientX,
      y: touch.clientY,
      source: 'touch',
      timeStamp: event.timeStamp,
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.enabled && !this.props.enabled && this.isDragging) {
      this.isDragging = false
    }
  }

  handleDragStart = event => {
    if (this.isDragging) {
      return
    }

    const pos = this.getPointerPosition(event)
    if (pos === null) return

    this.isDragging = true
    this.dragLock = false
    this.dragEnabled = false
    this.offset = 0
    this.dragStartPos = {
      ...pos,
    }
    this.previousDragPositions = [pos]
    this.willTrigger = false
    this.dispatchTriggerChange(this.willTrigger)
  }

  dispatchTriggerChange = willTrigger => {
    const { onTriggerChange } = this.props
    if (onTriggerChange) {
      onTriggerChange(willTrigger)
    }
  }

  handleDragMove = event => {
    const {
      onDragStart,
      onLockScroll,
      onSwipeLeft,
      onSwipeRight,
      enabled,
      rubberBanding,
    } = this.props
    if (this.isDragging && !this.dragLock) {
      const pos = this.getPointerPosition(event)

      if (pos === null) return

      const lastPos = this.previousDragPositions[
        this.previousDragPositions.length - 1
      ]

      if (lastPos && pos.source !== lastPos.source) {
        return
      }

      const threshold = {
        x: 15,
        y: 10,
      }

      const distance = {
        x: pos.x - this.dragStartPos.x,
        y: pos.y - this.dragStartPos.y,
      }

      if (!this.dragEnabled) {
        if (Math.abs(distance.x) >= threshold.x) {
          this.dragEnabled = true
          onDragStart()
          onLockScroll()
        } else if (Math.abs(distance.y) >= threshold.y) {
          this.dragLock = true
        }
      } else {
        this.offset = distance.x
        const limitDragging = offset => {
          const rubberBandingMultiplier = 0.3
          return rubberBanding ? offset * rubberBandingMultiplier : 0
        }

        if (!enabled || (!onSwipeLeft && this.offset < 0)) {
          this.offset = limitDragging(this.offset)
        } else if (!enabled || (!onSwipeRight && this.offset > 0)) {
          this.offset = limitDragging(this.offset)
        }

        this.setOffset(this.offset)
        this.previousDragPositions.push(pos)

        const willTrigger = this.checkTrigger()
        if (this.willTrigger !== willTrigger) {
          this.dispatchTriggerChange(willTrigger)
        }

        this.willTrigger = willTrigger
      }
    }
  }

  setOffset = offset => {
    if (this.dragContainer && this.dragContainer.current) {
      this.props.onSetPosition({
        element: this.props.element || this.dragContainer.current,
        offset,
      })
      this.props.onUpdateOffset(offset)
    }
  }

  checkTrigger = () => {
    if (!this.props.enabled) {
      return null
    }
    const dragDirection = this.previousDragPositions
      .slice(-20)
      .map((cur, i, arr) => {
        const last = arr[i - 1]
        if (last == null) {
          return null
        }
        return cur.x - last.x
      })
      .filter(cur => cur != null)
      .reduce((sum, cur) => sum + cur, 0)

    const { onSwipeLeft, onSwipeRight } = this.props
    const triggers = {
      [LEFT]:
        onSwipeLeft && dragDirection < 0 && this.offset < -this.props.threshold,
      [RIGHT]:
        onSwipeRight && dragDirection > 0 && this.offset > this.props.threshold,
    }

    if (triggers[LEFT]) {
      return LEFT
    }
    if (triggers[RIGHT]) {
      return RIGHT
    }
    return null
  }

  handleDragEnd = () => {
    if (this.isDragging && this.dragEnabled) {
      const willTrigger = this.checkTrigger()
      if (willTrigger) {
        switch (willTrigger) {
          case LEFT:
            this.props.onSwipeLeft()
            break
          case RIGHT:
            this.props.onSwipeRight()
            break
        }
      } else {
        const offsetAnimation = { value: this.offset }
        animate({
          object: offsetAnimation,
          prop: 'value',
          target: 0,
          duration: 0.2,
          onUpdate: value => {
            this.setOffset(value)
          },
        })
      }
      this.props.onDragEnd()
      this.props.onUnlockScroll()
    }
    this.dragLock = false
    this.isDragging = false
  }
  render() {
    return (
      <div
        aria-hidden
        ref={this.dragContainer}
        onMouseDown={this.handleDragStart}
        onTouchStart={this.handleDragStart}
      >
        {this.props.children}
      </div>
    )
  }
}

Swipable.propTypes = {
  children: PropTypes.node,
  onSwipeLeft: PropTypes.func,
  onSwipeRight: PropTypes.func,
  onSwipeUp: PropTypes.func,
  onSwipeDown: PropTypes.func,
  onTriggerChange: PropTypes.func,
  onLockScroll: PropTypes.func,
  onUnlockScroll: PropTypes.func,
  onDragStart: PropTypes.func,
  onDragEnd: PropTypes.func,
  threshold: PropTypes.number,
  onSetPosition: PropTypes.func,
  onUpdateOffset: PropTypes.func,
  enabled: PropTypes.bool,
  direction: PropTypes.oneOf([HORIZONTAL, VERTICAL, BOTH]),
  rubberBanding: PropTypes.bool,
  element: PropTypes.element,
}

Swipable.defaultProps = {
  onSwipeLeft: null,
  onSwipeRight: null,
  onSwipeUp: null,
  onSwipeDown: null,
  onTriggerChange: null,
  onLockScroll: () => {},
  onUnlockScroll: () => {},
  onDragStart: () => {},
  onDragEnd: () => {},
  onSetPosition: ({ element, offset, vertical }) => {
    if (vertical) {
      element.style.transform = `translate3d(0,${offset}px,0)`
    } else {
      element.style.transform = `translate3d(${offset}px,0,0)`
    }
  },
  element: null,
  onUpdateOffset: () => {},
  threshold: 0,
  enabled: true,
  direction: HORIZONTAL,
  rubberBanding: false,
}
