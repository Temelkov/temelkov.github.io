import type { PortfolioLang } from '../types/portfolio'

export type UiStrings = {
  loadingPortfolio: string
  loadFailed: string
  retry: string
  contactIntroBefore: string
  contactIntroAfter: string
  privacyNote: string
  footerRights: string
  projectRepoLink: string
  closeDialog: string
  galleryPrev: string
  galleryNext: string
  ariaHome: string
  ariaToggleLang: string
  ariaToggleTheme: string
  ariaMenu: string
  mailSubjectFallback: string
}

const EN: UiStrings = {
  loadingPortfolio: 'Loading portfolio…',
  loadFailed: 'Failed to load portfolio data.',
  retry: 'Retry',
  contactIntroBefore: 'Reach me directly at ',
  contactIntroAfter:
    ' or use the form — it opens your mail client.',
  privacyNote: 'I will not share your data.',
  footerRights: 'All rights reserved.',
  projectRepoLink: 'Repository / link',
  closeDialog: 'Close',
  galleryPrev: 'Previous image',
  galleryNext: 'Next image',
  ariaHome: 'Home',
  ariaToggleLang: 'Toggle language',
  ariaToggleTheme: 'Toggle theme',
  ariaMenu: 'Menu',
  mailSubjectFallback: 'Portfolio contact from ',
}

const BG: UiStrings = {
  loadingPortfolio: 'Зареждане на портфолиото…',
  loadFailed: 'Неуспешно зареждане на данните за портфолиото.',
  retry: 'Опитай отново',
  contactIntroBefore: 'Пишете ми на ',
  contactIntroAfter:
    ' или използвайте формуляра — ще се отвори имейл клиентът ви (без сървър).',
  privacyNote: 'Няма да споделям вашите данни.',
  footerRights: 'Всички права запазени.',
  projectRepoLink: 'Хранилище / връзка',
  closeDialog: 'Затвори',
  galleryPrev: 'Предишна снимка',
  galleryNext: 'Следваща снимка',
  ariaHome: 'Начало',
  ariaToggleLang: 'Превключване на езика',
  ariaToggleTheme: 'Превключване на темата',
  ariaMenu: 'Меню',
  mailSubjectFallback: 'Запитване от портфолио от ',
}

export function getUiStrings(lang: PortfolioLang): UiStrings {
  return lang === 'bg' ? BG : EN
}
