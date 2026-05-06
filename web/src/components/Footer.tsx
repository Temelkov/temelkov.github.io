import type { PortfolioShared } from '../types/portfolio'
import { useUiStrings } from '../hooks/useUiStrings'

interface FooterProps {
  name: string
  social: PortfolioShared['basic_info']['social']
  resumeHref?: string
  resumeLabel?: string
  resumeDownloadName?: string
}

export function Footer({
  name,
  social,
  resumeHref,
  resumeLabel,
  resumeDownloadName,
}: FooterProps) {
  const ui = useUiStrings()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-zinc-200/80 bg-white/65 px-4 py-10 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/70 sm:px-6 md:px-8 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          © {year} {name}. {ui.footerRights}
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center md:justify-end">
          {resumeHref && resumeLabel ? (
            <a
              href={resumeHref}
              download={resumeDownloadName}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-violet-400 hover:text-violet-600 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-violet-500 dark:hover:text-violet-400"
            >
              <i className="fa-regular fa-file-pdf" aria-hidden />
              {resumeLabel}
            </a>
          ) : null}
          <div className="flex flex-wrap justify-center gap-3">
          {social.map((net) => (
            <a
              key={net.name}
              href={net.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-lg text-zinc-700 transition hover:border-violet-400 hover:text-violet-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-violet-500 dark:hover:text-violet-400"
              aria-label={net.name}
            >
              <i className={net.class} />
            </a>
          ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
