import { useAtomValue } from "jotai"
import { Navigate, Outlet } from "react-router-dom"
import { isSignedInAtom } from "../store"

export const AuthRoute = () => {
  const isSignedIn = useAtomValue(isSignedInAtom)
  return isSignedIn ? <Outlet /> : <Navigate to="/login" />
}
