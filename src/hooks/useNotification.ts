import toast from 'react-hot-toast'

/** Thin wrapper around react-hot-toast for consistent notification styling. */
export function useNotification() {
  const success = (message: string) => toast.success(message)
  const error = (message: string) => toast.error(message)
  const info = (message: string) =>
    toast(message, { icon: 'ℹ️', style: { background: '#1E2740', color: '#F8FAFC' } })

  return { success, error, info }
}
