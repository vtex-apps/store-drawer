// TODO: Move this to a separate npm package, along with Swipable

const animations = []

const createAnimation = ({ object, prop, stop, isStopped }) => ({
  object,
  prop,
  stop,
  isStopped,
})

const stopConflictingAnimations = animation =>
  animations.filter(cur => {
    const isConflicting =
      cur.object === animation.object && cur.prop === animation.prop
    if (isConflicting) {
      cur.stop()
    }
    return !cur.isStopped()
  })

function animate({ object, prop, target, duration, onUpdate = null }) {
  duration *= 1000
  const targetFps = 60
  const frameDuration = 1000 / targetFps
  const step = frameDuration / duration
  const ease = v => v * (2 - v)
  const maxTimeMultiplier = 2

  const origin = object[prop]
  const delta = target - origin

  let stopped = false

  const stop = () => {
    stopped = true
  }
  const isStopped = () => {
    stopped
  }

  let p = 0

  let last = null
  const update = now => {
    if (stopped) return
    let timeMultiplier = 1
    if (last != null) {
      const deltaTime = now - last
      timeMultiplier = deltaTime / frameDuration
      if (timeMultiplier > maxTimeMultiplier) timeMultiplier = maxTimeMultiplier
    }
    last = now

    p += step * timeMultiplier
    if (p >= 1) {
      p = 1
      stop()
    }

    const value = origin + ease(p) * delta
    object[prop] = value

    if (onUpdate != null) {
      onUpdate(value)
    }

    requestAnimationFrame(update)
  }
  update()

  const animation = createAnimation({ object, prop, stop, isStopped })
  stopConflictingAnimations(animation)

  animations.push(animation)

  return stop
}

export { animate }
