import { createRequire } from 'module'
const require = createRequire(import.meta.url)

export function loadPackageJson () {
  return require('../../package.json')
}
