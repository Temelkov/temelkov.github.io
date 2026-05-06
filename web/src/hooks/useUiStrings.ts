import { useMemo } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { getUiStrings } from '../i18n/uiStrings'

export function useUiStrings() {
  const { lang } = useLanguage()
  return useMemo(() => getUiStrings(lang), [lang])
}
