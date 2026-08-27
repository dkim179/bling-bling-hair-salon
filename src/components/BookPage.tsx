import { useMemo, useState } from "react";

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

  const [bookingStep, setBookingStep] = useState<"services" | "datetime">(
    "services",
  );

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
                  Available times will be based on the combined duration of your
                  selected services.
                </p>

                <div className="calendarPlaceholder">Calendar coming next</div>
              </div>
            </div>
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
