import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../utils/cn'
import { useLanguage } from '../context/LanguageContext'
import { useReducedMotion } from '../hooks/useReducedMotion'

const SNAP_EASE = [0.32, 0.72, 0, 1] as const

interface HeroProps {
  name: string
  titles: string[]
  profileSrc: string
  resumeHref?: string
  resumeLabel?: string
  resumeDownloadName?: string
  projectsLabel: string
  contactLabel: string
}

export function Hero({
  name,
  titles,
  profileSrc,
  resumeHref,
  resumeLabel,
  resumeDownloadName,
  projectsLabel,
  contactLabel,
}: HeroProps) {
  const { lang } = useLanguage()
  const [titleIndex, setTitleIndex] = useState(0)
  const heroRef = useRef<HTMLElement | null>(null)
  const prefersReduced = useReducedMotion()

  const availabilityLabel =
    lang === 'bg'
      ? 'На разположение за нови проекти'
      : 'Available for new projects'

  useEffect(() => {
    if (!titles.length) return
    const id = window.setInterval(() => {
      setTitleIndex((i) => (i + 1) % titles.length)
    }, 2600)
    return () => window.clearInterval(id)
  }, [titles])

  const activeTitle = titles[titleIndex] ?? ''

  const instant = prefersReduced

  const lineSnap = useMemo(
    () => ({
      hidden: {
        opacity: instant ? 1 : 0,
        x: instant ? 0 : -22,
      },
      show: {
        opacity: 1,
        x: 0,
        transition: {
          duration: instant ? 0 : 0.26,
          ease: SNAP_EASE,
        },
      },
    }),
    [instant],
  )

  const photoSnap = useMemo(
    () => ({
      hidden: {
        opacity: instant ? 1 : 0,
        x: instant ? 0 : 20,
        scale: instant ? 1 : 0.94,
      },
      show: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
          duration: instant ? 0 : 0.32,
          ease: SNAP_EASE,
        },
      },
    }),
    [instant],
  )

  const heroRow = useMemo(
    () => ({
      hidden: {},
      show: {
        transition: {
          staggerChildren: instant ? 0 : 0.07,
          delayChildren: instant ? 0 : 0.02,
        },
      },
    }),
    [instant],
  )

  const textColumn = useMemo(
    () => ({
      hidden: {},
      show: {
        transition: {
          staggerChildren: instant ? 0 : 0.045,
          delayChildren: instant ? 0 : 0.06,
        },
      },
    }),
    [instant],
  )

  return (
    <section
      ref={heroRef}
      id="hero"
      className={cn(
        'relative flex min-h-[100dvh] flex-col overflow-hidden border-b border-zinc-200/70 bg-transparent px-4 pb-10 pt-20 dark:border-zinc-800 sm:px-6 sm:pb-12 sm:pt-24 md:px-8 md:pb-14 md:pt-24 lg:px-12 lg:pb-16 lg:pt-28 supports-[min-height:100svh]:min-h-[100svh]',
      )}
    >
      {/* Съдържание — центрирано във viewport под навбара */}
      <div className="relative flex w-full flex-1 flex-col justify-center py-6 sm:py-8 md:py-10 lg:py-12">
        <motion.div
          variants={heroRow}
          initial="hidden"
          animate="show"
          className={cn(
            'mx-auto flex w-full max-w-6xl flex-col items-center gap-10 text-center',
            'lg:flex-row lg:items-center lg:justify-center lg:gap-14 lg:text-left xl:gap-20',
          )}
        >
          <motion.div
            variants={photoSnap}
            className="flex w-full max-w-[240px] shrink-0 flex-col items-center gap-4 sm:max-w-[260px] lg:max-w-[min(100%,300px)] lg:w-[300px]"
          >
            <div className="relative w-full">
              <div
                className="pointer-events-none absolute -inset-1.5 rounded-3xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 opacity-70 blur-lg dark:opacity-55"
                aria-hidden
              />
              <div
                className={cn(
                  'relative overflow-hidden rounded-3xl border-2 border-white bg-zinc-100 shadow-2xl shadow-violet-500/10 ring-1 ring-zinc-900/5 dark:border-zinc-600 dark:bg-zinc-900 dark:shadow-black/40 dark:ring-white/10',
                  'aspect-[4/5] w-full max-h-[300px] sm:max-h-[320px] lg:max-h-[380px]',
                )}
              >
                <img
                  src={profileSrc}
                  alt=""
                  width={480}
                  height={600}
                  loading="eager"
                  decoding="async"
                  className="h-full w-full object-contain object-center p-3 sm:p-3.5"
                />
              </div>
            </div>

            <div
              className={cn(
                'inline-flex max-w-full items-center gap-2 rounded-full border border-zinc-600/70 bg-zinc-950/95 px-3.5 py-2 pl-3',
                'shadow-sm shadow-black/40 ring-1 ring-white/[0.06] backdrop-blur-md',
                'dark:border-zinc-600/80 dark:bg-[#0c1018]/95',
              )}
              role="status"
              aria-label={availabilityLabel}
            >
              <span
                className="size-2 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_0_2px_rgba(16,185,129,0.35)]"
                aria-hidden
              />
              <span className="text-center text-[0.8125rem] font-medium leading-snug tracking-tight text-white sm:text-sm">
                {availabilityLabel}
              </span>
            </div>
          </motion.div>

          <motion.div variants={textColumn} className="min-w-0 max-w-xl lg:max-w-2xl">
            <motion.p
              variants={lineSnap}
              className="mb-3 flex items-center justify-center gap-1.5 font-mono text-[11px] tracking-[0.12em] text-zinc-500 dark:text-zinc-400 sm:text-xs lg:justify-start"
            >
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                ~/
              </span>
              <span className="font-semibold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-400">
                portfolio
              </span>
            </motion.p>
            <motion.h1
              variants={lineSnap}
              className="break-words text-balance font-[family-name:Space_Grotesk,sans-serif] text-4xl font-semibold leading-[1.08] tracking-tight text-zinc-900 dark:text-white sm:text-5xl md:text-6xl lg:text-[3.35rem] xl:text-[3.65rem] xl:leading-[1.06]"
            >
              {name}
            </motion.h1>

            <motion.div
              variants={lineSnap}
              className="mt-5 flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1 lg:justify-start"
            >
              <span
                className="select-none font-mono text-lg font-semibold text-emerald-600 dark:text-emerald-400 sm:text-xl"
                aria-hidden
              >
                $
              </span>
              <span className="inline-flex max-w-full items-baseline gap-1">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeTitle}
                    initial={
                      instant ? { opacity: 1, x: 0 } : { opacity: 0, x: 14 }
                    }
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: {
                        duration: instant ? 0 : 0.22,
                        ease: SNAP_EASE,
                      },
                    }}
                    exit={
                      instant
                        ? { opacity: 1 }
                        : {
                            opacity: 0,
                            x: -14,
                            transition: {
                              duration: instant ? 0 : 0.14,
                              ease: SNAP_EASE,
                            },
                          }
                    }
                    className="font-[family-name:Space_Grotesk,sans-serif] text-xl font-semibold tabular-nums sm:text-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-fuchsia-400"
                  >
                    {activeTitle}
                  </motion.span>
                </AnimatePresence>
                {!instant ? (
                  <span
                    className="hero-caret-blink hidden font-mono text-xl font-bold leading-none text-violet-600 motion-safe:inline dark:text-violet-400 sm:text-2xl"
                    aria-hidden
                  >
                    ▌
                  </span>
                ) : null}
              </span>
            </motion.div>

            <motion.div
              variants={lineSnap}
              className="mt-10 flex flex-wrap justify-center gap-3 sm:gap-4 lg:justify-start"
            >
              <a
                href="#projects"
                className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-zinc-900/20 transition hover:bg-zinc-800 sm:text-base dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
              >
                {projectsLabel}
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white/80 px-7 py-3.5 text-sm font-semibold text-zinc-800 backdrop-blur-md transition hover:border-violet-400 hover:text-violet-700 sm:text-base dark:border-zinc-600 dark:bg-zinc-900/55 dark:text-zinc-100 dark:hover:border-violet-500 dark:hover:text-violet-300"
              >
                {contactLabel}
              </a>
              {resumeHref && resumeLabel ? (
                <a
                  href={resumeHref}
                  download={resumeDownloadName}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-400/60 bg-violet-500/15 px-7 py-3.5 text-sm font-semibold text-violet-700 backdrop-blur-md transition hover:border-violet-500 hover:bg-violet-500/25 sm:text-base dark:border-violet-500/45 dark:text-violet-300 dark:hover:bg-violet-500/25"
                >
                  <i className="fa-regular fa-file-pdf" aria-hidden />
                  {resumeLabel}
                </a>
              ) : null}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
