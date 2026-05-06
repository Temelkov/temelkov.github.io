import { motion } from 'framer-motion'
import type { ExperienceEntry } from '../types/portfolio'
import { SectionHeading } from './SectionHeading'
import { cn } from '../utils/cn'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface ExperienceProps {
  title: string
  eyebrow?: string
  entries: ExperienceEntry[]
}

function roleDescription(job: ExperienceEntry): string {
  const primary = job.mainTech.join(', ')
  const rest = job.technologies.filter((t) => !job.mainTech.includes(t))
  const detail = rest.join(', ')
  if (!detail) return `${primary}.`
  return `${primary}. ${detail}.`
}

/** Същият viewport като каретата за позиции — един „първи скрол“ в секцията */
const timelineViewport = { once: true, margin: '-60px' as const }

export function ExperienceSection({ title, eyebrow, entries }: ExperienceProps) {
  const reduced = useReducedMotion()

  return (
    <section
      id="experience"
      className="relative scroll-mt-24 overflow-hidden border-b border-zinc-200/70 bg-transparent px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:px-12 lg:py-28 dark:border-zinc-800"
    >
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading eyebrow={eyebrow} title={title} />

        <div className="experience-career-root relative mx-auto w-full max-md:w-[calc(100%-1.25rem)] md:px-2">
          {/*
            Външен div: само translate за центриране по X.
            Вътрешен motion: само scaleY — без конфликт с Tailwind translate.
          */}
          <div
            className="pointer-events-none absolute bottom-10 left-[14px] top-2 z-0 -translate-x-1/2 md:bottom-14 md:left-1/2 md:top-4"
            aria-hidden
          >
            <motion.div
              className="h-full w-[3px] rounded-full bg-gradient-to-t from-cyan-400 via-violet-500 to-transparent opacity-95 shadow-[0_0_16px_rgba(139,92,246,0.45)]"
              initial={reduced ? { scaleY: 1 } : { scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={timelineViewport}
              transition={{
                duration: reduced ? 0 : 0.78,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ transformOrigin: 'top' }}
            />
          </div>
          <div
            className="pointer-events-none absolute bottom-6 left-[14px] z-[2] -translate-x-1/2 md:left-1/2"
            aria-hidden
          >
            <motion.div
              className="h-2.5 w-2.5 rounded-full bg-cyan-400"
              initial={
                reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.45 }
              }
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={timelineViewport}
              transition={{
                duration: reduced ? 0 : 0.38,
                delay: reduced ? 0 : 0.52,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </div>

          <div className="relative z-[1] flex flex-col gap-14 md:gap-[4.5rem]">
            {entries.map((job, index) => (
              <motion.article
                key={`${job.company}-${job.years}-${index}`}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={timelineViewport}
                transition={{
                  duration: 0.55,
                  delay: index * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={cn(
                  'relative flex flex-col gap-6 max-md:pl-[10%]',
                  'md:flex-row md:items-start md:justify-between md:gap-10 md:pl-0',
                )}
              >
                <div
                  className={cn(
                    'flex w-full flex-col gap-4',
                    'md:w-[42%] md:flex-row md:items-start md:justify-between md:gap-8 md:pr-2',
                  )}
                >
                  <div className="min-w-0 flex-1 md:text-right">
                    <h3 className="font-[family-name:Space_Grotesk,sans-serif] text-[clamp(1.65rem,3.5vw,2.75rem)] font-medium leading-tight text-zinc-900 dark:text-white">
                      {job.title}
                    </h3>
                    <p className="mt-2 font-[family-name:Space_Grotesk,sans-serif] text-[clamp(1rem,2vw,1.35rem)] font-medium leading-snug text-violet-600 dark:text-violet-400">
                      {job.company}
                    </p>
                  </div>
                  <div className="shrink-0 md:max-w-[11rem] md:text-right">
                    <p className="font-[family-name:Space_Grotesk,sans-serif] text-[clamp(1.85rem,4vw,3rem)] font-medium tabular-nums leading-none tracking-tight text-zinc-800 dark:text-zinc-100">
                      {job.years}
                    </p>
                  </div>
                </div>

                <div className="w-full max-md:pl-[10%] md:w-[42%] md:min-h-[4rem]">
                  <p className="text-[clamp(0.875rem,2.1vw,1.125rem)] font-light leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-lg md:leading-relaxed">
                    {roleDescription(job)}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
