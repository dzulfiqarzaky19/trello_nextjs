export const formatDueDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  const today = new Date()

  const normalize = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const d = normalize(date)
  const t = normalize(today)

  const diffDays = Math.floor((d.getTime() - t.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Tomorrow"
  if (diffDays === -1) return "Yesterday"

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}