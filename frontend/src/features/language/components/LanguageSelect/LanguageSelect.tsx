import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Select } from "src/components/Select"
import { Locales } from "src/i18n"
import i18n from "src/i18n/config"

export const LanguageSelect = () => {
  const { t } = useTranslation()
  const options = Object.values(Locales).map((l) => {
    return { key: l, id: l, value: l, label: t(`common.locales.${l}`) }
  })

  const defaulLanguage = options[0]

  const [selected, setSelected] = useState(defaulLanguage)

  const handleOnChange = async (v: typeof defaulLanguage) => {
    await i18n.changeLanguage(v.value)
    setSelected(v)
  }

  return (
    <div className="mb-4 w-72">
      <Select
        unmount={false}
        options={options}
        onChange={handleOnChange}
        value={selected}
        label={t("language.label")}
      />
    </div>
  )
}
