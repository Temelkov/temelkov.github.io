import { motion } from 'framer-motion'
import { cn } from '../utils/cn'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  className?: string
  /** По подразбиране центрирано като референцията */
  align?: 'center' | 'left'
}

export function SectionHeading({
  eyebrow,
  title,
  className,
  align = 'center',
}: SectionHeadingProps) {
  const reduced = useReducedMotion()

  return (
    <div
      className={cn(
        'mb-10 md:mb-14',
        align === 'center' && 'text-center',
        className,
      )}
    >
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-72px', amount: 0.25 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {eyebrow ? (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.38em] text-violet-500 dark:text-[#c4b5fd]">
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={cn(
            'font-[family-name:Space_Grotesk,sans-serif] text-[clamp(2rem,5.5vw,3.35rem)] font-bold leading-[1.06] tracking-tight',
            'bg-gradient-to-b from-violet-400 via-[#915eff] to-[#00d2ff] bg-clip-text text-transparent',
            'dark:from-[#e9d5ff] dark:via-[#a78bfa] dark:to-[#22d3ee]',
          )}
        >
          {title}
        </h2>
        <div
          className={cn(
            'mt-5 flex w-full',
            align === 'center' ? 'justify-center' : 'justify-start',
          )}
        >
          <motion.div
            className="h-[3px] w-full max-w-[min(220px,48vw)] rounded-full bg-gradient-to-r from-[#915eff] via-violet-400 to-[#00d2ff]"
            initial={{ scaleX: reduced ? 1 : 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{
              duration: 0.7,
              delay: reduced ? 0 : 0.14,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              transformOrigin: align === 'center' ? 'center' : 'left',
            }}
          />
        </div>
      </motion.div>
    </div>
  )
}
