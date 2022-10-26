type InnerClashEvent = 'stop' | 'proxySubscribeChange' | 'ruleSetChange'
type InnerClashInvokeEvent = 'start'
export type ClashEventName = `clash:${InnerClashEvent}`
export type ClashInvokeEventName = `clash:${InnerClashInvokeEvent}`
