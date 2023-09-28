import { fireEvent, render, screen } from "@testing-library/react"
import { Button } from "../Button"

describe("Button component", () => {
  describe("onClick", () => {
    it("gets called", () => {
      const mockFn = vi.fn()

      render(<Button data-testid="button" variant="primary" onClick={mockFn} />)
      const button = screen.getByTestId("button")
      fireEvent.click(button)
      expect(mockFn).toHaveBeenCalled()
    })
  })
})
