import type { ClashSettingSubscribe } from '../type'

export function isSubScribeEqual(subscribeX: ClashSettingSubscribe, subscribeY: ClashSettingSubscribe) {
  if (subscribeX === subscribeY || (!subscribeX && !subscribeY)) {
    return true
  }
  if (!subscribeX || !subscribeY) {
    return false
  }
  return subscribeX.period === subscribeY.period && subscribeX.type === subscribeY.type && subscribeX.url === subscribeY.url
}
