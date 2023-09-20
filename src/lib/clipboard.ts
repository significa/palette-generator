import { toaster } from "./toaster";

export const copyToClipboard = async (content: string, {
  success = 'Copied to clipboard!',
  error = 'Failed to copy to clipboard!',
}: {
  success?: string
  error?: string
} = {}) => {
  try {
    await navigator.clipboard.writeText(content);
    
    toaster({ type: 'success', message: success })
  } catch (err) {
    toaster({ type: 'error', message: error })
  }
}