export const copyToClipboard = (content: string) => {
  return navigator.clipboard.writeText(content);
}