/* eslint-disable react-refresh/only-export-components -- context module exports hooks + provider */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { PortfolioLang } from '../types/portfolio'

const STORAGE_KEY = 'portfolio-lang'

interface LanguageContextValue {
  lang: PortfolioLang
  setLang: (l: PortfolioLang) => void
  toggleLang: () => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function readStoredLang(): PortfolioLang {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'bg' || v === 'en') return v
  } catch {
    /* ignore */
  }
  return 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<PortfolioLang>(() =>
    typeof window !== 'undefined' ? readStoredLang() : 'en',
  )

  const setLang = useCallback((l: PortfolioLang) => {
    setLangState(l)
    try {
      localStorage.setItem(STORAGE_KEY, l)
    } catch {
      /* ignore */
    }
    document.documentElement.lang = l === 'bg' ? 'bg' : 'en'
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang === 'bg' ? 'bg' : 'en'
  }, [lang])

  const toggleLang = useCallback(() => {
    setLang(lang === 'en' ? 'bg' : 'en')
  }, [lang, setLang])

  const value = useMemo(
    () => ({ lang, setLang, toggleLang }),
    [lang, setLang, toggleLang],
  )

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
