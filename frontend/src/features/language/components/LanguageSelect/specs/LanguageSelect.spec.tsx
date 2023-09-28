import { LanguageSelect } from "../LanguageSelect"
import i18n, { Locales } from "src/i18n/config"
import { screen, fireEvent, renderWithProviders } from "src/test"

describe("LanguageSelect", () => {
  it("should change language when an option is selected", async () => {
    const changeLanguageSpy = vi.spyOn(i18n, "changeLanguage")
    renderWithProviders(<LanguageSelect />)

    fireEvent.click(await screen.findByTestId("select-button"))
    fireEvent.click(await screen.findByText(i18n.t("common.locales.nl_BE")))

    expect(changeLanguageSpy).toHaveBeenCalledTimes(1)
    expect(changeLanguageSpy).toHaveBeenCalledWith(Locales.NL_BE)
  })
})
