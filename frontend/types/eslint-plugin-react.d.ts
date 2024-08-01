declare module "eslint-plugin-react" {
  import type { ESLint, Linter } from "eslint"
  const plugin: Omit<ESLint.Plugin, "configs"> & {
    configs: {
      flat: {
        recommended: Record<string, Linter.Config>
        "jsx-runtime": Record<string, Linter.Config>
      }
    }
  }
  export default plugin
}
