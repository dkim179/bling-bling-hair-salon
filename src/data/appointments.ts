import { supabase } from "../lib/supabase";

import type { Appointment } from "./availability";

import { formatServicePrice, type BookingService } from "./booking";

/* ========================================
   BUSY SLOT TYPES
======================================== */

type BusySlotRow = {
  appointment_date: string;
  start_minutes: number;
  end_minutes: number;
};

/* ========================================
   GET APPOINTMENTS
======================================== */

export async function getAppointmentsForRange(
  fromDate: string,
  toDate: string,
): Promise<Appointment[]> {
  const { data, error } = await supabase.rpc("get_busy_slots", {
    p_from: fromDate,
    p_to: toDate,
  });

  if (error) {
    console.error("Failed to load appointments:", error);

    throw error;
  }

  const rows = (data ?? []) as BusySlotRow[];

  return rows.map((row, index) => ({
    id: `busy-${row.appointment_date}-${row.start_minutes}-${index}`,

    date: row.appointment_date,

    startMinutes: row.start_minutes,

    endMinutes: row.end_minutes,
  }));
}

/* ========================================
   CREATE BOOKING TYPES
======================================== */

type CreateBookingInput = {
  appointmentDate: string;

  startMinutes: number;
  endMinutes: number;

  customerName: string;
  customerPhone: string;

  customerEmail?: string;
  notes?: string;

  services: BookingService[];
};

/* ========================================
   CREATE BOOKING
======================================== */

export async function createBooking({
  appointmentDate,
  startMinutes,
  endMinutes,
  customerName,
  customerPhone,
  customerEmail = "",
  notes = "",
  services,
}: CreateBookingInput): Promise<string> {
  const serviceData = services.map((service) => ({
    id: service.id,

    name: service.name,

    audience: service.id.startsWith("mens-") ? "Men" : "Women",

    durationMinutes: service.durationMinutes,

    durationLabel: service.durationLabel ?? null,

    priceMin: service.priceMin,

    priceMax: service.priceMax,

    price: formatServicePrice(service),

    priceNote: service.priceNote ?? null,
  }));

  const { data, error } = await supabase.rpc("create_booking", {
    p_appointment_date: appointmentDate,

    p_start_minutes: startMinutes,

    p_end_minutes: endMinutes,

    p_customer_name: customerName,

    p_customer_phone: customerPhone,

    p_customer_email: customerEmail,

    p_notes: notes,

    p_services: serviceData,
  });

  if (error) {
    console.error("Failed to create booking:", error);

    throw error;
  }

  return data as string;
}
