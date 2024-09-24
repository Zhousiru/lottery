import { forwardRef, useImperativeHandle, useState } from 'react'
import ConfettiPrimitive from 'react-confetti'
import { useWindowSize } from 'react-use'

export interface ConfettiRef {
  trigger: () => void
}

export const Confetti = forwardRef<ConfettiRef>(function Confetti(_, ref) {
  const { width, height } = useWindowSize()
  const [isStart, setIsStart] = useState(false)

  useImperativeHandle(ref, () => ({
    trigger() {
      setIsStart(true)
    },
  }))

  return (
    <ConfettiPrimitive
      width={width}
      height={height}
      recycle={false}
      numberOfPieces={isStart ? 600 : 0}
      onConfettiComplete={(confetti) => {
        confetti?.reset()
        setIsStart(false)
      }}
    />
  )
})
