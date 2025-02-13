type LogLevel = 'info' | 'warn' | 'error'

function formatLog(level: LogLevel, message: string, data?: any) {
  const timestamp = new Date().toISOString()
  const dataString = data ? `\nData: ${JSON.stringify(data, null, 2)}` : ''
  return `[${timestamp}] ${level.toUpperCase()}: ${message}${dataString}\n`
}

export const log = {
  info(data: any, message: string) {
    console.log(formatLog('info', message, data))
  },
  warn(data: any, message: string) {
    console.warn(formatLog('warn', message, data))
  },
  error(data: any, message: string) {
    console.error(formatLog('error', message, data))
  }
}