import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import type { PortfolioLang, Project } from '../types/portfolio'
import { useUiStrings } from '../hooks/useUiStrings'
import { SectionHeading } from './SectionHeading'
import { cn } from '../utils/cn'

interface ProjectsProps {
  eyebrow?: string
  title: string
  projects: Project[]
  lang: PortfolioLang
}

const CARD_SLIDE_MS = 4200

const galleryArrowClass =
  'pointer-events-auto z-30 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/50 text-white shadow-md backdrop-blur-sm transition hover:bg-black/65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 sm:h-10 sm:w-10'

function ProjectCardSlideshow({
  images,
  noImageLabel,
}: {
  images: string[]
  noImageLabel: string
}) {
  const ui = useUiStrings()
  const slides = useMemo(() => images.filter(Boolean), [images])
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const activeIndex =
    slides.length === 0 ? 0 : ((active % slides.length) + slides.length) % slides.length

  useEffect(() => {
    if (slides.length <= 1 || paused) return
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % slides.length)
    }, CARD_SLIDE_MS)
    return () => window.clearInterval(id)
  }, [slides.length, paused])

  if (!slides.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 bg-zinc-100 px-4 text-center dark:bg-zinc-800">
        <i
          className="fa-regular fa-image text-3xl text-zinc-400"
          aria-hidden
        />
        <span className="max-w-[14rem] text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {noImageLabel}
        </span>
      </div>
    )
  }

  return (
    <div
      className="relative h-full min-h-0 w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0 transition duration-500 ease-out group-hover:scale-105">
        {slides.map((src, idx) => (
          <img
            key={`${src}-${idx}`}
            src={`/${src}`}
            alt=""
            draggable={false}
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out',
              idx === activeIndex
                ? 'opacity-100'
                : 'pointer-events-none opacity-0',
            )}
          />
        ))}
      </div>
      {slides.length > 1 ? (
        <>
          <button
            type="button"
            aria-label={ui.galleryPrev}
            className={cn(
              galleryArrowClass,
              'absolute left-2 top-1/2 -translate-y-1/2',
            )}
            onClick={(e) => {
              e.stopPropagation()
              setPaused(true)
              setActive((i) => (i - 1 + slides.length) % slides.length)
            }}
          >
            <i
              className="fa-solid fa-chevron-left text-sm sm:text-base"
              aria-hidden
            />
          </button>
          <button
            type="button"
            aria-label={ui.galleryNext}
            className={cn(
              galleryArrowClass,
              'absolute right-2 top-1/2 -translate-y-1/2',
            )}
            onClick={(e) => {
              e.stopPropagation()
              setPaused(true)
              setActive((i) => (i + 1) % slides.length)
            }}
          >
            <i
              className="fa-solid fa-chevron-right text-sm sm:text-base"
              aria-hidden
            />
          </button>
          <div
            className="pointer-events-none absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 gap-1 rounded-full bg-black/40 px-2 py-1 backdrop-blur-sm"
            aria-hidden
          >
            {slides.map((_, idx) => (
              <span
                key={idx}
                className={cn(
                  'block h-1 rounded-full transition-all duration-300',
                  idx === activeIndex ? 'w-4 bg-white' : 'w-1 bg-white/60',
                )}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}

export function Projects({ eyebrow, title, projects, lang }: ProjectsProps) {
  const ui = useUiStrings()
  const noImageLabel =
    lang === 'bg' ? 'Визуализация предстои' : 'Screenshot coming soon'
  const [active, setActive] = useState<Project | null>(null)
  const [modalSlide, setModalSlide] = useState(0)

  const modalSlides = useMemo(
    () => active?.images.filter(Boolean) ?? [],
    [active],
  )

  const modalSlideIndex =
    modalSlides.length === 0
      ? 0
      : ((modalSlide % modalSlides.length) + modalSlides.length) %
        modalSlides.length

  const openProject = (project: Project) => {
    setModalSlide(0)
    setActive(project)
  }

  useEffect(() => {
    document.body.style.overflow = active ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [active])

  useEffect(() => {
    if (!active || modalSlides.length <= 1) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setModalSlide((i) => i - 1)
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        setModalSlide((i) => i + 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, modalSlides.length])

  return (
    <>
      <section
        id="projects"
        className="scroll-mt-24 border-b border-zinc-200/70 bg-transparent px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:px-12 lg:py-28 dark:border-zinc-800"
      >
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow={eyebrow} title={title} />

          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project, i) => {
              return (
                <motion.div
                  key={project.title + project.startDate}
                  role="button"
                  tabIndex={0}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  onClick={() => openProject(project)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      openProject(project)
                    }
                  }}
                  className={cn(
                    'group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-zinc-200/90 bg-white text-left shadow-sm outline-none transition',
                    'hover:border-violet-300 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 dark:border-zinc-700 dark:bg-zinc-950/80 dark:hover:border-violet-800',
                  )}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <ProjectCardSlideshow
                      images={project.images}
                      noImageLabel={noImageLabel}
                    />
                    <span className="pointer-events-none absolute left-3 top-3 z-20 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                      {project.startDate}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-[family-name:Space_Grotesk,sans-serif] text-lg font-semibold text-zinc-900 dark:text-white">
                      {project.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {project.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.technologies.slice(0, 4).map((t) => (
                        <span
                          key={t.name}
                          className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                        >
                          {t.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence mode="wait">
            {active ? (
              <motion.div
                key={active.title}
                role="dialog"
                aria-modal="true"
                aria-labelledby="project-modal-title"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-4"
                onClick={() => setActive(null)}
              >
                <motion.div
                  initial={{ scale: 0.94, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.96, opacity: 0 }}
                  transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                  className="flex max-h-[min(94vh,calc(100dvh-1rem))] w-full max-w-[min(72rem,calc(100vw-1rem))] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-950"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex shrink-0 items-start justify-between gap-4 border-b border-zinc-200 px-4 py-4 dark:border-zinc-800 sm:px-6 sm:py-4">
                    <h3
                      id="project-modal-title"
                      className="min-w-0 flex-1 pr-2 font-[family-name:Space_Grotesk,sans-serif] text-xl font-semibold text-zinc-900 dark:text-white"
                    >
                      {active.title}
                    </h3>
                    <button
                      type="button"
                      className="shrink-0 rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      onClick={() => setActive(null)}
                      aria-label={ui.closeDialog}
                    >
                      <i className="fa-solid fa-xmark" />
                    </button>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5">
                  {modalSlides.length > 0 ? (
                    <div className="relative mb-4">
                      <div className="relative flex min-h-[12rem] justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900">
                        <img
                          src={`/${modalSlides[modalSlideIndex]}`}
                          alt=""
                          className="max-h-[85vh] w-auto max-w-full object-contain"
                        />
                        {modalSlides.length > 1 ? (
                          <>
                            <button
                              type="button"
                              aria-label={ui.galleryPrev}
                              className={cn(
                                galleryArrowClass,
                                'absolute left-2 top-1/2 -translate-y-1/2',
                              )}
                              onClick={() => setModalSlide((i) => i - 1)}
                            >
                              <i
                                className="fa-solid fa-chevron-left text-sm sm:text-base"
                                aria-hidden
                              />
                            </button>
                            <button
                              type="button"
                              aria-label={ui.galleryNext}
                              className={cn(
                                galleryArrowClass,
                                'absolute right-2 top-1/2 -translate-y-1/2',
                              )}
                              onClick={() => setModalSlide((i) => i + 1)}
                            >
                              <i
                                className="fa-solid fa-chevron-right text-sm sm:text-base"
                                aria-hidden
                              />
                            </button>
                            <div
                              className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1 rounded-full bg-black/40 px-2 py-1 backdrop-blur-sm"
                              aria-hidden
                            >
                              {modalSlides.map((_, idx) => (
                                <span
                                  key={idx}
                                  className={cn(
                                    'block h-1 rounded-full transition-all duration-300',
                                    idx === modalSlideIndex
                                      ? 'w-4 bg-white'
                                      : 'w-1 bg-white/60',
                                  )}
                                />
                              ))}
                            </div>
                          </>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                  <p className="text-zinc-600 dark:text-zinc-300">
                    {active.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {active.technologies.map((t) => (
                      <span
                        key={t.name}
                        className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium dark:bg-zinc-800"
                      >
                        <i className={`${t.class} text-sm`} aria-hidden />
                        {t.name}
                      </span>
                    ))}
                  </div>
                  {active.url ? (
                    <a
                      href={active.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-violet-600 hover:underline dark:text-violet-400"
                    >
                      {ui.projectRepoLink}
                      <i className="fa-solid fa-arrow-up-right-from-square text-xs" />
                    </a>
                  ) : null}
                  </div>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>,
          document.body,
        )}
    </>
  )
}
