import axiosInstance from '.'
import type { Api, BaseClashConfig } from '@/share/type/clash'

export async function baseConfig() {
  return await axiosInstance.get<BaseClashConfig>('/configs')
}

export async function putBaseConfig(config: BaseClashConfig) {
  return await axiosInstance.put<void>('/configs', config)
}

export async function patchBaseConfig(config: Partial<BaseClashConfig>) {
  return await axiosInstance.patch<void>('/configs', config)
}

export async function proxies() {
  return await axiosInstance.get('/proxies')
}

export async function proxy(name: string) {
  return await axiosInstance.get(`/proxies/${name}`)
}

export async function selectProxy(name: string) {
  return await axiosInstance.put<void>(`/proxies/${name}`)
}

export async function proxyDelay(name: string) {
  return await axiosInstance.get(`/proxies/${name}/delay`)
}

export async function rules() {
  return await axiosInstance.get('/rules')
}

export async function connections() {
  return await axiosInstance.get<Api.ConnectionsResponse>('/connections')
}

export async function closeAllConnections() {
  return await axiosInstance.delete<void>('/connections')
}

export async function closeConnection(connectionId: string) {
  return await axiosInstance.delete<void>(`/connections/${connectionId}`)
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
  return await axiosInstance.put<void>(`/providers/proxies/${providerName}`)
}

export async function healthcheckProxyProvider(providerName: string) {
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
  healthcheckProxyProvider,
}
