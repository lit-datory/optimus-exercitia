import { renderWithProviders, useNavigateMock, waitFor } from "src/test"
import { mockLogout } from "../../api"
import { LogoutRoute } from "../logout.route"

describe("LogoutRoute Component", () => {
  it("Correctly calls logout", async () => {
    const mockNavigate = useNavigateMock()
    const logoutMock = mockLogout()
    renderWithProviders(<LogoutRoute />)
    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalled()
    })
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true })
    })
  })
})
