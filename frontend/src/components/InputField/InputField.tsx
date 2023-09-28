import { forwardRef } from "react"
import { Input } from "src/components/Input"

type Props = {
  label: string
  error?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export const InputField = forwardRef<HTMLInputElement, Props>(({ label, error, name, ...rest }, ref) => {
  return (
    <div className="block">
      <label className="block text-sm font-semibold leading-6 text-gray-900">
        {label}
        <Input data-testid={`${name}-input`} ref={ref} name={name} {...rest} />
      </label>
      {error && (
        <span data-testid={`${name}-error`} className="text-sm text-red-400">
          {error}
        </span>
      )}
    </div>
  )
})

InputField.displayName = "InputField"
