import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

function useFinePointerDesktop(): boolean {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (pointer: fine)')
    const sync = () => setOk(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return ok
}

/**
 * Единичен светещ cyan/dot като края на career timeline (по духа на
 * [akashrmalhotra/3d-portfolio](https://github.com/akashrmalhotra/3d-portfolio) —
 * там е по-голям кръг с `mix-blend-mode`; тук ползваме същия визуален език като нашата линия).
 */
export function CustomCursor() {
  const reduced = useReducedMotion()
  const desktopFine = useFinePointerDesktop()
  const [pressed, setPressed] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const cx = useSpring(x, { stiffness: 280, damping: 28, mass: 0.35 })
  const cy = useSpring(y, { stiffness: 280, damping: 28, mass: 0.35 })

  const enabled = desktopFine && !reduced

  useEffect(() => {
    document.documentElement.classList.toggle('custom-cursor-active', enabled)
    return () =>
      document.documentElement.classList.remove('custom-cursor-active')
  }, [enabled])

  useEffect(() => {
    if (!enabled) return
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const down = () => setPressed(true)
    const up = () => setPressed(false)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointerleave', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointerleave', up)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[10000]">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-[10001]"
        style={{
          x: cx,
          y: cy,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{ scale: pressed ? 0.82 : 1 }}
          transition={{ type: 'spring', stiffness: 520, damping: 28 }}
          className="experience-cursor-dot h-[11px] w-[11px] rounded-full bg-cyan-400"
        />
      </motion.div>
    </div>
  )
}
