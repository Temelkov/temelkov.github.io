import { useEffect, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useMousePosition } from '../hooks/useMousePosition'
import { useReducedMotion } from '../hooks/useReducedMotion'

type Circle = {
  x: number
  y: number
  translateX: number
  translateY: number
  size: number
  alpha: number
  targetAlpha: number
  dx: number
  dy: number
  magnetism: number
}

/** Един глобален слой с „мърдащи“ точки за целия сайт — по идея от Particles в Naresh 3d-portfolio. */
export function GlobalParticles() {
  const { theme } = useTheme()
  const mousePosition = useMousePosition()
  const reduced = useReducedMotion()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const circlesRef = useRef<Circle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const canvasSizeRef = useRef({ w: 0, h: 0 })
  const rafRef = useRef<number>(0)

  const quantity = 42
  const staticity = 52
  const ease = 52

  const dpr =
    typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return
    ctxRef.current = canvasRef.current.getContext('2d')

    const particleRgb =
      theme === 'dark' ? '255, 255, 255' : '63, 63, 70'

    const remapValue = (
      value: number,
      start1: number,
      end1: number,
      start2: number,
      end2: number,
    ): number => {
      const remapped =
        ((value - start1) * (end2 - start2)) / (end1 - start1) + start2
      return remapped > 0 ? remapped : 0
    }

    const resizeCanvas = () => {
      if (!canvasRef.current || !containerRef.current || !ctxRef.current) return
      circlesRef.current.length = 0
      canvasSizeRef.current.w = containerRef.current.offsetWidth
      canvasSizeRef.current.h = containerRef.current.offsetHeight
      canvasRef.current.width = canvasSizeRef.current.w * dpr
      canvasRef.current.height = canvasSizeRef.current.h * dpr
      canvasRef.current.style.width = `${canvasSizeRef.current.w}px`
      canvasRef.current.style.height = `${canvasSizeRef.current.h}px`
      ctxRef.current.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const circleParams = (): Circle => {
      const { w, h } = canvasSizeRef.current
      const x = Math.floor(Math.random() * w)
      const y = Math.floor(Math.random() * h)
      const size = Math.floor(Math.random() * 2) + 0.4
      const targetAlpha = parseFloat((Math.random() * 0.55 + 0.08).toFixed(2))
      const driftScale = reduced ? 0.06 : 0.2
      const dx = (Math.random() - 0.5) * driftScale
      const dy = (Math.random() - 0.5) * driftScale
      const magnetism = 0.12 + Math.random() * 3.5
      return {
        x,
        y,
        translateX: 0,
        translateY: 0,
        size,
        alpha: 0,
        targetAlpha,
        dx,
        dy,
        magnetism,
      }
    }

    const drawCircle = (circle: Circle, update = false) => {
      const ctx = ctxRef.current
      if (!ctx) return
      const { x, y, translateX, translateY, size, alpha } = circle
      ctx.translate(translateX, translateY)
      ctx.beginPath()
      ctx.arc(x, y, size, 0, 2 * Math.PI)
      ctx.fillStyle = `rgba(${particleRgb}, ${alpha})`
      ctx.fill()
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      if (!update) {
        circlesRef.current.push(circle)
      }
    }

    const drawParticles = () => {
      const ctx = ctxRef.current
      if (!ctx) return
      ctx.clearRect(0, 0, canvasSizeRef.current.w, canvasSizeRef.current.h)
      const particleCount = quantity
      for (let i = 0; i < particleCount; i += 1) {
        drawCircle(circleParams())
      }
    }

    const magnetMultiplier = reduced ? 0 : 1

    const animate = () => {
      const ctx = ctxRef.current
      if (!ctx) return
      ctx.clearRect(0, 0, canvasSizeRef.current.w, canvasSizeRef.current.h)

      for (let i = circlesRef.current.length - 1; i >= 0; i -= 1) {
        const circle = circlesRef.current[i]
        const edge = [
          circle.x + circle.translateX - circle.size,
          canvasSizeRef.current.w - circle.x - circle.translateX - circle.size,
          circle.y + circle.translateY - circle.size,
          canvasSizeRef.current.h - circle.y - circle.translateY - circle.size,
        ]
        const closestEdge = edge.reduce((a, b) => Math.min(a, b))
        const remapClosestEdge = parseFloat(
          remapValue(closestEdge, 0, 20, 0, 1).toFixed(2),
        )
        if (remapClosestEdge > 1) {
          circle.alpha += 0.02
          if (circle.alpha > circle.targetAlpha) {
            circle.alpha = circle.targetAlpha
          }
        } else {
          circle.alpha = circle.targetAlpha * remapClosestEdge
        }

        circle.x += circle.dx
        circle.y += circle.dy

        circle.translateX +=
          ((mouseRef.current.x / (staticity / circle.magnetism)) *
            magnetMultiplier -
            circle.translateX) /
          ease
        circle.translateY +=
          ((mouseRef.current.y / (staticity / circle.magnetism)) *
            magnetMultiplier -
            circle.translateY) /
          ease

        if (
          circle.x < -circle.size ||
          circle.x > canvasSizeRef.current.w + circle.size ||
          circle.y < -circle.size ||
          circle.y > canvasSizeRef.current.h + circle.size
        ) {
          circlesRef.current.splice(i, 1)
          drawCircle(circleParams())
        } else {
          drawCircle(
            {
              ...circle,
              x: circle.x,
              y: circle.y,
              translateX: circle.translateX,
              translateY: circle.translateY,
              alpha: circle.alpha,
            },
            true,
          )
        }
      }

      rafRef.current = window.requestAnimationFrame(animate)
    }

    resizeCanvas()
    drawParticles()

    const onResize = () => {
      resizeCanvas()
      drawParticles()
    }

    window.addEventListener('resize', onResize)
    rafRef.current = window.requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', onResize)
      window.cancelAnimationFrame(rafRef.current)
    }
  }, [theme, reduced, dpr, quantity, staticity, ease])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const { w, h } = canvasSizeRef.current
    const x = mousePosition.x - rect.left - w / 2
    const y = mousePosition.y - rect.top - h / 2
    const inside =
      x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2
    if (inside && !reduced) {
      mouseRef.current.x = x
      mouseRef.current.y = y
    }
  }, [mousePosition.x, mousePosition.y, reduced])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      aria-hidden
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}
