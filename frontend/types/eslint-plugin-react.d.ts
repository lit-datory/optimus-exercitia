declare module "eslint-plugin-react" {
  import type { ESLint, Linter } from "eslint"
  const plugin: Omit<ESLint.Plugin, "configs"> & {
    configs: Record<string, Linter.Config>
  }
  export default plugin
}
