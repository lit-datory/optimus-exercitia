import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "src/components/Button"
import { InputField } from "src/components/InputField"
import { loginFieldValuesSchema } from "../../schemas"
import { LoginFieldValues } from "../../types"
import { loginAtom } from "../../store"
import { useSetAtom } from "jotai"
import { useTranslation } from "react-i18next"

export const LoginForm = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const login = useSetAtom(loginAtom)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFieldValues>({
    mode: "onBlur",
    resolver: zodResolver(loginFieldValuesSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleLogin = async (data: LoginFieldValues) => {
    try {
      await login(data)
      return navigate("/")
    } catch (e: unknown) {
      setError("password", {
        message: t("login.inputFields.errors.password"),
      })
    }
  }

  const handleError = (message?: string) => {
    if (!message) return
    return t(message)
  }

  return (
    <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
      <InputField
        {...register("email")}
        label={t("common.inputFields.email.label")}
        name="email"
        type="email"
        error={handleError(errors.email?.message)}
        autoComplete="email"
      />
      <InputField
        {...register("password")}
        label={t("common.inputFields.password.label")}
        name="password"
        type="password"
        error={handleError(errors.password?.message)}
        autoComplete="current-password"
      />
      <Button data-testid="login-button" type="submit" variant="primary">
        {t("login.buttons.signIn")}
      </Button>
    </form>
  )
}
