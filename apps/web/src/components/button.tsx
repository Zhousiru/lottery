import { cn } from '@/libs/utils/cn'

export function Button({
  className,
  ...props
}: React.ComponentPropsWithRef<'button'>) {
  return (
    <button
      className={cn(
        'flex items-center justify-center gap-1 rounded bg-black px-4 py-2 text-white shadow transition enabled:hover:bg-opacity-75',
        className,
      )}
      {...props}
    />
  )
}
