import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react"
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid"

type Option = {
  key: string
  value: string
  label: string
}

type Props<T extends Option> = {
  label: string
  options: T[]
  value: T
  onChange: (v: T) => void
  unmount?: boolean
}

export const Select = <T extends Option>({ label, options, value, unmount = true, onChange }: Props<T>) => {
  return (
    <Listbox value={value} onChange={onChange}>
      <Label className="block leading-6">{label}</Label>
      <div className="relative mt-1">
        <ListboxButton
          data-testid="select-button"
          className="relative w-full cursor-default rounded-md bg-white py-1.5 pr-10 pl-3 text-left text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm sm:leading-6"
        >
          <span className="flex items-center">
            <span className="ml-3 block truncate">{value.label}</span>
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </ListboxButton>

        <ListboxOptions
          unmount={unmount}
          data-testid="listbox-options"
          className="ring-opacity-5 absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black focus:outline-none sm:text-sm"
        >
          {options.map((option) => (
            <ListboxOption
              key={option.key}
              data-testid={`${option.value}-option`}
              className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-[focus]:bg-indigo-600 data-[focus]:text-white"
              value={option}
            >
              <>
                <div className="flex items-center">
                  <span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold">
                    {option.label}
                  </span>
                </div>
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                  <CheckIcon aria-hidden="true" className="h-5 w-5" />
                </span>
              </>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  )
}
