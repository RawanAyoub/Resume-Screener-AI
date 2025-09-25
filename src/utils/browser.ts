export function isFileApiSupported(): boolean {
  return typeof File !== 'undefined' && typeof FileReader !== 'undefined'
}
