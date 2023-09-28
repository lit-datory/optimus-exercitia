/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
export function deepCompareTranslations(
  translations: Record<string, any>,
  translationsToCompare: Record<string, any>,
): string[] {
  const keys = Object.keys(translations)
  const keysToCompare = Object.keys(translationsToCompare)
  return keys.reduce((result: string[], key: string, index: number) => {
    if (keysToCompare.includes(key)) {
      if (typeof translations[key] === "object") {
        if (!translationsToCompare[key]) {
          return [...result, key]
        }

        const resultFromObject = deepCompareTranslations(translations[key], translationsToCompare[key])
        return [...result, ...resultFromObject]
      }

      if (index !== keysToCompare.indexOf(key)) {
        return [...result, key]
      }

      return result
    }

    return [...result, key]
  }, [])
}
