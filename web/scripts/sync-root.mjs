import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const webDir = path.resolve(__dirname, '..')
const distDir = path.join(webDir, 'dist')
const repoRoot = path.resolve(webDir, '..')

if (!fs.existsSync(distDir)) {
  console.error('dist/ not found. Run: npm run build')
  process.exit(1)
}

const removeIfExists = (relativePath) => {
  const full = path.join(repoRoot, relativePath)
  if (!fs.existsSync(full)) return
  fs.rmSync(full, { recursive: true })
  console.log('removed:', relativePath)
}

removeIfExists('static')
removeIfExists('service-worker.js')
removeIfExists('asset-manifest.json')

for (const name of fs.readdirSync(repoRoot)) {
  if (name.startsWith('precache-manifest') && name.endsWith('.js')) {
    fs.unlinkSync(path.join(repoRoot, name))
    console.log('removed:', name)
  }
}

fs.cpSync(distDir, repoRoot, { recursive: true })
console.log('Deployed dist ->', repoRoot)
