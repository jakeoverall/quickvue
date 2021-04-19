const locale = 'en-US'
export const oneDay = (1000 * 60 * 60 * 24)
export function timeFilter(val) {
  const d = offsetHelper(val)
  if (!d) { return val }
  return d.toLocaleTimeString(locale, {
    hour: 'numeric',
    minute: 'numeric'
  })
}

export function dateFilter(val) {
  const d = offsetHelper(val)
  if (!d) { return val }
  return d.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export function dayDateFilter(val) {
  const d = offsetHelper(val)
  if (!d) { return val }
  const date = d.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })
  const day = d.toLocaleDateString(locale, { weekday: 'long' })
  return `${day} | ${date}`
}

export function datetimeFilter(val) {
  const d = offsetHelper(val)
  if (!d) { return val }
  return d.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })
}
export function numDaysBetween(d1, d2) {
  d1 = offsetHelper(d1)
  d2 = offsetHelper(d2)
  if (!d1 || !d2) { return 0 }
  const diff = d2.getTime() - d1.getTime()
  return ~~(diff / oneDay)
}

function offsetHelper(val) {
  try {
    let input = ''
    if (typeof val === 'string') {
      input = val.slice(0, 10) + 'T16:15:00.00Z'
      const date = new Date(input)
      if (date.toString() !== 'Invalid Date') { return date }
    }
    if (new Date(val).toString() !== 'Invalid Date') {
      return new Date(val)
    }
    return new Date()
  } catch (e) {
    return new Date()
  }
}

export function sortByStartDate(a, b) {
  // @ts-ignore
  return new Date(b.startDate || b.date) - new Date(a.startDate || a.date)
}
export function filterPassed(c) {
  return new Date(c.endDate) > new Date(Date.now())
}
