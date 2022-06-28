export { }

declare global {
  interface Window {
    removeLoading: () => void
    copyTextToClipboard(text: string): void
    clash: {
      start: ()=> Promise<boolean>
      stop:() => void
    }
  }
}
