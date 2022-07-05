/**
 * Only for RenderProcess. Expose Api to render process
 * Note: must use this preload
 */
import { Expose } from '.'

export {}
declare global {
  interface Window {
    clash: Expose
    localIPv4: () => Promise<string | undefined>
  }
}
