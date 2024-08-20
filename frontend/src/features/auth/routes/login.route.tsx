import { useTranslation } from "react-i18next"
import { CandleLightLogo } from "src/assets/logo"
import { LoginForm } from "../components"

export const LoginRoute = () => {
  const { t } = useTranslation()

  return (
    <main className="mx-2 flex min-h-full justify-center py-12">
      <article className="w-full max-w-md space-y-7">
        <section className="w-full max-w-md space-y-4 text-center">
          <CandleLightLogo className="inline-block" />
          <h1 className="text-center text-3xl font-bold tracking-tight">{t("login.headers.title")}</h1>
        </section>
        <LoginForm />
      </article>
    </main>
  )
}
