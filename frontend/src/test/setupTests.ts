vi.mock("react-router-dom", async () => {
  const actual = (await vi.importActual("react-router-dom")) as unknown as Record<string, unknown>

  return { ...actual, useNavigate: vi.fn() }
})

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

vi.stubGlobal("ResizeObserver", ResizeObserverMock)

afterEach(() => {
  vi.clearAllMocks()
})

export {}
