import { render, screen } from "@testing-library/react"
import { InputField } from "../InputField"

describe("InputField component", () => {
  it("Shows error when present", () => {
    const message = "error"
    render(<InputField name="test" label="test" data-testid="input-field" error={message} />)
    const error = screen.getByTestId("test-error")
    expect(error).toBeDefined()
  })
})
