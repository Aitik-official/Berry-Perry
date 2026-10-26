/**
 * Pure SVG Code 128 (Subset B) Barcode Generator.
 * Zero external dependencies. Generates crisp, high-density SVG markup
 * compatible with any screen, standard print, or thermal roll printer (TSC, Zebra, TVS, Dymo).
 */

// Code 128 Patterns (B subset widths: black bar, white space, etc.)
// Each pattern is a binary string or widths array of 11 modules (stop pattern has 13 modules)
const CODE128_PATTERNS: Record<number, string> = {
  0: '11011001100', 1: '11001101100', 2: '11001100110', 3: '10010011000',
  4: '10010001100', 5: '10001001100', 6: '10011001000', 7: '10011000100',
  8: '10001100100', 9: '11001001000', 10: '11001000100', 11: '11000100100',
  12: '10110011100', 13: '10011011100', 14: '10011001110', 15: '10111001100',
  16: '10011101100', 17: '10011100110', 18: '11001110010', 19: '11001011100',
  20: '11001001110', 21: '11011100100', 22: '11001110100', 23: '11101101110',
  24: '11101001100', 25: '11100101100', 26: '11100100110', 27: '11101100100',
  28: '11100110100', 29: '11100110010', 30: '11011011000', 31: '11011000110',
  32: '11000110110', 33: '10100011000', 34: '10001011000', 35: '10001000110',
  36: '10110001000', 37: '10001101000', 38: '10001100010', 39: '11010001000',
  40: '11000101000', 41: '11000100010', 42: '10110111000', 43: '10110001110',
  44: '10001101110', 45: '10111011000', 46: '10111000110', 47: '10001110110',
  48: '11101110110', 49: '11010001110', 50: '11000101110', 51: '11011101000',
  52: '11011100010', 53: '11011101110', 54: '11101011000', 55: '11101000110',
  56: '11100010110', 57: '11101101000', 58: '11101100010', 59: '11100011010',
  60: '11101111010', 61: '11001000010', 62: '11110001010', 63: '10100110000',
  64: '10100001100', 65: '10010110000', 66: '10010000110', 67: '10000101100',
  68: '10000100110', 69: '10110010000', 70: '10110000100', 71: '10011010000',
  72: '10011000010', 73: '10000110100', 74: '10000110010', 75: '11000010010',
  76: '11001010000', 77: '11110111010', 78: '11000010100', 79: '10001111010',
  80: '10100111100', 81: '10010111100', 82: '10010011110', 83: '10111100100',
  84: '10011110100', 85: '10011110010', 86: '11110100100', 87: '11110010100',
  88: '11110010010', 89: '11011011110', 90: '11011110110', 91: '11110110110',
  92: '10101111000', 93: '10100011110', 94: '10001011110', 95: '10111101000',
  96: '10111100010', 97: '11110101000', 98: '11110100010', 99: '10111011110',
  100: '10111101110', 101: '11101011110', 102: '11110101110', 103: '11010000100', // START B
  104: '11010010000', // START A
  105: '11010011100', // START C
  106: '1100011101011', // STOP
}

const START_B = 104
const STOP = 106

/**
 * Generate binary bar sequence (1s and 0s) for any ASCII string using Code 128B
 */
export function encodeCode128B(text: string): string {
  if (!text) return ''

  // Start with Start Code B
  const codes: number[] = [START_B]
  let checkSum = START_B

  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i)
    // Code 128B maps ASCII 32..126 to values 0..94
    const value = charCode - 32
    if (value >= 0 && value <= 95) {
      codes.push(value)
      checkSum += value * (i + 1)
    }
  }

  const checkValue = checkSum % 103
  codes.push(checkValue)
  codes.push(STOP)

  let binaryPattern = ''
  for (const c of codes) {
    binaryPattern += CODE128_PATTERNS[c] || ''
  }

  return binaryPattern
}

/**
 * Generates an SVG string representation of a Code 128 barcode
 */
export function generateBarcodeSvg({
  text,
  height = 50,
  barWidth = 2,
  includeText = true,
}: {
  text: string
  height?: number
  barWidth?: number
  includeText?: boolean
}): string {
  const binary = encodeCode128B(text)
  if (!binary) return ''

  const quietZone = 10 * barWidth
  const totalWidth = binary.length * barWidth + quietZone * 2
  const barHeight = includeText ? height - 14 : height

  let rects = ''
  let currentX = quietZone

  for (let i = 0; i < binary.length; i++) {
    if (binary[i] === '1') {
      rects += `<rect x="${currentX}" y="0" width="${barWidth}" height="${barHeight}" fill="#000000" />`
    }
    currentX += barWidth
  }

  const textElement = includeText
    ? `<text x="${totalWidth / 2}" y="${height}" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle" fill="#000000">${text}</text>`
    : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${height}" width="${totalWidth}" height="${height}">
    <rect width="100%" height="100%" fill="#ffffff"/>
    ${rects}
    ${textElement}
  </svg>`
}

/**
 * Generate a unique 12-digit numeric Internal Warehouse Barcode
 * Prefix '29' (Internal Retail Unit) + 8-digit timestamp + 2-digit random
 */
export function generateWarehouseBarcode(prefix: string = '29'): string {
  const timeSlice = Date.now().toString().slice(-8)
  const rand = Math.floor(10 + Math.random() * 90).toString()
  return `${prefix}${timeSlice}${rand}`
}
