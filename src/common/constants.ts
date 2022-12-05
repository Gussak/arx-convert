/** @see https://github.com/arx/ArxLibertatis/blob/1.2.1/src/graphics/GraphicsTypes.h#L88 */
export enum ArxPolygonFlags {
  None = 0,
  NoShadow = 1 << 0,
  DoubleSided = 1 << 1,
  Trans = 1 << 2,
  Water = 1 << 3,
  Glow = 1 << 4,
  Ignore = 1 << 5,
  Quad = 1 << 6,
  Tiled = 1 << 7, // unused
  Metal = 1 << 8,
  Hide = 1 << 9,
  Stone = 1 << 10,
  Wood = 1 << 11,
  Gravel = 1 << 12,
  Earth = 1 << 13,
  NoCollision = 1 << 14,
  Lava = 1 << 15,
  Climbable = 1 << 16,
  Falling = 1 << 17,
  NoPath = 1 << 18,
  NoDraw = 1 << 19,
  PrecisePath = 1 << 20,
  NoClimb = 1 << 21, // unused
  Angular = 1 << 22, // unused
  AngularIdx0 = 1 << 23, // unused
  AngularIdx1 = 1 << 24, // unused
  AngularIdx2 = 1 << 25, // unused
  AngularIdx3 = 1 << 26, // unused
  LateMip = 1 << 27,
}

/** @see https://github.com/arx/ArxLibertatis/blob/1.2.1/src/ai/Paths.h#L65 */
export enum ArxZoneFlags {
  None = 0,
  Ambiance = 1 << 1,
  Rgb = 1 << 2,
  FarClip = 1 << 3,
}

// for whatever reason the following coords create a polygon, which ends up in an incorrect cell
// when I finish averaging them and rounding them down in an attempt to find which cell they should go in
// probably some precision got lost when Theo Game Maker exported the FTS data
// and I've already spent numerous days trying to figure out where the error is originating from
// so I give up and just put the problematic coordinates into a table
// ------------
// when I just go with rounding down the averages, then there are a very small number of coordinates
// which need to be rounded up instead of rounded down:
// (these results are the closest I could come up with any of the algorithms without having a lookup table)
// level 0 -> 9 needs to be rounded up from the total of 45418 polygons
// level 1 -> 8 / 58963
// level 2 -> 2 / 73791
// level 3 -> 1 / 59442
// level 5 -> 16 / 68710
// level 6 -> 6 / 42111
// level 7 -> 4 / 76875
// level 11 -> 9 / 69815
// level 12 -> 24 / 34660
// level 14 -> 10 / 39387
// level 15 -> 2 / 44616
// level 16 -> 1 / 53367
// level 18 -> 2 / 39098
// level 21 -> 43 / 30594
// level 22 -> 15 / 61953
// level 23 -> 5 / 24519
// ------------
// no, the error is much larger, than Number.EPSILON, or Number.EPSILON * 10**5
// no, rounding the individual coordinates to 3 or more decimals doesn't solve the issue
// ------------
// The following (averages/100)%1 always need to be rounded up, no matter what coords make up the average
// 0.9999983723958294,
// 0.9999983723958366,
// 0.9999991861979147,
// 0.9999991861979183
// but the following 3 are sometimes need to be rounded up, sometimes down
// level 22 is the best, because it has both cases, where the same fraction needs to be rounded in both ways
// 0.9999934895833462,
// 0.9999967447916589,
// 0.9999967447916731,

export const COORDS_THAT_ROUND_UP: [number, number, number][] = [
  [2550, 2600, 2649.999755859375],
  [2649.999755859375, 2700, 2749.999755859375],
  [3949.999755859375, 4000, 4050],
  [4294.99951171875, 4299.99951171875, 4305],
  [4299.99951171875, 4299.99951171875, 4300],
  [4599.99951171875, 4599.99951171875, 4600],
  [4899.99951171875, 4900, 4900],
  [4995, 4999.99951171875, 5004.99951171875],
  [5599.9990234375, 5600, 5600],
  [5599.99951171875, 5600, 5600],
  [5690.2626953125, 5700, 5709.736328125],
  [5695.5126953125, 5700, 5704.486328125],
  [5795, 5799.99951171875, 5804.99951171875],
  [5799.99951171875, 5800, 5800],
  [5975, 6000, 6024.99951171875],
  [6050, 6124.99951171875, 6124.99951171875],
  [6057.666015625, 6100, 6142.3330078125],
  [6090.2626953125, 6100, 6109.736328125],
  [6174.99951171875, 6174.99951171875, 6250],
  [6199.99951171875, 6199.99951171875, 6200.00048828125],
  [6349.9990234375, 6400, 6450],
  [6439.99951171875, 6525, 6535],
  [6450, 6500, 6549.99951171875],
  [6450, 6499.99951171875, 6549.99951171875],
  [6549.9990234375, 6600.0009765625, 6649.9990234375],
  [6599.99951171875, 6599.99951171875, 6600.00048828125],
  [6749.9970703125, 6800.001953125, 6850],
  [6799.9990234375, 6800, 6800],
  [6899.99951171875, 6899.99951171875, 6900],
  [6999.99951171875, 6999.99951171875, 7000],
  [6999.99951171875, 7000, 7000],
  [7049.99951171875, 7125, 7125],
  [7175, 7175, 7249.99951171875],
  [7195.00048828125, 7199.99951171875, 7204.99951171875],
  [7280, 7290, 7329.9990234375],
  [7294.99951171875, 7299.99951171875, 7305.00048828125],
  [7349.99951171875, 7399.99951171875, 7450.00048828125],
  [7350.00048828125, 7399.99951171875, 7449.99951171875],
  [7399.9990234375, 7400, 7400],
  [7399.99951171875, 7399.99951171875, 7400.00048828125],
  [7499.99951171875, 7500, 7500],
  [7565, 7585, 7649.9990234375],
  [7583.3330078125, 7600, 7616.666015625],
  [7591.8662109375, 7601.7626953125, 7606.3701171875],
  [7599.9990234375, 7600, 7600],
  [7640.0009765625, 7729.9990234375, 7729.9990234375],
  [7650, 7700, 7749.9990234375],
  [7775, 7799.99951171875, 7825],
  [7799.9990234375, 7800, 7800.00048828125],
  [7799.99951171875, 7800, 7800],
  [7950, 8024.99951171875, 8025],
  [7999.99951171875, 8000, 8000],
  [7999.99951171875, 7999.99951171875, 8000],
  [8050, 8124.99951171875, 8125],
  [8099.9951171875, 8100.0009765625, 8100.0029296875],
  [8149.99951171875, 8200, 8250],
  [8149.99951171875, 8225, 8225],
  [8349.9990234375, 8400, 8449.9990234375],
  [8349.9990234375, 8400, 8450],
  [8450, 8500, 8549.9990234375],
  [8583.2490234375, 8600, 8616.75],
  [8649.9990234375, 8700, 8749.9990234375],
  [8750, 8800, 8849.9990234375],
  [8875, 8875, 8949.9990234375],
  [8909.9990234375, 9045, 9045],
  [8949.9990234375, 9025, 9025],
  [9099.9990234375, 9099.9990234375, 9100],
  [9197.515625, 9199.7958984375, 9202.6875],
  [9349.9990234375, 9400, 9449.9990234375],
  [9350, 9424.9990234375, 9425],
  [9399.9990234375, 9400, 9400],
  [9499.9990234375, 9500, 9500],
  [9549.9990234375, 9599.9990234375, 9650],
  [9650, 9699.9990234375, 9749.9990234375],
  [9699.9990234375, 9700, 9700],
  [9949.9990234375, 9999.9990234375, 10050],
  [9999.9990234375, 10000, 10000],
  [10049.9990234375, 10100, 10150],
  [10299.9990234375, 10300, 10300],
  [10399.9990234375, 10400, 10400],
  [10649.998046875, 10700.0029296875, 10749.998046875],
  [10649.9990234375, 10699.9990234375, 10750],
  [10849.9951171875, 10900.0087890625, 10949.9951171875],
  [11199.994140625, 11200.001953125, 11200.001953125],
  [11299.994140625, 11300.001953125, 11300.001953125],
  [11399.994140625, 11400.001953125, 11400.001953125],
  [11399.9990234375, 11400, 11400],
  [11499.994140625, 11500.001953125, 11500.001953125],
  [12049.998046875, 12125, 12125],
  [12183.3330078125, 12200, 12216.666015625],
  [12250, 12299.9990234375, 12350],
  [12899.9990234375, 12899.9990234375, 12900],
  [13199.9990234375, 13200, 13200],
  [13839.9990234375, 13925, 13935],
]

export const SUPPORTED_ARX_FORMATS = ['dlf', 'fts', 'llf', 'ftl', 'tea'] as const
export const SUPPORTED_DATA_FORMATS = ['json', 'yaml', 'yml'] as const
export const SUPPORTED_FORMATS = [...SUPPORTED_ARX_FORMATS, ...SUPPORTED_DATA_FORMATS] as const

export type SupportedArxFormat = typeof SUPPORTED_ARX_FORMATS[number]
export type SupportedDataFormat = typeof SUPPORTED_DATA_FORMATS[number]
export type SupportedFormat = typeof SUPPORTED_FORMATS[number]

export const FTL_VERSION = 0.83257
export const FTS_VERSION = 0.14100000262260437
export const DANAE_VERSION = 1.440000057220459

export const LITTLE_ENDIAN = true
export const BIG_ENDIAN = false

export const TRUNCATE_ZERO_BYTES = true
export const KEEP_ZERO_BYTES = false

// source: https://cs.stanford.edu/people/miles/iso8859.html
// source: https://mathiasbynens.be/notes/javascript-escapes

// prettier-ignore
export const CHARS = [
  '\0', '\x01', '\x02', '\x03', '\x04', '\x05', '\x06', '\x07', '\b', '\t', '\n', '\v', '\f', '\r', '\x0e', '\x0f',
  '\0x10', '\0x11', '\0x12', '\0x13', '\0x14', '\0x15', '\0x16', '\0x17', '\0x18', '\0x19', '\0x1a', '\0x1b', '\0x1c', '\0x1d', '\0x1e', '\0x1f',
  ' ', '!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+', ',', '-', '.', '/',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?',
  '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
  'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_',
  '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
  'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '{', '|', '}', '~', '\x7f',
  '\x80', '\x81', '\x82', '\x83', '\x84', '\x85', '\x86', '\x87', '\x88', '\x89', '\x8a', '\x8b', '\x8c', '\x8d', '\x8e', '\x8f',
  '\x90', '\x91', '\x92', '\x93', '\x94', '\x95', '\x96', '\x97', '\x98', '\x99', '\x9a', '\x9b', '\x9c', '\x9d', '\x9e', '\x9f',
  '\xa0', '¡', '¢', '£', '¤', '¥', '¦', '§', '¨', '©', 'ª', '«', '¬', '\xad', '®', '¯',
  '°', '±', '²', '³', '´', 'µ', '¶', '·', '¸', '¹', 'º', '»', '¼', '½', '¾', '¿',
  'À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Æ', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï',
  'Ð', 'Ñ', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', '×', 'Ø', 'Ù', 'Ú', 'Û', 'Ü', 'Ý', 'Þ', 'ß',
  'à', 'á', 'â', 'ã', 'ä', 'å', 'æ', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï',
  'ð', 'ñ', 'ò', 'ó', 'ô', 'õ', 'ö', '÷', 'ø', 'ù', 'ú', 'û', 'ü', 'ý', 'þ', 'ÿ'
]

export const CODES: Record<string, number> = {}
CHARS.forEach((value, idx) => {
  CODES[value] = idx
})

export const BYTE_OF_AN_UNKNOWN_CHAR = CODES[' ']

export const CHAR_OF_AN_UNKNOWN_BYTE = ' '

export const MAP_WIDTH_IN_CELLS = 160
export const MAP_DEPTH_IN_CELLS = 160
