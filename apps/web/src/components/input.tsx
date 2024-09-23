import { cn } from '@/libs/utils/cn'

export function Input({
  className,
  ...props
}: React.ComponentPropsWithRef<'input'>) {
  return (
    <input
      className={cn(
        'rounded border border-black bg-white px-2 py-1 shadow outline-none',
        className,
      )}
      {...props}
    />
  )
}
