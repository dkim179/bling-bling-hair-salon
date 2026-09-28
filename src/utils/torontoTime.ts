const TORONTO_TIME_ZONE = "America/Toronto";

export function getTorontoTodayParts() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: TORONTO_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(new Date());

  const year = Number(
    parts.find((part) => part.type === "year")?.value,
  );

  const month = Number(
    parts.find((part) => part.type === "month")?.value,
  );

  const day = Number(
    parts.find((part) => part.type === "day")?.value,
  );

  return {
    year,
    month,
    day,
  };
}

export function getTorontoDateKey() {
  const { year, month, day } = getTorontoTodayParts();

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
    2,
    "0",
  )}`;
}

export function getTorontoCurrentMinutes() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: TORONTO_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(new Date());

  const hour = Number(
    parts.find((part) => part.type === "hour")?.value,
  );

  const minute = Number(
    parts.find((part) => part.type === "minute")?.value,
  );

  return hour * 60 + minute;
}