import type { Polygon, SideDetails, Locale, Size } from "@dotpostcard/postcards"

export const isPortrait = (size: Size, isFront: boolean):boolean => {
  const [a, b] = size.aspectRatio(isFront)
  return b > a
}

export const dateString = (date: Date): string => date.toISOString().replace(/T.*$/, '')

const percentRe = /^(\d+)%$/

export const parsePercent = (pc: string): number | undefined => {
  const m = pc.match(percentRe)
  if (!m) {
    return undefined
  }

  return parseFloat(m[1])
}

export const svgPoints = (poly: Polygon[]): string => {
  let points: string[] = []
  for (let point of poly) {
    points.push(`${point[0]},${point[1]}`)
  }
  return points.join(' ')
}