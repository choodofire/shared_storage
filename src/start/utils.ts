export function normalizePort(val: any) {
  const port = parseInt(val, 10)
  if (isNaN(port)) return false
  if (port >= 0) return port
  return false
}