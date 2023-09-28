import * as router from "react-router-dom"

export const useNavigateMock = () => {
  const navigate = vi.fn()
  const useNavigationSpy = vi.spyOn(router, "useNavigate")
  useNavigationSpy.mockImplementation(() => navigate)
  return navigate
}
