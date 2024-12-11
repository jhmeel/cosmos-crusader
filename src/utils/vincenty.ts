export const calculateVincentyDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  const a = 6378137.0; // Semi-major axis of the Earth (meters)
  const f = 1 / 298.257223563; // Flattening
  const b = 6356752.314245; // Semi-minor axis

  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const L = toRadians(lng2 - lng1);

  const U1 = Math.atan((1 - f) * Math.tan(φ1));
  const U2 = Math.atan((1 - f) * Math.tan(φ2));

  const sinU1 = Math.sin(U1),
    cosU1 = Math.cos(U1);
  const sinU2 = Math.sin(U2),
    cosU2 = Math.cos(U2);

  let λ = L,
    λprev,
    iterLimit = 100;
  let sinλ, cosλ, sinσ, cosσ, σ, sinα, cos2α, cos2σm, C;

  do {
    sinλ = Math.sin(λ);
    cosλ = Math.cos(λ);
    sinσ = Math.sqrt(
      cosU2 * sinλ * (cosU2 * sinλ) +
        (cosU1 * sinU2 - sinU1 * cosU2 * cosλ) *
          (cosU1 * sinU2 - sinU1 * cosU2 * cosλ)
    );

    if (sinσ === 0) return 0; // Coincident points

    cosσ = sinU1 * sinU2 + cosU1 * cosU2 * cosλ;
    σ = Math.atan2(sinσ, cosσ);
    sinα = (cosU1 * cosU2 * sinλ) / sinσ;
    cos2α = 1 - sinα * sinα;

    cos2σm = cosσ - (2 * sinU1 * sinU2) / cos2α;
    if (isNaN(cos2σm)) cos2σm = 0; // Equatorial line

    C = (f / 16) * cos2α * (4 + f * (4 - 3 * cos2α));
    λprev = λ;
    λ =
      L +
      (1 - C) *
        f *
        sinα *
        (σ + C * sinσ * (cos2σm + C * cosσ * (-1 + 2 * cos2σm * cos2σm)));
  } while (Math.abs(λ - λprev) > 1e-12 && --iterLimit > 0);

  if (iterLimit === 0) return NaN; // Formula failed to converge

  const uSquared = (cos2α * (a * a - b * b)) / (b * b);
  const A =
    1 +
    (uSquared / 16384) *
      (4096 + uSquared * (-768 + uSquared * (320 - 175 * uSquared)));
  const B =
    (uSquared / 1024) *
    (256 + uSquared * (-128 + uSquared * (74 - 47 * uSquared)));
  const Δσ =
    B *
    sinσ *
    (cos2σm +
      (B / 4) *
        (cosσ * (-1 + 2 * cos2σm * cos2σm) -
          (B / 6) *
            cos2σm *
            (-3 + 4 * sinσ * sinσ) *
            (-3 + 4 * cos2σm * cos2σm)));

  return (b * A * (σ - Δσ)) / 1000; // Distance in kilometers
};
