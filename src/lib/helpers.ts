import type { Polygon, SideDetails, Size } from "postcards"
import { add_attribute } from "svelte/internal"

export const imageDescription = (side: SideDetails): { description: string, locale: string | undefined } => {
  let description: string = ""
  let locale: string | undefined

  if (side.description) {
    const [desText, _] = side.description.pickBest(Navigator.languages)
    description += desText
  }
  if (side.transcription) {
    const [traText, traLocale] = side.transcription.pickBest(Navigator.languages, true)

    if (description.length > 0) {
      description += ': '
    }
    description += traText
    locale = traLocale
  }

  return { description, locale }
}

export const cssSize = (size: Size, outer?: Size): string => {
  let css = `width:${size.w}px;height:${size.h}px`
  if (outer) {
    const marginX = (outer.w - size.w) / 2
    const marginY = (outer.h - size.h) / 2
    css = `${css};margin:${marginY}px ${marginX}px`
  }

  return css
}

const percentRe = /^(\d+)%$/

export const parsePercent = (pc: string): number | undefined => {
  const m = pc.match(percentRe)
  if (!m) {
    return undefined
  }

  return parseFloat(m[1])
}

export const svgPoints = (poly: Polygon[], abs: Size): string => {
  let points: string[] = []
  for (let point of poly) {
    points.push(abs.w*point[0] + ',' + abs.h*point[1])
  }
  return points.join(' ')
}