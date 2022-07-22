namespace MainEvent {
  type InnerClashEvent = 'stop' | 'proxySubscribeChange'
  type InnerClashInvokeEvent = 'start'
  export type ClashEventName = `clash:${InnerClashEvent}`
  export type ClashInvokeEventName = `clash:${InnerClashInvokeEvent}`
}
export type { MainEvent }
