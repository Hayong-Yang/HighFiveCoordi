export function calculateWindChill(temp, windSpeed) {
  const T = parseFloat(temp);
  const V = parseFloat(windSpeed);

  if (T > 10 || V <= 4.8) return T;

  const windChill =
    13.12 +
    0.6215 * T -
    11.37 * Math.pow(V, 0.16) +
    0.3965 * T * Math.pow(V, 0.16);
  return Math.round(windChill * 10) / 10;
}

const windChill = calculateWindChill(10, 10);
console.log(windChill);
