import { useEffect, useMemo, useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  formatDateKey,
  formatTime,
  getAvailableSlots,
  isClosedDay,
  isPastDate,
  type Appointment,
} from "../data/availability";

import { getAppointmentsForRange } from "../data/appointments";

/* ========================================
   SELECTION TYPE
======================================== */

export type BookingDateTimeSelection = {
  date: Date;
  dateKey: string;
  startMinutes: number;
};

type BookingCalendarProps = {
  durationMinutes: number;

  onSelectionChange: (selection: BookingDateTimeSelection | null) => void;
};

type CalendarDay = {
  date: Date;
  currentMonth: boolean;
};

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

/* ========================================
   COMPONENT
======================================== */

export default function BookingCalendar({
  durationMinutes,
  onSelectionChange,
}: BookingCalendarProps) {
  const today = new Date();

  const [visibleMonth, setVisibleMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [selectedStartTime, setSelectedStartTime] = useState<number | null>(
    null,
  );

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [loadingAppointments, setLoadingAppointments] = useState(false);

  /* ========================================
     LOAD APPOINTMENTS FROM SUPABASE
  ======================================== */

  useEffect(() => {
    let cancelled = false;

    async function loadAppointments() {
      setLoadingAppointments(true);

      const year = visibleMonth.getFullYear();

      const month = visibleMonth.getMonth();

      const firstDate = new Date(year, month, 1);

      const lastDate = new Date(year, month + 1, 0);

      try {
        const data = await getAppointmentsForRange(
          formatDateKey(firstDate),
          formatDateKey(lastDate),
        );

        if (!cancelled) {
          setAppointments(data);
        }
      } catch (error) {
        console.error("Failed to load booking availability:", error);

        if (!cancelled) {
          setAppointments([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingAppointments(false);
        }
      }
    }

    loadAppointments();

    return () => {
      cancelled = true;
    };
  }, [visibleMonth]);

  /* ========================================
     CALENDAR DAYS
  ======================================== */

  const calendarDays = useMemo<CalendarDay[]>(() => {
    const year = visibleMonth.getFullYear();

    const month = visibleMonth.getMonth();

    const firstDay = new Date(year, month, 1);

    const lastDay = new Date(year, month + 1, 0);

    /*
        JavaScript:
        Sunday = 0
        Monday = 1

        Calendar:
        Monday -> Sunday
      */

    const leadingDays = (firstDay.getDay() + 6) % 7;

    const days: CalendarDay[] = [];

    /* PREVIOUS MONTH */

    for (let i = leadingDays; i > 0; i--) {
      const date = new Date(year, month, 1 - i);

      days.push({
        date,
        currentMonth: false,
      });
    }

    /* CURRENT MONTH */

    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push({
        date: new Date(year, month, day),

        currentMonth: true,
      });
    }

    /* NEXT MONTH */

    while (days.length % 7 !== 0) {
      const last = days[days.length - 1].date;

      const date = new Date(
        last.getFullYear(),
        last.getMonth(),
        last.getDate() + 1,
      );

      days.push({
        date,
        currentMonth: false,
      });
    }

    return days;
  }, [visibleMonth]);

  /* ========================================
     AVAILABLE TIMES
  ======================================== */

  const availableSlots = useMemo(() => {
    if (!selectedDate) {
      return [];
    }

    return getAvailableSlots(selectedDate, durationMinutes, appointments);
  }, [selectedDate, durationMinutes, appointments]);

  /*
    Slots that would be possible if there were no existing bookings.

    This lets us distinguish between:
    - fully booked
    - no remaining times today
    - selected service does not fit into the business day
  */
  const theoreticalSlots = useMemo(() => {
    if (!selectedDate) {
      return [];
    }

    return getAvailableSlots(selectedDate, durationMinutes, []);
  }, [selectedDate, durationMinutes]);

  const selectedDateIsToday =
    selectedDate !== null &&
    formatDateKey(selectedDate) === formatDateKey(new Date());

  /* ========================================
     RESET SELECTION
  ======================================== */

  const resetSelection = () => {
    setSelectedDate(null);

    setSelectedStartTime(null);

    onSelectionChange(null);
  };

  /* ========================================
     MONTH NAVIGATION
  ======================================== */

  const previousMonth = () => {
    setVisibleMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() - 1, 1),
    );

    resetSelection();
  };

  const nextMonth = () => {
    setVisibleMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() + 1, 1),
    );

    resetSelection();
  };

  /* ========================================
     PREVENT NAVIGATING INTO PAST MONTHS
  ======================================== */

  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const canGoPrevious = visibleMonth > currentMonthStart;

  /* ========================================
     SELECT DATE
  ======================================== */

  const handleDateSelect = (date: Date) => {
    if (isPastDate(date) || isClosedDay(date)) {
      return;
    }

    setSelectedDate(date);

    setSelectedStartTime(null);

    /*
      If the customer changes the date,
      their previous time selection
      is no longer valid.
    */

    onSelectionChange(null);
  };

  /* ========================================
     SELECT TIME
  ======================================== */

  const handleTimeSelect = (startMinutes: number) => {
    if (!selectedDate) {
      return;
    }

    setSelectedStartTime(startMinutes);

    onSelectionChange({
      date: selectedDate,

      dateKey: formatDateKey(selectedDate),

      startMinutes,
    });
  };

  /* ========================================
     MONTH LABEL
  ======================================== */

  const monthLabel = visibleMonth.toLocaleDateString("en-CA", {
    month: "long",
    year: "numeric",
  });

  /* ========================================
     SELECTED DATE LABEL
  ======================================== */

  const selectedDateLabel = selectedDate
    ? selectedDate.toLocaleDateString("en-CA", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : null;

  /* ========================================
     RENDER
  ======================================== */

  return (
    <div className="bookingCalendar">
      {/* ================================
          CALENDAR
      ================================ */}

      <div className="bookingCalendar__calendar">
        <div className="calendarHeader">
          <button
            type="button"
            className="calendarNavButton"
            onClick={previousMonth}
            disabled={!canGoPrevious}
            aria-label="Previous month"
          >
            <ChevronLeft size={18} />
          </button>

          <h4>{monthLabel}</h4>

          <button
            type="button"
            className="calendarNavButton"
            onClick={nextMonth}
            aria-label="Next month"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="calendarWeekdays">
          {WEEKDAYS.map((weekday) => (
            <span key={weekday}>{weekday}</span>
          ))}
        </div>

        <div className="calendarDays">
          {calendarDays.map(({ date, currentMonth }) => {
            const past = isPastDate(date);

            const closed = isClosedDay(date);

            const dateKey = formatDateKey(date);

            const selected = selectedDate
              ? formatDateKey(selectedDate) === dateKey
              : false;

            const disabled = !currentMonth || past || closed;

            return (
              <button
                type="button"
                key={dateKey}
                disabled={disabled}
                className={[
                  "calendarDay",

                  !currentMonth ? "calendarDay--outside" : "",

                  past ? "calendarDay--disabled" : "",

                  closed ? "calendarDay--closed" : "",

                  selected ? "calendarDay--selected" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => handleDateSelect(date)}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>

        <p className="calendarClosedNote">Sundays are closed.</p>
      </div>

      {/* ================================
          TIME SLOTS
      ================================ */}

      <div className="bookingCalendar__times">
        {!selectedDate && !loadingAppointments && (
          <div className="timeSlotEmpty">
            <span>SELECT A DATE</span>

            <p>Choose an available date to see appointment times.</p>
          </div>
        )}

        {loadingAppointments && (
          <div className="timeSlotEmpty">
            <span>LOADING AVAILABILITY</span>

            <p>Checking available appointment times.</p>
          </div>
        )}

        {selectedDate && !loadingAppointments && (
          <>
            <div className="timeSlotHeader">
              <span>AVAILABLE TIMES</span>

              <h4>{selectedDateLabel}</h4>
            </div>

            {availableSlots.length > 0 ? (
              <div className="timeSlotGrid">
                {availableSlots.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    className={
                      selectedStartTime === slot
                        ? "timeSlot timeSlot--selected"
                        : "timeSlot"
                    }
                    onClick={() => handleTimeSelect(slot)}
                  >
                    {formatTime(slot)}
                  </button>
                ))}
              </div>
            ) : (
              <div className="timeSlotEmpty">
                {theoreticalSlots.length === 0 ? (
                  selectedDateIsToday ? (
                    <>
                      <span>NO TIMES AVAILABLE</span>

                      <p>
                        No more appointment times are available today. Please
                        select another date.
                      </p>
                    </>
                  ) : (
                    <>
                      <span>NO TIMES AVAILABLE</span>

                      <p>
                        The selected services do not fit within the remaining
                        booking hours for this date. Please select another date.
                      </p>
                    </>
                  )
                ) : (
                  <>
                    <span>FULLY BOOKED</span>

                    <p>
                      All appointment times that can accommodate your selected
                      services are already booked on this date.
                    </p>
                  </>
                )}
              </div>
            )}

            {selectedStartTime !== null && (
              <div className="selectedTimeSummary">
                <span>SELECTED TIME</span>

                <strong>{formatTime(selectedStartTime)}</strong>

                <small>{selectedDateLabel}</small>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
