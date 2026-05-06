/** Devicon class suffixes, longest first (matches portfolio JSON). */
const DEVICON_SUFFIXES = [
  'plain-wordmark',
  'original-wordmark',
  'plain',
  'original',
  'line-wordmark',
  'line',
] as const

/** @see portfolio_shared_data.json tech stack — add a line here for new devicons */
const rawUrls = import.meta.glob(
  [
    '../../node_modules/devicon/icons/amazonwebservices/*.svg',
    '../../node_modules/devicon/icons/angular/*.svg',
    '../../node_modules/devicon/icons/angularmaterial/*.svg',
    '../../node_modules/devicon/icons/android/*.svg',
    '../../node_modules/devicon/icons/azure/*.svg',
    '../../node_modules/devicon/icons/bitbucket/*.svg',
    '../../node_modules/devicon/icons/bootstrap/*.svg',
    '../../node_modules/devicon/icons/css3/*.svg',
    '../../node_modules/devicon/icons/docker/*.svg',
    '../../node_modules/devicon/icons/dot-net/*.svg',
    '../../node_modules/devicon/icons/github/*.svg',
    '../../node_modules/devicon/icons/html5/*.svg',
    '../../node_modules/devicon/icons/java/*.svg',
    '../../node_modules/devicon/icons/javascript/*.svg',
    '../../node_modules/devicon/icons/jest/*.svg',
    '../../node_modules/devicon/icons/jira/*.svg',
    '../../node_modules/devicon/icons/linux/*.svg',
    '../../node_modules/devicon/icons/mongodb/*.svg',
    '../../node_modules/devicon/icons/mysql/*.svg',
    '../../node_modules/devicon/icons/php/*.svg',
    '../../node_modules/devicon/icons/postgresql/*.svg',
    '../../node_modules/devicon/icons/react/*.svg',
    '../../node_modules/devicon/icons/sass/*.svg',
    '../../node_modules/devicon/icons/typescript/*.svg',
    '../../node_modules/devicon/icons/wordpress/*.svg',
    '../../node_modules/devicon/icons/windows8/*.svg',
  ],
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>

/** Lowercase relative path like `mysql/mysql-original.svg` → bundled URL */
const urlByRelPath = new Map<string, string>()
for (const [absPath, url] of Object.entries(rawUrls)) {
  const normalized = absPath.replace(/\\/g, '/')
  const part = normalized.split('/icons/')[1]
  if (part) urlByRelPath.set(part.toLowerCase(), url)
}

function parseDeviconClass(className: string): { tech: string; suf: string } | null {
  const c = className.trim().toLowerCase()
  if (!c.startsWith('devicon-')) return null
  const raw = c.slice('devicon-'.length)
  for (const suf of DEVICON_SUFFIXES) {
    const dash = `-${suf}`
    if (raw.endsWith(dash)) {
      return { tech: raw.slice(0, -dash.length), suf }
    }
  }
  const i = raw.lastIndexOf('-')
  if (i <= 0) return null
  return { tech: raw.slice(0, i), suf: raw.slice(i + 1) }
}

/**
 * Resolves a bundled URL for devicon SVGs (no CDN). Falls back when e.g. mysql-plain
 * exists in CSS but npm pack only ships mysql-original.
 */
export function resolveDeviconAssetUrl(className: string): string | undefined {
  const parsed = parseDeviconClass(className)
  if (!parsed) return undefined
  const { tech, suf } = parsed
  const techL = tech.toLowerCase()

  const candidates: string[] = [`${techL}/${techL}-${suf}.svg`]

  if (suf === 'plain') {
    candidates.push(`${techL}/${techL}-original.svg`, `${techL}/${techL}-line.svg`)
  }
  if (suf === 'original') {
    candidates.push(`${techL}/${techL}-plain.svg`)
  }
  if (suf === 'plain-wordmark') {
    candidates.push(`${techL}/${techL}-original-wordmark.svg`)
  }
  if (suf === 'original-wordmark') {
    candidates.push(`${techL}/${techL}-plain-wordmark.svg`)
  }

  for (const rel of candidates) {
    const u = urlByRelPath.get(rel.toLowerCase())
    if (u) return u
  }

  const folder = [...urlByRelPath.entries()].filter(
    ([k]) => k.startsWith(`${techL}/`) && k.endsWith('.svg'),
  )
  if (folder.length === 0) return undefined
  const prefer = folder.filter(([k]) => !k.includes('wordmark'))
  const pool = prefer.length > 0 ? prefer : folder
  pool.sort(([a], [b]) => a.localeCompare(b))
  return pool[0]?.[1]
}
