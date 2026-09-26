import { forwardRef } from 'react'
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '@/utils/helpers'

interface BaseFieldProps {
  label?: string
  error?: string
  helperText?: string
}

export type InputProps = BaseFieldProps &
  InputHTMLAttributes<HTMLInputElement>

/** Labeled text/number input with error and helper text support. */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...rest }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-body-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'input',
            error && 'border-error focus:border-error focus:ring-red-100',
            className,
          )}
          {...rest}
        />
        {error && <p className="mt-1 text-caption text-error">{error}</p>}
        {!error && helperText && (
          <p className="mt-1 text-caption text-gray-500">{helperText}</p>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'

export type TextareaProps = BaseFieldProps &
  TextareaHTMLAttributes<HTMLTextAreaElement>

/** Labeled textarea, e.g. for optional evaluation feedback. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, id, ...rest }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-1.5 block text-body-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={3}
          className={cn(
            'input resize-none',
            error && 'border-error focus:border-error focus:ring-red-100',
            className,
          )}
          {...rest}
        />
        {error && <p className="mt-1 text-caption text-error">{error}</p>}
        {!error && helperText && (
          <p className="mt-1 text-caption text-gray-500">{helperText}</p>
        )}
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'

export interface SelectOption {
  label: string
  value: string
}

interface SelectProps extends BaseFieldProps {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  id?: string
}

/** Labeled select dropdown. */
export function Select({
  label,
  error,
  helperText,
  options,
  value,
  onChange,
  placeholder,
  id,
}: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1.5 block text-body-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'input',
          error && 'border-error focus:border-error focus:ring-red-100',
        )}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-caption text-error">{error}</p>}
      {!error && helperText && (
        <p className="mt-1 text-caption text-gray-500">{helperText}</p>
      )}
    </div>
  )
}
