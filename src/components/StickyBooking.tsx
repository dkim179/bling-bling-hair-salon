import { CalendarDays } from 'lucide-react'

export default function StickyBooking() {
  return (
    <div className="stickyBooking stickyBooking--single">

      <a href="/book">
        <CalendarDays size={17} />
        Book appointment
      </a>

    </div>
  )
}