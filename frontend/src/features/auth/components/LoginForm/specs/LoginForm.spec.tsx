import { renderWithProviders, screen, fireEvent, waitFor, useNavigateMock } from "src/test"
import { mockLogin } from "../../../api"
import { LoginForm } from "../LoginForm"

describe("LoginForm component", () => {
  describe("Validations", () => {
    it("Correctly validates email", async () => {
      renderWithProviders(<LoginForm />)
      const emailInput = screen.getByTestId("email-input")
      const loginButton = screen.getByTestId("login-button")
      fireEvent.input(emailInput, { target: { value: "" } })
      fireEvent.click(loginButton)
      const errorMessage = await screen.findByTestId("email-error")
      expect(errorMessage).toMatchSnapshot()
    })

    it("Correctly validates password is required", async () => {
      renderWithProviders(<LoginForm />)
      const passwordInput = screen.getByTestId("password-input")
      const loginButton = screen.getByTestId("login-button")
      fireEvent.input(passwordInput, { target: { value: "" } })
      fireEvent.click(loginButton)
      const errorMessage = await screen.findByTestId("password-error")
      expect(errorMessage).toMatchSnapshot()
    })
  })

  describe("Sign in flow", () => {
    it("Successfully signs in", async () => {
      const mock = mockLogin({ resolve: { accessToken: "token" } })
      const mockNavigate = useNavigateMock()
      renderWithProviders(<LoginForm />)
      const emailInput = screen.getByTestId("email-input")
      const passwordInput = screen.getByTestId("password-input")
      fireEvent.input(emailInput, { target: { value: "test@example.com" } })
      fireEvent.input(passwordInput, { target: { value: "test" } })

      const loginButton = screen.getByTestId("login-button")
      fireEvent.click(loginButton)
      await waitFor(() => {
        expect(mock).toHaveBeenCalledWith({ email: "test@example.com", password: "test" })
      })
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/")
      })
    })

    it("Sets error when endpoint returns error", async () => {
      const mock = mockLogin({ reject: "Unauthorized" })
      renderWithProviders(<LoginForm />)
      const emailInput = screen.getByTestId("email-input")
      const passwordInput = screen.getByTestId("password-input")
      fireEvent.input(emailInput, { target: { value: "test@example.com" } })
      fireEvent.input(passwordInput, { target: { value: "test" } })

      const loginButton = screen.getByTestId("login-button")
      fireEvent.click(loginButton)
      await waitFor(() => {
        expect(mock).toHaveBeenCalledWith({ email: "test@example.com", password: "test" })
      })

      const errorMessage = await screen.findByTestId("password-error")
      expect(errorMessage).toMatchSnapshot()
    })
  })
})
