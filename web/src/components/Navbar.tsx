import { useEffect, useState } from 'react'
import { useUiStrings } from '../hooks/useUiStrings'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { cn } from '../utils/cn'

const NAV_ITEMS = [
  { href: '#hero', id: 'home' as const },
  { href: '#about', id: 'about' as const },
  { href: '#experience', id: 'experience' as const },
  { href: '#skills', id: 'skills' as const },
  { href: '#projects', id: 'projects' as const },
  { href: '#contact', id: 'contact' as const },
]

export type NavLabels = Record<(typeof NAV_ITEMS)[number]['id'], string>

interface NavbarProps {
  labels: NavLabels
}

export function Navbar({ labels }: NavbarProps) {
  const ui = useUiStrings()
  const { lang, toggleLang } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-zinc-200/80 bg-white/80 py-3 backdrop-blur-lg dark:border-zinc-800 dark:bg-zinc-950/80'
          : 'bg-transparent py-5',
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12">
        <a
          href="#hero"
          className="group flex items-center rounded-xl py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
          aria-label={ui.ariaHome}
        >
          <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-white shadow-md ring-2 ring-violet-500/25 transition group-hover:ring-violet-500/50 dark:bg-zinc-900 dark:ring-violet-400/30">
            <img
              src="/favicon.ico"
              alt=""
              width={40}
              height={40}
              className="h-full w-full object-contain p-0.5"
            />
          </span>
        </a>

        <div className="hidden items-center gap-6 md:flex lg:gap-8">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-zinc-600 transition hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400"
            >
              {labels[item.id]}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLang}
            className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-700 transition hover:border-violet-400 dark:border-zinc-600 dark:text-zinc-200 dark:hover:border-violet-500"
            aria-label={ui.ariaToggleLang}
          >
            {lang === 'en' ? 'EN' : 'BG'}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 transition hover:border-violet-400 dark:border-zinc-600 dark:text-zinc-200"
            aria-label={ui.ariaToggleTheme}
          >
            {theme === 'dark' ? (
              <i className="fa-solid fa-sun" />
            ) : (
              <i className="fa-solid fa-moon" />
            )}
          </button>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 md:hidden dark:border-zinc-600"
            aria-expanded={open}
            aria-label={ui.ariaMenu}
            onClick={() => setOpen((o) => !o)}
          >
            <i className={`fa-solid ${open ? 'fa-xmark' : 'fa-bars'}`} />
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-b border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950 sm:px-6 md:hidden">
          <div className="flex flex-col gap-3">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-zinc-700 dark:text-zinc-200"
                onClick={() => setOpen(false)}
              >
                {labels[item.id]}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  )
}
