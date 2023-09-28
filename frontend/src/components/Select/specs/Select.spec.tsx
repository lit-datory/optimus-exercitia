import { render, fireEvent, screen, act } from "@testing-library/react"
import { Select } from "../Select"

const options = [
  { key: "option1", value: "1", label: "Option 1" },
  { key: "option2", value: "2", label: "Option 2" },
  { key: "option3", value: "3", label: "Option 3" },
]

describe("Select", () => {
  it("renders the label and selected value", () => {
    render(<Select label="Test" options={options} value={options[0]} onChange={vi.fn} />)
    expect(screen.getByText("Test")).toBeDefined()
    expect(screen.getByText("Option 1")).toBeDefined()
  })

  it("opens the dropdown when the button is clicked", async () => {
    render(<Select label="Test" options={options} value={options[0]} onChange={vi.fn} />)

    fireEvent.click(await screen.findByTestId("select-button"))

    await act(async () => {
      expect(await screen.findByRole("listbox")).toBeDefined()
    })
  })

  it("calls the onChange callback when an option is selected", () => {
    const handleChange = vi.fn()
    render(<Select label="Test" options={options} value={options[0]} onChange={handleChange} />)
    fireEvent.click(screen.getByTestId("select-button"))

    fireEvent.click(screen.getByText("Option 2"))
    expect(handleChange).toHaveBeenCalledWith(options[1])
  })
})
