export { }

declare global {
  interface Window {
    removeLoading: () => void
    copyTextToClipboard(text: string): void
    clash: {
      start: ()=>void
      stop:() => void
    }
  }
}
