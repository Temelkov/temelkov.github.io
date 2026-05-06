import { useLanguage } from './context/LanguageContext'
import { usePortfolioData } from './hooks/usePortfolioData'
import { useUiStrings } from './hooks/useUiStrings'
import type { NavLabels } from './components/Navbar'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { ExperienceSection } from './components/ExperienceSection'
import { Skills } from './components/Skills'
import { Projects } from './components/Projects'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import {
  RESUME_DOWNLOAD_FILENAME,
  RESUME_PDF_PATH,
} from './config/resume'

export function PortfolioShell() {
  const { lang } = useLanguage()
  const ui = useUiStrings()
  const { shared, resume, loading, error } = usePortfolioData(lang)

  if (!shared || !resume) {
    if (loading) {
      return (
        <div className="relative z-[60] flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 dark:bg-zinc-950">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-violet-600 border-t-transparent dark:border-violet-400" />
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {ui.loadingPortfolio}
          </p>
        </div>
      )
    }
    return (
      <div className="relative z-[60] flex min-h-screen flex-col items-center justify-center gap-4 px-4 bg-zinc-50 dark:bg-zinc-950">
        <p className="text-center text-zinc-700 dark:text-zinc-300">
          {error ?? ui.loadFailed}
        </p>
        <button
          type="button"
          className="rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white"
          onClick={() => window.location.reload()}
        >
          {ui.retry}
        </button>
      </div>
    )
  }

  const sn = resume.basic_info.section_name

  const navLabels: NavLabels = {
    home: lang === 'bg' ? 'Начало' : 'Home',
    about: sn.about,
    experience: sn.experience,
    skills: sn.skills,
    projects: sn.projects,
    contact: sn.contact,
  }

  const contactLabels = {
    section: resume.contact.section_name.contact,
    name: resume.contact.name,
    email: resume.contact.email,
    topic: resume.contact.topic,
    message: resume.contact.message,
    submit: resume.contact.submit,
  }

  const resumeLabel =
    lang === 'bg' ? 'Изтегли CV (PDF)' : 'Download resume (PDF)'

  return (
    <>
      <Navbar labels={navLabels} />
      <div className="relative z-[2]">
        <main>
          <Hero
            name={shared.basic_info.name}
            titles={shared.basic_info.titles}
            profileSrc={`/${shared.basic_info.image}`}
            resumeHref={RESUME_PDF_PATH}
            resumeLabel={resumeLabel}
            resumeDownloadName={RESUME_DOWNLOAD_FILENAME}
            projectsLabel={navLabels.projects}
            contactLabel={navLabels.contact}
          />
          <About
            eyebrow={lang === 'bg' ? 'Запознаване' : 'Intro'}
            sectionTitle={sn.about}
            greeting={resume.basic_info.description_header}
            description={resume.basic_info.description}
          />
          <ExperienceSection
            eyebrow={lang === 'bg' ? 'Хронология' : 'Timeline'}
            title={sn.experience}
            entries={resume.experience}
          />
          <Skills
            eyebrow={lang === 'bg' ? 'Технологичен стек' : 'Tech stack'}
            title={sn.skills}
            icons={shared.skills.icons}
          />
          <Projects
            eyebrow={lang === 'bg' ? 'Портфолио' : 'Portfolio'}
            title={sn.projects}
            projects={resume.projects}
            lang={lang}
          />
          <Contact
            eyebrow={lang === 'bg' ? 'Връзка' : 'Connect'}
            labels={contactLabels}
          />
        </main>
        <Footer
          name={shared.basic_info.name}
          social={shared.basic_info.social}
          resumeHref={RESUME_PDF_PATH}
          resumeLabel={resumeLabel}
          resumeDownloadName={RESUME_DOWNLOAD_FILENAME}
        />
      </div>
    </>
  )
}
