import toast from 'react-hot-toast'

/** Thin wrapper around react-hot-toast for consistent notification styling. */
export function useNotification() {
  const success = (message: string) => toast.success(message)
  const error = (message: string) => toast.error(message)
  const info = (message: string) =>
    toast(message, { icon: 'ℹ️', style: { background: '#EFF6FF' } })
  const warning = (message: string) =>
    toast(message, { icon: '⚠️', style: { background: '#FEF3C7' } })

  return { success, error, info, warning }
}
