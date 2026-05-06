import { type FormEvent, useState } from 'react'
import { motion } from 'framer-motion'
import { SectionHeading } from './SectionHeading'
import { CONTACT_EMAIL } from '../config/contact'
import { useUiStrings } from '../hooks/useUiStrings'

interface ContactProps {
  eyebrow?: string
  labels: {
    section: string
    name: string
    email: string
    topic: string
    message: string
    submit: string
  }
}

export function Contact({ eyebrow, labels }: ContactProps) {
  const ui = useUiStrings()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [topic, setTopic] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const subject = encodeURIComponent(
      topic || `${ui.mailSubjectFallback}${name}`,
    )
    const body = encodeURIComponent(
      `${message}\n\n---\nFrom: ${name}\nReply-to: ${email}`,
    )
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
  }

  return (
    <section
      id="contact"
      className="scroll-mt-24 bg-transparent px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="grid gap-12 lg:grid-cols-2 lg:gap-16"
        >
          <div className="mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none">
            <SectionHeading eyebrow={eyebrow} title={labels.section} />
            <p className="mx-auto max-w-md text-center text-[clamp(0.9375rem,2vw,1rem)] leading-relaxed text-zinc-600 dark:text-zinc-400 lg:mx-0 lg:max-w-md lg:text-left">
              {ui.contactIntroBefore}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-semibold text-violet-600 underline-offset-4 hover:underline dark:text-violet-400"
              >
                {CONTACT_EMAIL}
              </a>
              {ui.contactIntroAfter}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full min-w-0 rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-950/80 md:p-8"
          >
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {labels.name}
                </span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none ring-violet-500/30 transition focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {labels.email}
                </span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none ring-violet-500/30 transition focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {labels.topic}
                </span>
                <input
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none ring-violet-500/30 transition focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {labels.message}
                </span>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full resize-y rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none ring-violet-500/30 transition focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white"
                />
              </label>
            </div>
            <button
              type="submit"
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:opacity-95 dark:from-violet-500 dark:to-fuchsia-500"
            >
              {labels.submit}
            </button>
            <p className="mt-3 text-center text-xs text-zinc-500 dark:text-zinc-500">
              {ui.privacyNote}
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
