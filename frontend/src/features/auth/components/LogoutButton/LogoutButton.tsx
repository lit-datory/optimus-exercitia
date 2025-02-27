import { useNavigate } from "react-router-dom"
import { Button } from "src/components/Button"

export const LogoutButton = () => {
  const navigate = useNavigate()

  const handleOnLogout = async () => {
    await navigate("/logout")
  }
  return (
    <Button onClick={handleOnLogout} variant="primary">
      Logout
    </Button>
  )
}
