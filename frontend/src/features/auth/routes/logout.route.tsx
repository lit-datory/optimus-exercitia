import { useSetAtom } from "jotai"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { logoutAtom } from "../store"

export const LogoutRoute = () => {
  const navigate = useNavigate()
  const logout = useSetAtom(logoutAtom)

  useEffect(() => {
    void (async () => {
      await logout()
      await navigate("/login", { replace: true })
    })()
  }, [])

  return null
}
