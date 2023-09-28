import { render, screen } from "@testing-library/react"
import { Input } from "../Input"

describe("Input component", () => {
  it("Changes the text of the Input", () => {
    const expectedText = "Test"
    render(<Input data-testid="input" defaultValue={expectedText} />)
    const input = screen.getByTestId("input")
    expect((input as HTMLInputElement).value).toEqual(expectedText)
  })
})
