import "src/i18n/config"
import { RouterProvider } from "react-router-dom"
import { router } from "./routes"

function App() {
  return <RouterProvider router={router} />
}

export default App
