import { motion } from 'framer-motion'
import { SectionHeading } from './SectionHeading'

interface AboutProps {
  eyebrow?: string
  sectionTitle: string
  greeting: string
  description: string
}

export function About({
  eyebrow,
  sectionTitle,
  greeting,
  description,
}: AboutProps) {
  const paragraphs = description.split(/\n\n+/).filter(Boolean)

  return (
    <section
      id="about"
      className="scroll-mt-24 border-b border-zinc-200/70 bg-transparent px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:px-12 lg:py-28 dark:border-zinc-800"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={eyebrow} title={sectionTitle} />
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.45 }}
          className="mx-auto w-full max-w-3xl text-left"
        >
          <p className="mb-6 font-[family-name:Space_Grotesk,sans-serif] text-[clamp(1.125rem,2.8vw,1.5rem)] font-medium leading-snug text-violet-700 dark:text-violet-400 sm:mb-8">
            {greeting}
          </p>
          <div className="space-y-4 text-[clamp(0.9375rem,2.2vw,1.125rem)] leading-[1.65] text-zinc-600 dark:text-zinc-300 sm:space-y-5 sm:leading-relaxed">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
