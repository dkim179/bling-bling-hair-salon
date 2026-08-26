export type BookingAudience = 'men' | 'women'

export type BookingService = {
  id: string
  name: string
  durationMinutes: number
}

export const bookingServices: Record<BookingAudience, BookingService[]> = {
  men: [
    {
      id: 'mens-haircut',
      name: "Men's Haircut",
      durationMinutes: 30,
    },
    {
      id: 'mens-perm',
      name: "Men's Perm",
      durationMinutes: 120,
    },
    {
      id: 'mens-colour',
      name: "Men's Colour",
      durationMinutes: 90,
    },
    {
      id: 'mens-magic-straight',
      name: "Men's Magic Straight",
      durationMinutes: 150,
    },
  ],

  women: [
    {
      id: 'womens-haircut',
      name: "Women's Haircut",
      durationMinutes: 60,
    },
    {
      id: 'womens-perm',
      name: "Women's Perm",
      durationMinutes: 120,
    },
    {
      id: 'womens-digital-straight-perm',
      name: "Women's Digital Straight Perm",
      durationMinutes: 150,
    },
    {
      id: 'womens-digital-softening-perm',
      name: "Women's Digital Softening Perm",
      durationMinutes: 210,
    },
    {
      id: 'womens-colour-cut',
      name: "Women's Colour + Cut",
      durationMinutes: 120,
    },
    {
      id: 'womens-magic-straight',
      name: "Women's Magic Straight",
      durationMinutes: 240,
    },
  ],
}

export function formatDuration(minutes: number) {
  if (minutes < 60) {
    return `${minutes} min`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (remainingMinutes === 0) {
    return `${hours} hr`
  }

  return `${hours} hr ${remainingMinutes} min`
}