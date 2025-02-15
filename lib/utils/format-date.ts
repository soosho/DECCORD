import { formatDistanceToNow, isFuture, format } from "date-fns"

export function formatMessageTime(date: Date) {
  // Handle future dates
  if (isFuture(date)) {
    return format(date, 'HH:mm')
  }

  // For timestamps within the last day, show relative time
  const distance = formatDistanceToNow(date, { addSuffix: true })
  
  // For timestamps older than a day, show the time
  if (distance.includes('day') || distance.includes('month') || distance.includes('year')) {
    return format(date, 'HH:mm')
  }

  return distance
}

export function formatDateTime(date: Date) {
  const timeFormatter = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  
  const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  return `${timeFormatter.format(date)}, ${dateFormatter.format(date)}`
}