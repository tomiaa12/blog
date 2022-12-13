/* 生成随机值 */

/**
 * @returns 随机布尔值
 */
export const randomBoolean = (): boolean => Math.random() >= 0.5

/**
 *
 * @param min 最小值
 * @param max 最大值
 * @returns 随机范围内浮点数
 */
export const randomFloat = (min: number, max: number): number =>
  Math.random() * (max - min) + min

/**
 * @returns 随机十六进制颜色
 */
export const randomColor = (): string =>
  `#${(~~(Math.random() * (1 << 24))).toString(16)}`

/**
 *
 * @param min 最小值
 * @param max 最大值
 * @returns 随机范围内整数
 */
export const randomInteger = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min

/**
 * @returns 生成随机 IP
 */
export const randomIp = (): string =>
  Array(4)
    .fill(0)
    .map((_, i) => Math.floor(Math.random() * 255) + (i === 0 ? 1 : 0))
    .join(".")

/**
 * @returns 生成 UUID
 */
export const uuid = (a?: any) =>
  a
    ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
    : (([1e7] as any) + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid)
