import en_GBTranslations from "../en_GB/translations.json"
import nl_BETranslations from "../nl_BE/translations.json"
import { deepCompareTranslations } from "./deepComparison"

describe("Translations should be correct", () => {
  const en_GB = Object.keys(en_GBTranslations)
  const nl_BE = Object.keys(nl_BETranslations)

  it("English translations should be of the same lenght as the other languages", () => {
    expect(en_GB.length).toBe(nl_BE.length)
  })

  it("Other languages should have the same keys as the english one", () => {
    expect(nl_BE).toEqual(expect.arrayContaining(en_GB))
  })

  it("Dutch BE translations should be in the same order as english ones", () => {
    const keyOrder = deepCompareTranslations(en_GBTranslations, nl_BETranslations)

    if (keyOrder.length > 0) {
      throw Error(`[${keyOrder}] are not in the same order as the in the english translations `)
    }

    expect(keyOrder.length).toBe(0)
  })
})
