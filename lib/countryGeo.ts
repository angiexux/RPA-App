const COUNTRY_CENTER: Record<string, { lat: number; lon: number; span: number }> = {
  Brazil: { lat: -14.235, lon: -51.925, span: 25 },
  Nigeria: { lat: 9.082, lon: 8.6753, span: 14 },
  Kenya: { lat: -0.0236, lon: 37.9062, span: 10 },
  Ghana: { lat: 7.9465, lon: -1.0232, span: 8 },
  "South Africa": { lat: -30.5595, lon: 22.9375, span: 14 },
  Ethiopia: { lat: 9.145, lon: 40.4897, span: 12 },
  Rwanda: { lat: -1.9403, lon: 29.8739, span: 4 },
  Tanzania: { lat: -6.369, lon: 34.8888, span: 12 },
  Uganda: { lat: 1.3733, lon: 32.2903, span: 8 },
  Senegal: { lat: 14.4974, lon: -14.4524, span: 8 },
  "Côte d'Ivoire": { lat: 7.54, lon: -5.5471, span: 7 },
  Mozambique: { lat: -18.6657, lon: 35.5296, span: 12 },
  Zimbabwe: { lat: -19.0154, lon: 29.1549, span: 8 },
  Colombia: { lat: 4.5709, lon: -74.2973, span: 11 },
  Mexico: { lat: 23.6345, lon: -102.5528, span: 17 },
  Argentina: { lat: -38.4161, lon: -63.6167, span: 18 },
  Chile: { lat: -35.6751, lon: -71.543, span: 14 },
  Peru: { lat: -9.19, lon: -75.0152, span: 11 },
  Ecuador: { lat: -1.8312, lon: -78.1834, span: 6 },
  Bolivia: { lat: -16.2902, lon: -63.5887, span: 10 },
  Paraguay: { lat: -23.4425, lon: -58.4438, span: 8 },
  Uruguay: { lat: -32.5228, lon: -55.7658, span: 5 },
  Guatemala: { lat: 15.7835, lon: -90.2308, span: 6 },
  "Costa Rica": { lat: 9.7489, lon: -83.7534, span: 4 },
};

export function getCountryMapEmbed(country: string) {
  const c = COUNTRY_CENTER[country] ?? { lat: 10, lon: 0, span: 30 };
  const left = c.lon - c.span;
  const right = c.lon + c.span;
  const top = c.lat + c.span * 0.6;
  const bottom = c.lat - c.span * 0.6;
  const bbox = `${left}%2C${bottom}%2C${right}%2C${top}`;
  const marker = `${c.lat}%2C${c.lon}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`;
}
