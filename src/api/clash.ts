import type { AxiosResponse } from 'axios'
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
  return await axiosInstance.get<Api.Proxies>('/proxies')
}

export async function proxy(name: string) {
  return await axiosInstance.get<Api.ProxyInfo | Api.ProxyGroupInfo>(`/proxies/${name}`)
}

export async function selectProxy(name: string): Promise<AxiosResponse<void, any>>
export async function selectProxy(groupName: string, proxyName: string): Promise<AxiosResponse<void, any>>
export async function selectProxy(name: string, proxyName?: string) {
  if (proxyName) {
    return await axiosInstance.put<void>(`/proxies/${name}`, { name: proxyName })
  }
  return await axiosInstance.put<void>(`/proxies/${name}`)
}

export async function proxyDelay(name: string) {
  return await axiosInstance.request<Api.ProxyDelay>({
    url: `/proxies/${name}/delay`,
    method: 'get',
    params: {
      url: 'http://www.gstatic.com/generate_204',
      timeout: 3000,
    },
  })
}

export async function rules() {
  return await axiosInstance.get<Api.Rules>('/rules')
}

export async function connections() {
  return await axiosInstance.get<Api.Connections>('/connections')
}

export async function closeAllConnections() {
  return await axiosInstance.delete<void>('/connections')
}

export async function closeConnection(connectionId: string) {
  return await axiosInstance.delete<void>(`/connections/${connectionId}`)
}

export async function version() {
  return await axiosInstance.get<Api.version>('/version')
}

export async function proxiesOfProviders() {
  return await axiosInstance.get<Api.Providers>('/providers/proxies')
}

export async function proxiesOfProvider(providerName: string) {
  return await axiosInstance.get<Api.Provider>(`/providers/proxies/${providerName}`)
}

export async function selectProxyProvider(providerName: string) {
  return await axiosInstance.put<void>(`/providers/proxies/${providerName}`)
}

export async function healthcheckProxyProvider(providerName: string) {
  return await axiosInstance.get<void>(`/providers/proxies/${providerName}/healthcheck`)
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
