// Format a date string or Date object as DD:MM:YYYY HH:mm
export function formatDate(
  dateInput: string | Date | undefined | null,
  withTime = true
): string {
  if (!dateInput) return ''
  const date = new Date(dateInput)
  if (isNaN(date.getTime())) return ''
  const pad = (n: number) => n.toString().padStart(2, '0')
  const dateStr = `${pad(date.getDate())}:${pad(date.getMonth() + 1)}:${date.getFullYear()}`
  if (!withTime) return dateStr
  return `${dateStr} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}
