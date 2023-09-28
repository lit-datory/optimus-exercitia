export function parseCookieToObject(cookieInHeader: string): Record<string, string> | undefined {
  const splittedCookieHeader = cookieInHeader.split("; ")
  return splittedCookieHeader.reduce((result: Record<string, string>, cookie: string) => {
    const c = cookie.split("=")
    if (c.length === 2) {
      const key = c[0]
      const value = c[1]
      return { [key]: value }
    }

    if (c.length > 2) {
      const key = c[0]
      const rest = c.filter((_: string, i: number) => i !== 0).map((r) => (r === "" ? "=" : r))
      const value = rest.join("")
      return { [key]: value }
    }
    return result
  }, {})
}

export function parseCookie(cookieString: string, name: string): string | undefined {
  const cookieObject = parseCookieToObject(cookieString)
  if (cookieObject) {
    return cookieObject[name]
  }
}
