import {
  getTorontoCurrentMinutes,
  getTorontoDateKey,
} from "../utils/torontoTime";

/* ========================================
   BUSINESS HOURS
======================================== */

export const OPENING_TIME = 9 * 60;
// 9:00 AM

export const CLOSING_TIME = 16 * 60;
// 4:00 PM

export const SLOT_INTERVAL = 30;
// 30 minutes

/* ========================================
   APPOINTMENT TYPE
======================================== */

export type Appointment = {
  id: string;
  date: string;
  startMinutes: number;
  endMinutes: number;
};

/* ========================================
   DATE -> YYYY-MM-DD

   IMPORTANT:
   This Date represents a calendar date
   selected in the booking UI.

   Do not use toISOString() here because
   UTC conversion can shift the date.
======================================== */

export function formatDateKey(date: Date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* ========================================
   CLOSED DAY

   0 = Sunday
======================================== */

export function isClosedDay(date: Date) {
  return date.getDay() === 0;
}

/* ========================================
   CHECK IF DATE IS TODAY

   "Today" always means today in Toronto,
   regardless of the customer's timezone.
======================================== */

export function isToday(date: Date) {
  return formatDateKey(date) === getTorontoDateKey();
}

/* ========================================
   CURRENT TIME IN MINUTES

   Always uses Toronto local time.

   Example:
   5:38 PM -> 1058
======================================== */

export function getCurrentMinutes() {
  return getTorontoCurrentMinutes();
}

/* ========================================
   CHECK APPOINTMENT OVERLAP
======================================== */

export function hasAppointmentConflict(
  date: Date,
  startMinutes: number,
  endMinutes: number,
  appointments: Appointment[],
) {
  const dateKey = formatDateKey(date);

  return appointments.some((appointment) => {
    if (appointment.date !== dateKey) {
      return false;
    }

    /*
      Overlap formula:

      newStart < existingEnd
      &&
      newEnd > existingStart
    */

    return (
      startMinutes < appointment.endMinutes &&
      endMinutes > appointment.startMinutes
    );
  });
}

/* ========================================
   GENERATE AVAILABLE TIMES
======================================== */

export function getAvailableSlots(
  date: Date,
  durationMinutes: number,
  appointments: Appointment[],
) {
  if (isClosedDay(date) || isPastDate(date)) {
    return [];
  }

  const slots: number[] = [];

  const currentMinutes = isToday(date) ? getCurrentMinutes() : null;

  for (
    let startMinutes = OPENING_TIME;
    startMinutes + durationMinutes <= CLOSING_TIME;
    startMinutes += SLOT_INTERVAL
  ) {
    /*
      If the selected date is today in Toronto,
      do not allow appointment times that have
      already started or passed.
    */

    if (currentMinutes !== null && startMinutes <= currentMinutes) {
      continue;
    }

    const endMinutes = startMinutes + durationMinutes;

    const conflict = hasAppointmentConflict(
      date,
      startMinutes,
      endMinutes,
      appointments,
    );

    if (!conflict) {
      slots.push(startMinutes);
    }
  }

  return slots;
}

/* ========================================
   FORMAT TIME

   570 -> 9:30 AM
======================================== */

export function formatTime(minutes: number) {
  const hours24 = Math.floor(minutes / 60);

  const mins = minutes % 60;

  const period = hours24 >= 12 ? "PM" : "AM";

  const hours12 = hours24 % 12 || 12;

  return `${hours12}:${String(mins).padStart(2, "0")} ${period}`;
}

/* ========================================
   CHECK WHETHER DATE IS IN THE PAST

   Past/future comparison is based on the
   salon's Toronto calendar date.
======================================== */

export function isPastDate(date: Date) {
  const dateKey = formatDateKey(date);

  return dateKey < getTorontoDateKey();
}