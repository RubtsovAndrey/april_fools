const BASE = import.meta.env.BASE_URL

export default function asset(path) {
  const clean = path.startsWith('/') ? path.slice(1) : path
  return `${BASE}${clean}`
}
