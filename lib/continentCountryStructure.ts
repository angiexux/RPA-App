/**
 * Nested continent and country data structure
 * Includes all countries organized by continent/region
 */

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface Country {
  name: string;
  countryCode: string;
  continent: string;
  population: number;
  coordinates: Coordinates;
}

export interface Continent {
  name: string;
  region?: string;
  countries: Country[];
}

export const CONTINENTS_WITH_COUNTRIES: Continent[] = [
  {
    name: 'Africa',
    countries: [
      {
        name: 'Nigeria',
        countryCode: 'NG',
        continent: 'Africa',
        population: 223804632,
        coordinates: { lat: 9.0765, lon: 7.3986 },
      },
      {
        name: 'Kenya',
        countryCode: 'KE',
        continent: 'Africa',
        population: 54027487,
        coordinates: { lat: -0.0236, lon: 37.9062 },
      },
      {
        name: 'Ghana',
        countryCode: 'GH',
        continent: 'Africa',
        population: 34121869,
        coordinates: { lat: 7.3697, lon: -5.6789 },
      },
      {
        name: 'South Africa',
        countryCode: 'ZA',
        continent: 'Africa',
        population: 60142978,
        coordinates: { lat: -30.5595, lon: 22.9375 },
      },
      {
        name: 'Ethiopia',
        countryCode: 'ET',
        continent: 'Africa',
        population: 120283026,
        coordinates: { lat: 9.1450, lon: 40.4897 },
      },
      {
        name: 'Rwanda',
        countryCode: 'RW',
        continent: 'Africa',
        population: 13776698,
        coordinates: { lat: -1.9536, lon: 29.8739 },
      },
      {
        name: 'Tanzania',
        countryCode: 'TZ',
        continent: 'Africa',
        population: 63298554,
        coordinates: { lat: -6.3690, lon: 34.8888 },
      },
      {
        name: 'Uganda',
        countryCode: 'UG',
        continent: 'Africa',
        population: 47123531,
        coordinates: { lat: 1.3733, lon: 32.2903 },
      },
      {
        name: 'Senegal',
        countryCode: 'SN',
        continent: 'Africa',
        population: 17316449,
        coordinates: { lat: 14.4974, lon: -14.4524 },
      },
      {
        name: 'Côte d\'Ivoire',
        countryCode: 'CI',
        continent: 'Africa',
        population: 27948301,
        coordinates: { lat: 7.5400, lon: -5.5471 },
      },
      {
        name: 'Mozambique',
        countryCode: 'MZ',
        continent: 'Africa',
        population: 32969518,
        coordinates: { lat: -18.6657, lon: 35.5296 },
      },
      {
        name: 'Zimbabwe',
        countryCode: 'ZW',
        continent: 'Africa',
        population: 15993523,
        coordinates: { lat: -19.0154, lon: 29.1549 },
      },
    ],
  },
  {
    name: 'North America',
    region: 'Americas',
    countries: [
      {
        name: 'Mexico',
        countryCode: 'MX',
        continent: 'North America',
        population: 128932753,
        coordinates: { lat: 23.6345, lon: -102.5528 },
      },
    ],
  },
  {
    name: 'Central America',
    region: 'Americas',
    countries: [
      {
        name: 'Guatemala',
        countryCode: 'GT',
        continent: 'Central America',
        population: 17109746,
        coordinates: { lat: 15.7835, lon: -90.2308 },
      },
      {
        name: 'Costa Rica',
        countryCode: 'CR',
        continent: 'Central America',
        population: 5180829,
        coordinates: { lat: 9.7489, lon: -83.7534 },
      },
    ],
  },
  {
    name: 'South America',
    region: 'Americas',
    countries: [
      {
        name: 'Brazil',
        countryCode: 'BR',
        continent: 'South America',
        population: 215313498,
        coordinates: { lat: -14.2350, lon: -51.9253 },
      },
      {
        name: 'Colombia',
        countryCode: 'CO',
        continent: 'South America',
        population: 51874024,
        coordinates: { lat: 4.5709, lon: -74.2973 },
      },
      {
        name: 'Peru',
        countryCode: 'PE',
        continent: 'South America',
        population: 34352719,
        coordinates: { lat: -9.1900, lon: -75.0152 },
      },
      {
        name: 'Ecuador',
        countryCode: 'EC',
        continent: 'South America',
        population: 18190484,
        coordinates: { lat: -1.8312, lon: -78.1834 },
      },
      {
        name: 'Bolivia',
        countryCode: 'BO',
        continent: 'South America',
        population: 12224110,
        coordinates: { lat: -16.2902, lon: -63.5887 },
      },
      {
        name: 'Paraguay',
        countryCode: 'PY',
        continent: 'South America',
        population: 6708141,
        coordinates: { lat: -23.4425, lon: -58.4438 },
      },
      {
        name: 'Uruguay',
        countryCode: 'UY',
        continent: 'South America',
        population: 3459929,
        coordinates: { lat: -32.5228, lon: -55.7658 },
      },
      {
        name: 'Argentina',
        countryCode: 'AR',
        continent: 'South America',
        population: 46605697,
        coordinates: { lat: -38.4161, lon: -63.6167 },
      },
      {
        name: 'Chile',
        countryCode: 'CL',
        continent: 'South America',
        population: 19603733,
        coordinates: { lat: -35.6751, lon: -71.5430 },
      },
    ],
  },
];

/**
 * Utility function to get all countries from all continents
 */
export function getAllCountries(): Country[] {
  return CONTINENTS_WITH_COUNTRIES.flatMap((continent) => continent.countries);
}

/**
 * Utility function to get countries by continent name
 */
export function getCountriesByContinent(continentName: string): Country[] {
  const continent = CONTINENTS_WITH_COUNTRIES.find(
    (c) => c.name === continentName
  );
  return continent ? continent.countries : [];
}

/**
 * Utility function to get a country by name
 */
export function getCountryByName(countryName: string): Country | undefined {
  return getAllCountries().find((c) => c.name === countryName);
}
