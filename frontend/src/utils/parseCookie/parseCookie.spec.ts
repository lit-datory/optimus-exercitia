import { parseCookie, parseCookieToObject } from "./parseCookie"

describe("parseCookie", () => {
  describe("parseCookieToObject", () => {
    it("successfully parses the cookies to an object", () => {
      const result = parseCookieToObject("_csrf=test")
      expect(result).toBeDefined()
      expect(result?._csrf).toBeDefined()
    })

    it("successfully parses the cookies to an object when the value has an '=' included", () => {
      const result = parseCookieToObject("_csrf=test=test")
      expect(result).toBeDefined()
      expect(Object.values(result!)).toHaveLength(1)
      expect(result?._csrf).toBeDefined()
    })

    it("successfully parses the cookies to an object when the value ends with an =", () => {
      const result = parseCookieToObject("_csrf=test=")
      expect(result).toBeDefined()
      expect(Object.values(result!)).toHaveLength(1)
      expect(result?._csrf).toBeDefined()
      expect(result?._csrf).toEqual("test=")
    })

    it("fails parsing the cooke because no cookie is empty", () => {
      const result = parseCookieToObject("")
      expect(result).toEqual({})
    })

    it("returns empty object because cookie is in invalid", () => {
      const result = parseCookieToObject("invalid")
      expect(result).toEqual({})
    })
  })

  describe("parseCookie", () => {
    it("successfully returns the result of given cookie", () => {
      const result = parseCookie("_csrf=test", "_csrf")
      expect(result).toEqual("test")
    })

    it("fails returning a value of a cookie because it does not exist", () => {
      const result = parseCookie("", "_csrf")
      expect(result).toBeUndefined()
    })
  })
})
