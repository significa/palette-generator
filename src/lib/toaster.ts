import { createToaster } from '@significa/svelte-toaster'

export type ToastType = {
  type: 'success' | 'error'
  message: string
}

export const toaster = createToaster<ToastType>({
  duration: (toast) => toast.data.type === 'success' ? 2000 : 5000,
})