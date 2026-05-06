import { motion } from 'framer-motion'
import { SectionHeading } from './SectionHeading'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface SkillIcon {
  name: string
  class: string
  level: string
}

interface SkillsProps {
  title: string
  eyebrow?: string
  icons: SkillIcon[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.045, delayChildren: 0.05 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 22, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 420, damping: 28 },
  },
}

export function Skills({ title, eyebrow, icons }: SkillsProps) {
  const reduced = useReducedMotion()

  return (
    <section
      id="skills"
      className="relative scroll-mt-24 overflow-hidden border-b border-zinc-200/70 bg-transparent px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:px-12 lg:py-28 dark:border-zinc-800"
    >
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading eyebrow={eyebrow} title={title} />

        <motion.div
          className="grid grid-cols-2 gap-4 perspective-[1000px] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {icons.map((skill, i) => {
            const floatDuration = 2.8 + (i % 7) * 0.15

            return (
              <motion.div
                key={`${skill.name}-${i}`}
                variants={cardVariants}
                whileHover={{
                  y: -6,
                  scale: 1.02,
                  transition: { type: 'spring', stiffness: 420, damping: 22 },
                }}
                style={{ transformStyle: 'preserve-3d' }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/80 bg-white/65 p-4 pb-5 shadow-md shadow-zinc-900/[0.03] ring-1 ring-zinc-200/75 backdrop-blur-md transition-[box-shadow,border-color] duration-300 hover:border-violet-200/90 hover:shadow-xl hover:shadow-violet-500/15 hover:ring-violet-300/40 dark:border-zinc-700/75 dark:bg-zinc-950/45 dark:shadow-black/25 dark:ring-zinc-700/90 dark:hover:border-violet-600/45 dark:hover:shadow-violet-950/30 dark:hover:ring-violet-500/30 md:rounded-3xl md:p-5 md:pb-6"
              >
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/[0.03] via-transparent to-cyan-500/[0.04] opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:rounded-3xl dark:from-violet-500/[0.06] dark:to-cyan-500/[0.06]" />

                <div className="relative flex flex-1 flex-col items-center justify-center gap-3 py-3 md:py-4">
                  <motion.span
                    className="inline-flex text-zinc-800 dark:text-zinc-100"
                    animate={
                      reduced
                        ? {}
                        : {
                            y: [0, -4, 0],
                          }
                    }
                    transition={{
                      duration: floatDuration,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.07,
                    }}
                    whileHover={
                      reduced
                        ? {}
                        : {
                            rotate: [0, -6, 6, 0],
                            scale: 1.1,
                            transition: { duration: 0.4 },
                          }
                    }
                  >
                    <i
                      className={`${skill.class} text-[2.35rem] transition-colors duration-300 group-hover:text-violet-600 md:text-4xl dark:group-hover:text-violet-400`}
                      aria-hidden
                    />
                  </motion.span>
                  <span className="text-center text-[0.7rem] font-semibold uppercase tracking-wide text-zinc-700 transition group-hover:text-zinc-900 dark:text-zinc-200 dark:group-hover:text-white md:text-xs">
                    {skill.name}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
