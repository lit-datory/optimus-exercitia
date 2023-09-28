import { useAtomValue } from "jotai"
import { useTranslation } from "react-i18next"
import { profileAtom } from "../store"

export const Profile = () => {
  const { t } = useTranslation()
  const profile = useAtomValue(profileAtom)

  return (
    <section className="space-y-2">
      <h1 className="text-3xl font-bold">{t("profile.headers.title")}</h1>
      <ul className="space-y-2">
        <h3 className="font-normal">{t("profile.headers.id")}</h3>
        <li className="font-bold">{profile.id}</li>
        <h3 className="font-normal">{t("profile.headers.firstName")}</h3>
        <li className="font-bold">{profile.firstName}</li>
        <h3 className="font-normal">{t("profile.headers.lastName")}</h3>
        <li className="font-bold">{profile.lastName}</li>
        <h3 className="font-normal">{t("profile.headers.email")}</h3>
        <li className="font-bold">{profile.email}</li>
        <h3 className="font-normal">{t("profile.headers.blocked")}</h3>
        <li className="font-bold">{profile.blocked.toString()}</li>
        <h3 className="font-normal">{t("profile.headers.createdAt")}</h3>
        <li className="font-bold">{profile.createdAt}</li>
        <h3 className="font-normal">{t("profile.headers.updatedAt")}</h3>
        <li className="font-bold">{profile.updatedAt}</li>
      </ul>
    </section>
  )
}
