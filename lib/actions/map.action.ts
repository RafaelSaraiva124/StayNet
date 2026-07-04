"use server";

export async function geocodeLocation(location: string) {
  if (!location) return null;

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      location,
    )}`,
    {
      headers: {
        "User-Agent": "staynet-app/1.0 (contact@staynet.pt)",
      },
      cache: "no-store",
    },
  );

  const data = await res.json();

  if (!data.length) return null;

  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
  };
}
