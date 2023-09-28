import { ButtonHTMLAttributes } from "react"
import classNames from "classnames"

type Props = {
  variant: "primary" | "secondary"
} & ButtonHTMLAttributes<HTMLButtonElement>

export const Button = ({ onClick, variant, children, ...rest }: Props) => {
  const defaultClassNames = classNames("rounded-md py-2 px-6 text-md font-shadow focus:outline-none")

  const variants = {
    primary: classNames(defaultClassNames, "bg-indigo-600 text-white"),
    secondary: classNames(
      defaultClassNames,
      "bg-inherit border border-indigo-600 text-indigo-600 hover hover:bg-indigo-600 hover:text-white",
    ),
  }

  return (
    <button onClick={onClick} className={classNames(variants[variant])} {...rest}>
      {children}
    </button>
  )
}
