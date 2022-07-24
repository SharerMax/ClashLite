/**
 * https://github.com/Dreamacro/clash-dashboard/blob/master/src/lib/request.ts
 * https://github.com/Dreamacro/clash/wiki/external-controller-API-reference
 */
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
    return await axiosInstance.put<void>(`/proxies/${encodeURIComponent(name)}`, { name: proxyName })
  }
  return await axiosInstance.put<void>(`/proxies/${encodeURIComponent(name)}`)
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

export async function ruleProviders() {
  return await axiosInstance.get<Api.RuleProviders>('/providers/rules')
}

export async function ruleProvider(providerName: string) {
  return await axiosInstance.get<Api.RuleProvider>(`/providers/rules/${encodeURIComponent(providerName)}`)
}

export async function updateRuleProvider(providerName: string) {
  return await axiosInstance.put<void>(`/providers/rules/${encodeURIComponent(providerName)}`)
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

export async function proxyProviders() {
  return await axiosInstance.get<Api.ProxyProviders>('/providers/proxies')
}

export async function proxyProvider(providerName: string) {
  return await axiosInstance.get<Api.ProxyProvider>(`/providers/proxies/${encodeURIComponent(providerName)}`)
}

export async function selectProxyProvider(providerName: string) {
  return await axiosInstance.put<void>(`/providers/proxies/${encodeURIComponent(providerName)}`)
}

export async function healthcheckProxyProvider(providerName: string) {
  return await axiosInstance.get<void>(`/providers/proxies/${encodeURIComponent(providerName)}/healthcheck`)
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
  proxiesOfProviders: proxyProviders,
  proxiesOfProvider: proxyProvider,
  selectProxyProvider,
  healthcheckProxyProvider,
}
