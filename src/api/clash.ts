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

export default {
  baseConfig,
}
