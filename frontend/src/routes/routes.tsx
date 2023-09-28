import { createBrowserRouter } from "react-router-dom"
import { AuthRoute, LoginRoute, LogoutRoute } from "src/features/auth/routes"
import { NotFoundRoute } from "src/features/404/routes"
import { ProfileRoute } from "src/features/profile/routes"
import { RootRoute } from "src/features/root/routes/root.route"

export const router = createBrowserRouter([
  {
    path: "*",
    element: <NotFoundRoute />,
  },

  {
    path: "/login",
    element: <LoginRoute />,
  },
  {
    path: "/logout",
    element: <LogoutRoute />,
  },
  {
    path: "/",
    element: <AuthRoute />,
    children: [
      {
        index: true,
        element: <RootRoute />,
      },
      {
        path: "profile",
        element: <ProfileRoute />,
      },
    ],
  },
])
