import "src/i18n/config"
import { ReactElement, ReactNode, Suspense } from "react"
import { render, RenderOptions } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"

const AllTheProviders = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <BrowserRouter>
        <Suspense>{children}</Suspense>
      </BrowserRouter>
    </>
  )
}

export const renderWithProviders = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllTheProviders, ...options })

export * from "@testing-library/react"
