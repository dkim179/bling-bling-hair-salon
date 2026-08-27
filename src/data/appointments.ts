import { supabase }
  from '../lib/supabase'

import type { Appointment }
  from './availability'


type BusySlotRow = {
  appointment_date: string
  start_minutes: number
  end_minutes: number
}


export async function
getAppointmentsForRange(
  fromDate: string,
  toDate: string
): Promise<Appointment[]> {

  const {
    data,
    error,
  } = await supabase.rpc(
    'get_busy_slots',
    {
      p_from: fromDate,
      p_to: toDate,
    }
  )


  if (error) {
    console.error(
      'Failed to load appointments:',
      error
    )

    throw error
  }


  const rows =
    (data ?? []) as BusySlotRow[]


  return rows.map(
    (row, index) => ({
      id: `busy-${row.appointment_date}-${row.start_minutes}-${index}`,

      date:
        row.appointment_date,

      startMinutes:
        row.start_minutes,

      endMinutes:
        row.end_minutes,
    })
  )
}