import { forwardRef, InputHTMLAttributes } from "react"

type Props = InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, Props>(({ className, ...rest }: Props, ref) => {
  return (
    <input
      ref={ref}
      className={`${className || ""} block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 focus:ring-inset sm:text-sm sm:leading-6`}
      {...rest}
    />
  )
})

Input.displayName = "Input"
