vi.mock("react-router-dom", async () => {
  const actual = (await vi.importActual("react-router-dom")) as unknown as Record<string, unknown>

  return { ...actual, useNavigate: vi.fn() }
})

afterEach(() => {
  vi.clearAllMocks()
})

export {}
