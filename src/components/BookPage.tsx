import BookingCalendar, {
  type BookingDateTimeSelection,
} from "./BookingCalendar";

import { useMemo, useState } from "react";

import { createBooking } from "../data/appointments";
import { formatTime } from "../data/availability";

import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";

import {
  bookingServices,
  formatDuration,
  formatServicePrice,
  getServiceDurationLabel,
  type BookingAudience,
  type BookingService,
} from "../data/booking";

export default function BookPage() {
  const [audience, setAudience] = useState<BookingAudience | null>(null);

  const [selectedServices, setSelectedServices] = useState<BookingService[]>(
    [],
  );

  const [bookingStep, setBookingStep] = useState<
    "services" | "datetime" | "details" | "confirmed"
  >("services");

  const [dateTimeSelection, setDateTimeSelection] =
    useState<BookingDateTimeSelection | null>(null);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  /* ========================================
     TOTAL DURATION
  ======================================== */

  const totalDurationMinutes = useMemo(() => {
    return selectedServices.reduce(
      (total, service) => total + service.durationMinutes,
      0,
    );
  }, [selectedServices]);

  /* ========================================
     CHECK SELECTED
  ======================================== */

  const isSelected = (serviceId: string) => {
    return selectedServices.some((service) => service.id === serviceId);
  };

  /* ========================================
     SELECT / REMOVE SERVICE
  ======================================== */

  const toggleService = (service: BookingService) => {
    setSelectedServices((current) => {
      const alreadySelected = current.some((item) => item.id === service.id);

      if (alreadySelected) {
        return current.filter((item) => item.id !== service.id);
      }

      return [...current, service];
    });
  };

  const removeService = (serviceId: string) => {
    setSelectedServices((current) =>
      current.filter((service) => service.id !== serviceId),
    );
  };

  /* ========================================
     NAVIGATION
  ======================================== */

  const changeAudience = () => {
    /*
      IMPORTANT:
      Men / Women 변경 시 기존
      서비스 선택은 그대로 유지.
    */

    setAudience(null);
  };

  const goToDateTime = () => {
    if (selectedServices.length === 0) {
      return;
    }

    setBookingStep("datetime");
  };

  const goBackToServices = () => {
    setBookingStep("services");
  };

  const goToDetails = () => {
    if (!dateTimeSelection) return;
    setBookingError(null);
    setBookingStep("details");
  };

  const goBackToDateTime = () => {
    setBookingError(null);
    setBookingStep("datetime");
  };

  const handleConfirmBooking = async () => {
    setBookingError(null);

    if (!dateTimeSelection) {
      setBookingError("Please select a date and time.");
      return;
    }

    if (customerName.trim().length < 2) {
      setBookingError("Please enter your name.");
      return;
    }

    const phoneDigits = customerPhone.replace(/\D/g, "");
    const validPhone =
      phoneDigits.length === 10 ||
      (phoneDigits.length === 11 && phoneDigits.startsWith("1"));

    if (!validPhone) {
      setBookingError("Please enter a valid phone number.");
      return;
    }

    setSubmittingBooking(true);

    try {
      const id = await createBooking({
        appointmentDate: dateTimeSelection.dateKey,
        startMinutes: dateTimeSelection.startMinutes,
        endMinutes: dateTimeSelection.startMinutes + totalDurationMinutes,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        notes: notes.trim(),
        services: selectedServices,
      });

      setBookingId(id);
      setBookingStep("confirmed");
    } catch (error: unknown) {
      const failure = error as { code?: string; message?: string };

      if (
        failure.code === "23P01" ||
        failure.message?.includes("appointments_no_overlap")
      ) {
        setBookingError(
          "That appointment time was just booked by someone else. Please choose another time.",
        );
      } else {
        setBookingError("We couldn't complete your booking. Please try again.");
      }
    } finally {
      setSubmittingBooking(false);
    }
  };

  /* ========================================
     DETERMINE MEN / WOMEN
  ======================================== */

  const getServiceAudience = (service: BookingService): "Men" | "Women" => {
    return service.id.startsWith("mens-") ? "Men" : "Women";
  };

  return (
    <main className="bookingPage">
      {/* ====================================
          TOP BAR
      ==================================== */}

      <header className="bookingTopbar">
        <a className="brand" href="/" aria-label="Bling Bling Hair Salon home">
          <span>BLING BLING</span>

          <small>HAIR SALON</small>
        </a>

        <a className="bookingBack" href="/">
          <ArrowLeft size={16} />
          Back to website
        </a>
      </header>

      <section className="bookingShell">
        {/* ====================================
            INTRO
        ==================================== */}

        <div className="bookingIntroBlock">
          <p className="eyebrow">BOOK AN APPOINTMENT</p>

          <h1 className="bookingTitle">
            Find a time that
            <br />
            <em>works for you.</em>
          </h1>

          <p className="bookingIntro">
            Choose who the appointment is for, then select one or more services.
          </p>
        </div>

        {/* ====================================
            STEP 01
            MEN / WOMEN
        ==================================== */}

        {!audience && bookingStep === "services" && (
          <section className="bookingStep">
            <div className="bookingStepHead">
              <span>01</span>

              <h2>
                Who is the
                <br />
                appointment for?
              </h2>
            </div>

            <div className="audienceGrid">
              <button type="button" onClick={() => setAudience("men")}>
                <span>Men</span>

                <ArrowRight size={22} />
              </button>

              <button type="button" onClick={() => setAudience("women")}>
                <span>Women</span>

                <ArrowRight size={22} />
              </button>
            </div>

            {selectedServices.length > 0 && (
              <SelectionSummary
                selectedServices={selectedServices}
                totalDurationMinutes={totalDurationMinutes}
                removeService={removeService}
                getServiceAudience={getServiceAudience}
                onNext={goToDateTime}
              />
            )}
          </section>
        )}

        {/* ====================================
            STEP 02
            SERVICES
        ==================================== */}

        {audience && bookingStep === "services" && (
          <section className="bookingStep">
            <button
              type="button"
              className="textButton"
              onClick={changeAudience}
            >
              <ArrowLeft size={15} />
              Change selection
            </button>

            <div className="bookingStepHead">
              <span>02</span>

              <h2>
                Select your
                <br />
                services.
              </h2>
            </div>

            <p className="bookingStepDescription">
              Select one or more services. You can switch between Men and Women
              without losing your selections.
            </p>

            {/* SHAMPOO NOTE */}

            <div className="bookingIncludedNote">
              Shampoo & blow-dry are included with every service.
            </div>

            <div className="bookingServiceList">
              {bookingServices[audience].map((item) => {
                const selected = isSelected(item.id);

                return (
                  <button
                    type="button"
                    key={item.id}
                    className={
                      selected
                        ? "bookingServiceItem bookingServiceItem--selected"
                        : "bookingServiceItem"
                    }
                    onClick={() => toggleService(item)}
                  >
                    <span>
                      <strong>{item.name}</strong>

                      <small>
                        {getServiceDurationLabel(item)}

                        {" · "}

                        {formatServicePrice(item)}
                      </small>
                    </span>

                    <span className="bookingServiceIcon">
                      {selected ? (
                        <Check size={18} />
                      ) : (
                        <ArrowRight size={18} />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedServices.length > 0 && (
              <SelectionSummary
                selectedServices={selectedServices}
                totalDurationMinutes={totalDurationMinutes}
                removeService={removeService}
                getServiceAudience={getServiceAudience}
                onNext={goToDateTime}
              />
            )}
          </section>
        )}

        {/* ====================================
            STEP 03
            DATE & TIME
        ==================================== */}

        {bookingStep === "datetime" && (
          <section className="bookingStep">
            <button
              type="button"
              className="textButton"
              onClick={goBackToServices}
            >
              <ArrowLeft size={15} />
              Edit services
            </button>

            <div className="bookingStepHead">
              <span>03</span>

              <h2>
                Choose a
                <br />
                date & time.
              </h2>
            </div>

            <div className="bookingSelection">
              {/* ============================
                  LEFT SUMMARY
              ============================ */}

              <div className="bookingSelection__service">
                <div className="bookingSelectionHeader">
                  <p className="eyebrow">YOUR SELECTION</p>

                  <span>
                    {selectedServices.length}{" "}
                    {selectedServices.length === 1 ? "service" : "services"}
                  </span>
                </div>

                <div className="selectedServicesSummary">
                  {selectedServices.map((service) => (
                    <div key={service.id} className="selectedServiceCard">
                      <div className="selectedServiceCard__main">
                        <span className="selectedServiceGender">
                          {getServiceAudience(service)}
                        </span>

                        <strong>{service.name}</strong>

                        <small className="selectedServicePrice">
                          {formatServicePrice(service)}
                        </small>
                      </div>

                      <span className="selectedServiceDuration">
                        {getServiceDurationLabel(service)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="selectedServiceTotal">
                  <span>Estimated time</span>

                  <strong>{formatDuration(totalDurationMinutes)}</strong>
                </div>

                <p className="bookingPriceDisclaimer">
                  Final pricing for selected services may vary depending on hair
                  length, texture, thickness, and technique.
                </p>
              </div>

              {/* ============================
                  RIGHT CALENDAR
              ============================ */}

              <div className="bookingSelection__calendar">
                <p className="eyebrow">AVAILABILITY</p>

                <h3>Select your preferred date.</h3>

                <p>
                  Available times are based on the combined duration of your
                  selected services.
                </p>

                <BookingCalendar
                  durationMinutes={totalDurationMinutes}
                  onSelectionChange={setDateTimeSelection}
                />

                {dateTimeSelection && (
                  <button
                    type="button"
                    className="button bookingDateContinue"
                    onClick={goToDetails}
                  >
                    Continue
                    <ArrowRight size={17} />
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

        {bookingStep === "details" && dateTimeSelection && (
          <section className="bookingStep">
            <button
              type="button"
              className="textButton"
              onClick={goBackToDateTime}
            >
              <ArrowLeft size={15} />
              Change date & time
            </button>

            <div className="bookingStepHead">
              <span>04</span>
              <h2>
                Your
                <br />
                details.
              </h2>
            </div>

            <div className="bookingDetailsLayout">
              <div className="bookingDetailsForm">
                <label>
                  <span>NAME *</span>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </label>
                <label>
                  <span>PHONE NUMBER *</span>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="905-123-4567"
                    autoComplete="tel"
                  />
                </label>
                <label>
                  <span>EMAIL</span>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Optional"
                    autoComplete="email"
                  />
                </label>
                <label>
                  <span>NOTES</span>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Optional notes for your appointment"
                    rows={4}
                  />
                </label>
              </div>

              <div className="bookingFinalSummary">
                <p className="eyebrow">YOUR APPOINTMENT</p>
                <h3>
                  {dateTimeSelection.date.toLocaleDateString("en-CA", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
                <strong className="bookingFinalTime">
                  {formatTime(dateTimeSelection.startMinutes)}
                  {" — "}
                  {formatTime(
                    dateTimeSelection.startMinutes + totalDurationMinutes,
                  )}
                </strong>

                <div className="bookingFinalServices">
                  {selectedServices.map((service) => (
                    <div key={service.id}>
                      <span>{service.name}</span>
                      <small>{formatServicePrice(service)}</small>
                    </div>
                  ))}
                </div>

                <div className="bookingFinalDuration">
                  <span>ESTIMATED TIME</span>
                  <strong>{formatDuration(totalDurationMinutes)}</strong>
                </div>

                {bookingError && <p className="bookingError">{bookingError}</p>}

                <button
                  type="button"
                  className="button bookingConfirmButton"
                  disabled={submittingBooking}
                  onClick={handleConfirmBooking}
                >
                  {submittingBooking ? "Booking..." : "Confirm booking"}
                </button>
              </div>
            </div>
          </section>
        )}

        {bookingStep === "confirmed" && dateTimeSelection && (
          <section className="bookingStep bookingConfirmed">
            <span className="bookingConfirmed__icon">
              <Check size={24} />
            </span>
            <p className="eyebrow">BOOKING CONFIRMED</p>
            <h2>
              You're
              <br />
              <em>all set.</em>
            </h2>
            <p>Your appointment has been successfully booked.</p>

            <div className="bookingConfirmed__details">
              <strong>
                {dateTimeSelection.date.toLocaleDateString("en-CA", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </strong>
              <span>
                {formatTime(dateTimeSelection.startMinutes)}
                {" — "}
                {formatTime(
                  dateTimeSelection.startMinutes + totalDurationMinutes,
                )}
              </span>
              {selectedServices.map((service) => (
                <small key={service.id}>{service.name}</small>
              ))}
            </div>

            <a className="button" href="/">
              Back to website
            </a>
            {bookingId && (
              <small className="bookingReference">
                Booking reference: {bookingId.slice(0, 8).toUpperCase()}
              </small>
            )}
          </section>
        )}
      </section>
    </main>
  );
}

/* ========================================
   SELECTION SUMMARY COMPONENT
======================================== */

type SelectionSummaryProps = {
  selectedServices: BookingService[];

  totalDurationMinutes: number;

  removeService: (serviceId: string) => void;

  getServiceAudience: (service: BookingService) => "Men" | "Women";

  onNext: () => void;
};

function SelectionSummary({
  selectedServices,

  totalDurationMinutes,

  removeService,

  getServiceAudience,

  onNext,
}: SelectionSummaryProps) {
  return (
    <div className="bookingCurrentSelection">
      <div className="bookingCurrentSelection__head">
        <p className="eyebrow">YOUR SELECTION</p>

        <span>
          {selectedServices.length}{" "}
          {selectedServices.length === 1 ? "service" : "services"}
        </span>
      </div>

      <div className="bookingCurrentSelection__list">
        {selectedServices.map((service) => (
          <div key={service.id} className="bookingCurrentSelection__item">
            <div>
              <small>{getServiceAudience(service)}</small>

              <strong>{service.name}</strong>

              <span className="bookingSummaryPrice">
                {formatServicePrice(service)}
              </span>
            </div>

            <div className="bookingCurrentSelection__right">
              <span>{getServiceDurationLabel(service)}</span>

              <button
                type="button"
                onClick={() => removeService(service.id)}
                aria-label={`Remove ${service.name}`}
              >
                <X size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bookingCurrentSelection__footer">
        <div>
          <span>ESTIMATED TIME</span>

          <strong>{formatDuration(totalDurationMinutes)}</strong>
        </div>

        <button
          type="button"
          className="button bookingNextButton"
          onClick={onNext}
        >
          Next
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}
