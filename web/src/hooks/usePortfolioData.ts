import { useEffect, useState } from 'react'
import type {
  PortfolioLang,
  PortfolioShared,
  ResumeLanguage,
} from '../types/portfolio'

interface PortfolioState {
  shared: PortfolioShared | null
  resume: ResumeLanguage | null
  loading: boolean
  error: string | null
}

export function usePortfolioData(lang: PortfolioLang): PortfolioState {
  const [state, setState] = useState<PortfolioState>({
    shared: null,
    resume: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false
    const resumeUrl =
      lang === 'bg'
        ? '/res_secondaryLanguage.json'
        : '/res_primaryLanguage.json'

    // Reload JSON when language changes; clear stale content while fetching.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset tied to `lang` dependency
    setState({ shared: null, resume: null, loading: true, error: null })

    Promise.all([
      fetch('/portfolio_shared_data.json').then((r) => {
        if (!r.ok) throw new Error('portfolio_shared_data.json')
        return r.json() as Promise<PortfolioShared>
      }),
      fetch(resumeUrl).then((r) => {
        if (!r.ok) throw new Error(resumeUrl)
        return r.json() as Promise<ResumeLanguage>
      }),
    ])
      .then(([shared, resume]) => {
        if (!cancelled)
          setState({ shared, resume, loading: false, error: null })
      })
      .catch(() => {
        if (!cancelled)
          setState({
            shared: null,
            resume: null,
            loading: false,
            error: 'Failed to load portfolio data.',
          })
      })

    return () => {
      cancelled = true
    }
  }, [lang])

  return state
}
