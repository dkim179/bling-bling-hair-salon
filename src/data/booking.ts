export type BookingAudience = "men" | "women";

export type BookingService = {
  id: string;
  name: string;

  /*
    실제 availability 계산에 사용할 시간.
    여자 Magic Straight처럼 3~4시간인 경우에는
    안전하게 최대 시간인 240분을 예약 슬롯 계산에 사용.
  */
  durationMinutes: number;

  /*
    고객에게 보여줄 시간.
    실제 안내가 범위인 경우 표현 가능.
  */
  durationLabel?: string;

  priceMin: number;
  priceMax: number;

  priceNote?: string;
};

export const bookingServices: Record<BookingAudience, BookingService[]> = {
  men: [
    {
      id: "mens-haircut",
      name: "Men's Haircut",
      durationMinutes: 30,
      priceMin: 35,
      priceMax: 35,
    },

    {
      id: "mens-perm",
      name: "Men's Perm",
      durationMinutes: 120,
      priceMin: 90,
      priceMax: 90,
    },

    {
      id: "mens-colour",
      name: "Men's Colour",
      durationMinutes: 90,
      priceMin: 90,
      priceMax: 90,
    },

    {
      id: "mens-magic-straight",
      name: "Men's Magic Straight",
      durationMinutes: 150,
      priceMin: 150,
      priceMax: 150,
    },
  ],

  women: [
    {
      id: "womens-haircut",
      name: "Women's Haircut",
      durationMinutes: 60,
      priceMin: 40,
      priceMax: 40,
    },

    {
      id: "womens-perm",
      name: "Women's Perm",
      durationMinutes: 120,
      priceMin: 100,
      priceMax: 150,
      priceNote: "Price varies depending on hair length and perm type.",
    },

    {
      id: "womens-digital-straight-perm",
      name: "Women's Digital Straight Perm",
      durationMinutes: 150,
      priceMin: 150,
      priceMax: 180,
      priceNote: "Price varies depending on hair length and technique.",
    },

    {
      id: "womens-digital-softening-perm-magic-straight",
      name: "Women's Digital Softening Perm + Magic Straight",
      durationMinutes: 240,
      priceMin: 250,
      priceMax: 350,
      priceNote: "Price varies depending on hair length and curl pattern.",
    },

    {
      id: "womens-colour-cut",
      name: "Women's Colour + Cut",
      durationMinutes: 120,
      priceMin: 120,
      priceMax: 150,
      priceNote: "Price varies depending on hair length.",
    },

    {
      id: "womens-magic-straight",
      name: "Women's Magic Straight",
      durationMinutes: 240,

      /*
        Availability는 안전하게 4시간을 막지만
        고객에게는 실제 안내인 3–4시간으로 표시.
      */
      durationLabel: "3–4 hr",

      priceMin: 250,
      priceMax: 300,

      priceNote: "Price varies depending on curl pattern and hair thickness.",
    },
  ],
};

/* ========================================
   FORMAT DURATION
======================================== */

export function formatDuration(minutes: number) {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
}

/* ========================================
   DISPLAY DURATION
======================================== */

export function getServiceDurationLabel(service: BookingService) {
  if (service.durationLabel) {
    return service.durationLabel;
  }

  return formatDuration(service.durationMinutes);
}

/* ========================================
   FORMAT PRICE
======================================== */

export function formatServicePrice(service: BookingService) {
  if (service.priceMin === service.priceMax) {
    return `$${service.priceMin}`;
  }

  return `$${service.priceMin}–$${service.priceMax}`;
}
