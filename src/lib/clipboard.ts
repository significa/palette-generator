import { toaster } from "./toaster";

export const copyToClipboard = async (content: string, {
  id,
  success = 'Copied to clipboard!',
  error = 'Failed to copy to clipboard!',
}: {
  id?: string
  success?: string
  error?: string
} = {}) => {
  try {
    await navigator.clipboard.writeText(content);
    
    toaster({ type: 'success', message: success }, { id })
  } catch (err) {
    toaster({ type: 'error', message: error }, { id })
  }
}