export interface SocialLink {
  name: string
  url: string
  class: string
}

export interface PortfolioShared {
  basic_info: {
    name: string
    titles: string[]
    social: SocialLink[]
    image: string
  }
  skills: {
    icons: {
      name: string
      class: string
      level: string
    }[]
  }
}

export interface ProjectTech {
  class: string
  name: string
}

export interface Project {
  title: string
  startDate: string
  description: string
  images: string[]
  url: string
  technologies: ProjectTech[]
}

export interface ExperienceEntry {
  company: string
  title: string
  years: string
  mainTech: string[]
  technologies: string[]
}

export interface ResumeLanguage {
  basic_info: {
    description_header: string
    description: string
    section_name: {
      about: string
      projects: string
      skills: string
      experience: string
      contact: string
    }
  }
  projects: Project[]
  experience: ExperienceEntry[]
  contact: {
    section_name: { contact: string }
    name: string
    email: string
    topic: string
    message: string
    submit: string
  }
}

export type PortfolioLang = 'en' | 'bg'
