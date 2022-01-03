const dev = process.env.NODE_ENV === 'development'
export function isDev(devFn, prodFn) {
  if (dev) {
    return devFn
  } else {
    return prodFn
  }
}