// 格式化時間戳
const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp)

  const now = new Date()
  // 今日
  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()

  if (isSameDay) {
    return date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
  }

  // 昨日
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()

  if (isYesterday) {
    return (
      '昨天 ' + date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
    )
  }

  // 更早以前：YYYY/M/D 上午/下午HH:MM
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// YYYY/M/D
const ymd = (ts: number) => {
  const d = new Date(ts);
  const month = padZero(d.getMonth() + 1);
  const day = padZero(d.getDate());
  return `${d.getFullYear()}-${month}-${day}`;
};

// YYYY/M/D HH:MM
const ymdHm = (ts: number) => {
  const d = new Date(ts)
  const month = padZero(d.getMonth() + 1);
  const day = padZero(d.getDate());
  const hours = padZero(d.getHours());
  const minutes = padZero(d.getMinutes());
  return `${d.getFullYear()}-${month}-${day} ${hours}:${minutes}`
}

// YYYY年M月D日
const formatDateHeader = (ts: number): string => {
  const d = new Date(ts)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

const padZero = (num: number) => num.toString().padStart(2, '0');

export { formatTimestamp, ymd, ymdHm, formatDateHeader }
