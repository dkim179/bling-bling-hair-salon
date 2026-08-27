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
   MOCK APPOINTMENTS

   TEMPORARY:
   Later this will be replaced by
   appointments loaded from Supabase.
======================================== */

/* ========================================
   DATE -> YYYY-MM-DD

   IMPORTANT:
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
  if (isClosedDay(date)) {
    return [];
  }

  const slots: number[] = [];

  for (
    let startMinutes = OPENING_TIME;
    startMinutes + durationMinutes <= CLOSING_TIME;
    startMinutes += SLOT_INTERVAL
  ) {
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
======================================== */

export function isPastDate(date: Date) {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const target = new Date(date);

  target.setHours(0, 0, 0, 0);

  return target < today;
}
