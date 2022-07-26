// import { spawn } from 'node:child_process'
import process from 'process'
import path from 'path'
import type { ChildProcess } from 'child_process'
import { spawn } from 'child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { app, net } from 'electron'
import yaml from 'js-yaml'
import getPort, { portNumbers } from 'get-port'
import Store from 'electron-store'
import schedule from 'node-schedule'
import dayjs from 'dayjs'
import type { BaseClashConfig, ClashConfig, ClashStartInfo, ProxyProviders } from '../../packages/share/type/clash'
import { defineClashEventHandler } from './event-handle'
import { parseProxySubContent } from '@/share/utils/parse'
import type { ClashSettingRule, ClashSettings, RuleProviders } from '@/share/type'

let clashProcess: ChildProcess | null = null
let proxySubscribeDateBaseJob: null | schedule.Job = null
let proxySubscribeCronJob: null | schedule.Job = null
const store = new Store<ClashSettings>({
  name: 'clash_config',
})

function getBinDirPath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'bin')
  }

  return path.join(process.cwd(), 'extra/bin')
}

function getClashConfigDirPath() {
  if (process.platform !== 'win32') {
    return path.join(app.getPath('userData'), 'config')
  }

  return path.join(getBinDirPath(), 'config')
}

function getClashDefaultConfigPath() {
  return path.join(getClashConfigDirPath(), 'config.yaml')
}

function getClashRuleProviderDirPath() {
  return path.join(getClashConfigDirPath(), 'rules')
}

function getClashExecPath() {
  if (process.platform !== 'win32') {
    return path.join(getBinDirPath(), 'clash')
  }

  return path.join(getBinDirPath(), 'clash.exe')
}

function getProxyProviderDirPath() {
  return path.join(getClashConfigDirPath(), 'proxies')
}

function getProxyProviderFilePath() {
  return path.join(getProxyProviderDirPath(), 'subscribe_provider.yml')
}

// 1. check config
// 2. generate basic config

export async function startClash() {
  // console.log(process.resourcesPath)
  // console.log(app.getAppPath())
  // console.log(process.cwd())
  const clashPath = getClashExecPath()
  console.log(clashPath)
  return getPort({
    port: portNumbers(3000, 65535),
    exclude: [7890],
  }).then(portNumber => new Promise<ClashStartInfo>((resolve, reject) => {
    const extCtl = `127.0.0.1:${portNumber}`

    console.log(extCtl)
    clashProcess = spawn(clashPath, ['-d', getClashConfigDirPath(), '-ext-ctl', extCtl], {
      stdio: 'inherit',
    })
    clashProcess.on('error', (error) => {
      console.error(error)
      reject(new Error(error.message))
    })
    clashProcess.once('exit', (code, signal) => {
      console.log('exit', code, signal)
    })
    clashProcess.once('spawn', () => {
      resolve({
        controllerUrl: `http://${extCtl}`,
        apiSecret: '',
      })
    })
  }))
}

export function stopClash() {
  console.log('stop clash')
  if (clashProcess) {
    clashProcess.kill()
  }
}

function startDateBaseProxySubscribeSchedule(date: Date) {
  proxySubscribeDateBaseJob = schedule.scheduleJob(date, () => {
    updateProxySub()
  })
}

function startCronBaseProxySubscribeSchedule(period: number) {
  proxySubscribeCronJob = schedule.scheduleJob(`*/${period} * * * *`, () => {
    updateProxySub()
  })
}

function cancelAllProxySubscribeJob() {
  proxySubscribeCronJob?.cancel()
  proxySubscribeDateBaseJob?.cancel()
}

function checkProxySubTask() {
  const subscribe = store.get('subscribe', null)
  if (subscribe) {
    const updateTime = subscribe.updateTime
    if (updateTime) {
      const period = subscribe.period
      const now = Date.now()
      const willUpdateTime = now - period
      if (willUpdateTime >= period * 60 * 1000) {
        updateProxySub()
      }
      else {
        const willUpdateDate = dayjs().add(willUpdateTime, 'millisecond')
        startDateBaseProxySubscribeSchedule(willUpdateDate.toDate())
      }
    }
    else {
      updateProxySub()
    }
  }
}

function updateProxySub() {
  const subscribe = store.get('subscribe', null)
  const subscribeUrl = subscribe?.url
  if (!subscribeUrl) {
    return
  }
  const request = net.request(subscribeUrl)
  request.on('response', (response) => {
    response.on('data', (chunk) => {
      const decoder = new TextDecoder()
      const content = decoder.decode(chunk)
      const proxies = parseProxySubContent('base64', content)
      if (!proxies) {
        return
      }
      const proxiesYaml = yaml.dump({
        proxies,
      })
      const proxyProviderDir = getProxyProviderDirPath()
      if (!existsSync(proxyProviderDir)) {
        mkdirSync(proxyProviderDir)
      }
      const proxyProviderFilePath = getProxyProviderFilePath()
      writeFileSync(proxyProviderFilePath, proxiesYaml)
      subscribe.updateTime = Date.now()
      store.set('subscribe', subscribe)

      const configFilePath = getClashDefaultConfigPath()
      const configYaml = (yaml.load(readFileSync(configFilePath, 'utf-8')) as any) as ClashConfig
      let needUpdateConfigFile = false
      if (configYaml && typeof configYaml === 'object') {
        if (!('proxy-providers' in configYaml)) {
          const proxyProvider: ProxyProviders = {
            'subscribe-proxies': {
              'type': 'file',
              'path': proxyProviderFilePath,
              'health-check': {
                enable: false,
                url: 'http://www.gstatic.com/generate_204',
                interval: 36000,
              },
            },
          }
          configYaml['proxy-providers'] = proxyProvider
          needUpdateConfigFile = true
        }
        if (!('proxy-groups' in configYaml)) {
          configYaml['proxy-groups'] = [{
            name: 'Proxy',
            type: 'select',
            use: ['subscribe-proxies'],
          }]
          needUpdateConfigFile = true
        }
        if (needUpdateConfigFile) {
          writeFileSync(configFilePath, yaml.dump(configYaml))
        }
      }
      subscribe.updateTime = Date.now()
      startCronBaseProxySubscribeSchedule(subscribe.period)
    })
  })
  request.end()
}

function generateDefaultClashConfig() {
  const defaultConfig: BaseClashConfig = {
    'mode': 'direct',
    'mixed-port': 7890,
    'port': 0,
    'socks-port': 0,
    'allow-lan': false,
    'bind-address': '*',
    'log-level': 'debug',
    'redir-port': 0,
    'authentication': [],
  }
  const yamlContent = yaml.dump(defaultConfig)
  const configDirPath = getClashConfigDirPath()
  if (!existsSync(configDirPath)) {
    console.log('--', configDirPath)
    mkdirSync(configDirPath)
  }
  // TODO: 异常处理
  writeFileSync(getClashDefaultConfigPath(), yamlContent, { encoding: 'utf-8' })
}
export function handleProxySubscribeChange() {
  cancelAllProxySubscribeJob()
  checkProxySubTask()
}

export function handleRuleSetChange() {
  const ruleSet = store.get('rules', [])
  const configFilePath = getClashDefaultConfigPath()
  const configYaml = (yaml.load(readFileSync(configFilePath, 'utf-8')) as any) as ClashConfig
  const rules = []
  for (const rule of ruleSet) {
    rules.push(generateRuleSetRule(rule))
  }
  configYaml['rule-providers'] = generateRuleProviders(ruleSet)
  configYaml.rules = rules
  writeFileSync(configFilePath, yaml.dump(configYaml), 'utf-8')
}

function generateRuleProviders(rulesOfSetting: ClashSettingRule[]): RuleProviders {
  const ruleProviders: RuleProviders = {}
  const ruleDir = getClashRuleProviderDirPath()
  for (const rule of rulesOfSetting) {
    ruleProviders[rule.name] = {
      type: 'http',
      path: path.join(ruleDir, `${rule.name}.yaml`),
      behavior: rule.behavior,
      interval: 3600,
      url: rule.url,
    }
  }
  return ruleProviders
}

function generateRuleSetRule(ruleOfSetting: ClashSettingRule) {
  return `RULE-SET,${ruleOfSetting.name},${ruleOfSetting.type}`
}

function initClashConfigStore() {
  Store.initRenderer()
}

export function init() {
  console.log('config dir: ', getClashDefaultConfigPath())
  if (!existsSync(getClashDefaultConfigPath())) {
    generateDefaultClashConfig()
  }

  defineClashEventHandler()
  initClashConfigStore()
  checkProxySubTask()
}

export default {
  startClash,
  stopClash,
  init,
}
