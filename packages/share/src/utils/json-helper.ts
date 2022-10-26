// TODO: return unknown
export function parse(content: string): any {
  try {
    const jsonObject = JSON.parse(content)
    return jsonObject
  }
  catch (e) {
    return null
  }
}
