import { cn } from '@/libs/utils/cn'
import { ReactNode } from 'react'

export function Label({
  className,
  text,
  children,
  ...props
}: React.ComponentPropsWithRef<'label'> & { text: ReactNode }) {
  return (
    <label
      className={cn('flex flex-col items-start gap-1', className)}
      {...props}
    >
      <div className="opacity-50">{text}</div>
      {children}
    </label>
  )
}
