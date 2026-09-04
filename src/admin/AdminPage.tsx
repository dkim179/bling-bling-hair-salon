import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type AppointmentService = {
  id?: string;
  name: string;
  durationMinutes?: number;
};

type Appointment = {
  id: string;
  appointment_date: string;
  start_minutes: number;
  end_minutes: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  notes: string | null;
  status: "confirmed" | "cancelled";
  services: AppointmentService[];
  created_at: string;
};

function formatTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;

  return `${displayHours}:${mins.toString().padStart(2, "0")} ${period}`;
}

function getTodayDateKey() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);

  const date = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default function AdminPage() {
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [selectedDateFilter, setSelectedDateFilter] = useState("");

  useEffect(() => {
    async function initializeAdmin() {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        window.location.href = "/admin/login";
        return;
      }

      setIsCheckingSession(false);

      const today = getTodayDateKey();

      const { data, error: appointmentsError } = await supabase
        .from("appointments")
        .select(
          `
            id,
            appointment_date,
            start_minutes,
            end_minutes,
            customer_name,
            customer_phone,
            customer_email,
            notes,
            status,
            services,
            created_at
          `,
        )
        .gte("appointment_date", today)
        .eq("status", "confirmed")
        .order("appointment_date", { ascending: true })
        .order("start_minutes", { ascending: true });

      if (appointmentsError) {
        console.error("Unable to load appointments:", appointmentsError);
        setError("Unable to load appointments.");
        setIsLoadingAppointments(false);
        return;
      }

      setAppointments((data ?? []) as Appointment[]);
      setIsLoadingAppointments(false);
    }

    initializeAdmin();
  }, []);

  const todayDateKey = getTodayDateKey();

  const todayAppointments = useMemo(
    () =>
      appointments.filter(
        (appointment) => appointment.appointment_date === todayDateKey,
      ),
    [appointments, todayDateKey],
  );

  const upcomingAppointments = useMemo(
    () =>
      appointments.filter(
        (appointment) => appointment.appointment_date > todayDateKey,
      ),
    [appointments, todayDateKey],
  );

  const filteredUpcomingAppointments = useMemo(() => {
    if (!selectedDateFilter) {
      return upcomingAppointments;
    }

    return upcomingAppointments.filter(
      (appointment) => appointment.appointment_date === selectedDateFilter,
    );
  }, [upcomingAppointments, selectedDateFilter]);

  const upcomingAppointmentsByDate = useMemo(() => {
    const groups = new Map<string, Appointment[]>();

    filteredUpcomingAppointments.forEach((appointment) => {
      const existingGroup = groups.get(appointment.appointment_date);

      if (existingGroup) {
        existingGroup.push(appointment);
      } else {
        groups.set(appointment.appointment_date, [appointment]);
      }
    });

    return Array.from(groups.entries());
  }, [filteredUpcomingAppointments]);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  async function handleCancelAppointment(appointment: Appointment) {
    const confirmed = window.confirm(
      `Cancel ${appointment.customer_name}'s appointment on ${formatDate(
        appointment.appointment_date,
      )} at ${formatTime(appointment.start_minutes)}?`,
    );

    if (!confirmed) {
      return;
    }

    setCancellingId(appointment.id);

    const { error: cancelError } = await supabase.rpc("cancel_appointment", {
      p_appointment_id: appointment.id,
    });

    if (cancelError) {
      console.error("Unable to cancel appointment:", cancelError);
      window.alert("Unable to cancel appointment. Please try again.");
      setCancellingId(null);
      return;
    }

    setAppointments((currentAppointments) =>
      currentAppointments.filter(
        (currentAppointment) => currentAppointment.id !== appointment.id,
      ),
    );

    setCancellingId(null);
  }

  function renderAppointment(appointment: Appointment) {
    return (
      <article className="adminAppointmentCard" key={appointment.id}>
        <div className="adminAppointmentTop">
          <div>
            <h3 className="adminAppointmentName">
              {appointment.customer_name}
            </h3>

            <p className="adminAppointmentTime">
              {formatTime(appointment.start_minutes)} –{" "}
              {formatTime(appointment.end_minutes)}
            </p>
          </div>

          <span className="adminAppointmentDate">
            {formatDate(appointment.appointment_date)}
          </span>
        </div>

        <div className="adminAppointmentDetails">
          <p>
            <strong>Phone:</strong>{" "}
            <a href={`tel:${appointment.customer_phone}`}>
              {appointment.customer_phone}
            </a>
          </p>

          {appointment.customer_email && (
            <p>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${appointment.customer_email}`}>
                {appointment.customer_email}
              </a>
            </p>
          )}

          <p>
            <strong>Services:</strong>{" "}
            {appointment.services?.length
              ? appointment.services.map((service) => service.name).join(", ")
              : "No service information"}
          </p>

          {appointment.notes && (
            <p>
              <strong>Notes:</strong> {appointment.notes}
            </p>
          )}
        </div>

        <div className="adminAppointmentActions">
          <button
            className="adminCancelButton"
            type="button"
            onClick={() => handleCancelAppointment(appointment)}
            disabled={cancellingId === appointment.id}
          >
            {cancellingId === appointment.id
              ? "Cancelling..."
              : "Cancel appointment"}
          </button>
        </div>
      </article>
    );
  }

  if (isCheckingSession) {
    return (
      <main className="adminPage">
        <p className="adminLoading">Loading...</p>
      </main>
    );
  }

  return (
    <main className="adminPage">
      <div className="adminPageInner">
        <header className="adminPageHeader">
          <div>
            <p className="adminEyebrow">BLING BLING · ADMIN</p>
            <h1>Appointments</h1>
            <p>Manage today's schedule and upcoming bookings.</p>
          </div>

          <button
            className="adminLogoutButton"
            type="button"
            onClick={handleLogout}
          >
            Log out
          </button>
        </header>

        {isLoadingAppointments && (
          <p className="adminLoading">Loading appointments...</p>
        )}

        {error && <p className="adminLoadError">{error}</p>}

        {!isLoadingAppointments && !error && (
          <div className="adminDashboardContent">
            <section className="adminSection">
              <div className="adminSectionHeader">
                <h2>Today</h2>

                <span className="adminSectionCount">
                  {todayAppointments.length}{" "}
                  {todayAppointments.length === 1
                    ? "appointment"
                    : "appointments"}
                </span>
              </div>

              {todayAppointments.length === 0 ? (
                <p className="adminEmptyState">No appointments today.</p>
              ) : (
                <div className="adminAppointmentList">
                  {todayAppointments.map(renderAppointment)}
                </div>
              )}
            </section>

            <section className="adminSection">
              <div className="adminSectionHeader">
                <h2>Upcoming</h2>

                <span className="adminSectionCount">
                  {upcomingAppointments.length}{" "}
                  {upcomingAppointments.length === 1
                    ? "appointment"
                    : "appointments"}
                </span>
              </div>

              {upcomingAppointments.length > 0 && (
                <div className="adminDateFilter">
                  <label htmlFor="appointmentDateFilter">
                    <span>View date</span>

                    <input
                      id="appointmentDateFilter"
                      type="date"
                      value={selectedDateFilter}
                      min={todayDateKey}
                      onChange={(event) =>
                        setSelectedDateFilter(event.target.value)
                      }
                    />
                  </label>

                  {selectedDateFilter && (
                    <button
                      type="button"
                      className="adminClearFilterButton"
                      onClick={() => setSelectedDateFilter("")}
                    >
                      Show all
                    </button>
                  )}
                </div>
              )}

              {upcomingAppointments.length === 0 ? (
                <p className="adminEmptyState">No upcoming appointments.</p>
              ) : upcomingAppointmentsByDate.length === 0 ? (
                <p className="adminEmptyState">
                  No appointments scheduled for this date.
                </p>
              ) : (
                <div className="adminDateGroups">
                  {upcomingAppointmentsByDate.map(
                    ([date, dateAppointments]) => (
                      <div className="adminDateGroup" key={date}>
                        <div className="adminDateGroupHeader">
                          <h3>{formatDate(date)}</h3>

                          <span>
                            {dateAppointments.length}{" "}
                            {dateAppointments.length === 1
                              ? "appointment"
                              : "appointments"}
                          </span>
                        </div>

                        <div className="adminAppointmentList">
                          {dateAppointments.map(renderAppointment)}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
