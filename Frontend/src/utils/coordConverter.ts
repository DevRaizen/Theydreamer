
/**
 * Convert DMS parts to Decimal Degrees.
 * @param {number} deg
 * @param {number} min
 * @param {number} sec
 * @param {"N"|"S"|"E"|"W"} dir
 * @returns {number}
 */
export function dmsToDD(deg: string, min: string, sec: string, dir: string) {
  let dd = Number(deg) + Number(min) / 60 + Number(sec) / 3600;
  if (dir === "S" || dir === "W") dd = -dd;
  return parseFloat(dd.toFixed(8));
}

/**
 * Convert Decimal Degrees to DMS string.
 * @param {number} dd
 * @param {"lat"|"lng"} type
 * @returns {string}  e.g. "14°35'58.20\"N"
 */
export function ddToDMS(dd: number, type: string) {
  const dir =
    type === "lat"
      ? dd >= 0 ? "N" : "S"
      : dd >= 0 ? "E" : "W";
  const abs = Math.abs(dd);
  const deg = Math.floor(abs);
  const minFull = (abs - deg) * 60;
  const min = Math.floor(minFull);
  const sec = ((minFull - min) * 60).toFixed(2);
  return `${deg}°${min}'${sec}"${dir}`;
}

/**
 * Try to parse a coordinate string into a DD number.
 * Accepts: "14.5995", "14°35'58.2\"N", "14 35 58.2 N"
 * @param {string|number} value
 * @returns {{ dd: number, wasDMS: boolean }}
 */
export function parseCoord(value: any) {
  if (typeof value === "number") return { dd: value, wasDMS: false };

  const str = String(value).trim();

  // Plain decimal
  const plain = parseFloat(str);
  if (!isNaN(plain) && /^-?\d+(\.\d+)?$/.test(str)) {
    return { dd: plain, wasDMS: false };
  }

  // DMS pattern
  const dms = str.match(
    /(\d+(?:\.\d+)?)\s*[°\s]\s*(\d+(?:\.\d+)?)\s*['\s]\s*(\d+(?:\.\d+)?)\s*[""″\s]?\s*([NSEWnsew])/
  );
  if (dms) {
    const dd = dmsToDD(dms[1], dms[2], dms[3], dms[4].toUpperCase());
    return { dd, wasDMS: true };
  }

  throw new Error(`Cannot parse coordinate: "${value}"`);
}

/**
 * Validate that a DD value is within range.
 * @param {number} dd
 * @param {"lat"|"lng"} type
 */
export function validateDD(dd: number, type: "lat" | "lng") {
  if (type === "lat" && (dd < -90 || dd > 90))
    throw new Error("Latitude must be between -90 and 90");
  if (type === "lng" && (dd < -180 || dd > 180))
    throw new Error("Longitude must be between -180 and 180");
}
