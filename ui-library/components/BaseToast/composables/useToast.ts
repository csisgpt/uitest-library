import { computed } from 'vue'
import { toastManager } from '../utils/toast-manager'
import type { ToastOptions, ToastPosition } from '../types'

export interface UseToastReturn {
  // State
  toasts: any
  position: any
  
  // Configuration
  setPosition: (pos: ToastPosition) => void
  setMaxToasts: (max: number) => void
  
  // Core methods
  show: (options: ToastOptions) => string
  dismiss: (id: string) => void
  dismissAll: () => void
  
  // Convenience methods
  success: (message: string, options?: Partial<ToastOptions>) => string
  error: (message: string, options?: Partial<ToastOptions>) => string
  warning: (message: string, options?: Partial<ToastOptions>) => string
  info: (message: string, options?: Partial<ToastOptions>) => string
  
  // Utility methods
  processError: (error: any, customMessage?: string) => string
  promise: <T>(
    promise: Promise<T>,
    options?: {
      loading?: string
      success?: string | ((data: T) => string)
      error?: string | ((error: any) => string)
    }
  ) => Promise<T>
  pause: (id: string) => void
  resume: (id: string) => void
}

export function useToast(): UseToastReturn {
  const toasts = computed(() => toastManager.toasts)
  const position = computed(() => toastManager.position)

  const setPosition = (pos: ToastPosition) => {
    toastManager.setPosition(pos)
  }

  const setMaxToasts = (max: number) => {
    toastManager.setMaxToasts(max)
  }

  // Basic toast methods
  const show = (options: ToastOptions) => {
    return toastManager.add(options)
  }

  const dismiss = (id: string) => {
    toastManager.remove(id)
  }

  const dismissAll = () => {
    toastManager.clear()
  }

  // Convenience methods
  const success = (message: string, options?: Partial<ToastOptions>) => {
    console.log('asdasdasdsa')
    return toastManager.success(message, options)
  }

  const error = (message: string, options?: Partial<ToastOptions>) => {
    return toastManager.error(message, options)
  }

  const warning = (message: string, options?: Partial<ToastOptions>) => {
    return toastManager.warning(message, options)
  }

  const info = (message: string, options?: Partial<ToastOptions>) => {
    return toastManager.info(message, options)
  }

  // Error processor
  const processError = (error: any, customMessage?: string) => {
    return toastManager.processError(error, customMessage)
  }

  // Timer control
  const pause = (id: string) => {
    toastManager.pauseTimer(id)
  }

  const resume = (id: string) => {
    toastManager.resumeTimer(id)
  }

  // Promise-based toast for async operations
  const promise = <T>(
    promiseToExecute: Promise<T>,
    {
      loading = 'در حال پردازش...',
      success = 'عملیات با موفقیت انجام شد',
      error = 'خطایی رخ داده است'
    }: {
      loading?: string
      success?: string | ((data: T) => string)
      error?: string | ((error: any) => string)
    } = {}
  ): Promise<T> => {
    const loadingId = info(loading, { persistent: true, showProgress: false })

    return promiseToExecute
      .then((data) => {
        dismiss(loadingId)
        const successMessage = typeof success === 'function' ? success(data) : success
        show({ message: successMessage, type: 'success' })
        return data
      })
      .catch((err) => {
        dismiss(loadingId)
        const errorMessage = typeof error === 'function' ? error(err) : error
        processError(err, errorMessage)
        throw err
      })
  }

  return {
    // State
    toasts,
    position,
    
    // Configuration
    setPosition,
    setMaxToasts,
    
    // Core methods
    show,
    dismiss,
    dismissAll,
    
    // Convenience methods
    success,
    error,
    warning,
    info,
    
    // Utility methods
    processError,
    promise,
    pause,
    resume
  }
}