'use client'
import DayColumn from './DayColumn'

export default function WeeklyPlanner({ weekDates }) {
  return (
    <div className="overflow-x-auto pb-4 -mx-4 px-4">
      <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
        {weekDates.map(date => (
          <DayColumn key={date.toISOString()} date={date} />
        ))}
      </div>
    </div>
  )
}
