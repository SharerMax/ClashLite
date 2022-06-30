import axiosInstance from '.'
import type { BaseClashConfig } from '@/share/type/clash'

export async function baseConfig() {
  return await axiosInstance.get('/configs')
}

export async function putBaseConfig(config: BaseClashConfig) {
  return await axiosInstance.put('/configs', config)
}

export async function patchBaseConfig(config: Partial<BaseClashConfig>) {
  return await axiosInstance.patch('/configs', config)
}

export async function proxies() {
  return await axiosInstance.get('/proxies')
}

export async function proxy(name: string) {
  return await axiosInstance.get(`/proxies/${name}`)
}

export async function selectProxy(name: string) {
  return await axiosInstance.put(`/proxies/${name}`)
}

export async function proxyDelay(name: string) {
  return await axiosInstance.get(`/proxies/${name}/delay`)
}

export async function rules() {
  return await axiosInstance.get('/rules')
}

export async function connections() {
  return await axiosInstance.get('/connections')
}

export async function closeAllConnections() {
  return await axiosInstance.delete('/connections')
}

export async function closeConnection(connectionId: string) {
  return await axiosInstance.delete(`/connections/${connectionId}`)
}

export async function version() {
  return await axiosInstance.get('/version')
}

export async function proxiesOfProviders() {
  return await axiosInstance.get('/providers/proxies')
}

export async function proxiesOfProvider(providerName: string) {
  return await axiosInstance.get(`/providers/proxies/${providerName}`)
}

export async function selectProxyProvider(providerName: string) {
  return await axiosInstance.put(`/providers/proxies/${providerName}`)
}

export async function healthcheckProxyProiver(providerName: string) {
  return await axiosInstance.get(`/providers/proxies/${providerName}/healthcheck`)
}

export default {
  baseConfig,
  putBaseConfig,
  patchBaseConfig,
  proxies,
  selectProxy,
  proxyDelay,
  connections,
  closeAllConnections,
  closeConnection,
  version,
  proxiesOfProviders,
  proxiesOfProvider,
  selectProxyProvider,
  healthcheckProxyProiver,
}
