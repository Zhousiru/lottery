import { cn } from '@/libs/utils/cn'
import { Link } from 'react-router-dom'

export function Logo({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={cn('flex', className)} {...props}>
      <Link to="/" className="block">
        <div className="text-lg italic opacity-50">好耶，是</div>
        <h1 className="mt-2 pl-4 text-6xl font-bold italic [text-shadow:8px_8px_white]">
          乐透！
        </h1>
      </Link>
    </div>
  )
}
