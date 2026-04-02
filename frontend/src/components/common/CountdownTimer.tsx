import { useEffect, useState } from 'react'

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calculateTimeLeft(date: string): TimeLeft {
  const now = new Date().getTime()
  const target = new Date(date).getTime()
  const difference = target - now

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

function formatNumber(num: number) {
  return String(num).padStart(2, '0')
}

interface CountdownTimerItem {
  date: string
}

export default function CountdownTimer({ date }: CountdownTimerItem) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(date))

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(date))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="text-2xl font-bold grid grid-cols-4 gap-3">
      {[
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Minutes', value: timeLeft.minutes },
        { label: 'Seconds', value: timeLeft.seconds },
      ].map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center justify-center bg-card text-primary border rounded-xl p-3"
        >
          <span className="text-3xl">{formatNumber(item.value)}</span>
          <span className="text-xs opacity-70 tracking-wide">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
