import type { LocalizedText, DoubleSidedSize, Polygon, SideDetails, Size, Locale } from "@dotpostcard/postcards"

export const localizedText = (obj: LocalizedText, preferOriginal: boolean = true): [text: string, locale: Locale] => obj.pickBest(Navigator.languages, preferOriginal)

export const imageDescription = (side: SideDetails): [text: string, locale: Locale] => {
  let description: string = ""
  let locale: string | undefined

  if (side.description) {
    const [desText, desLocale] = localizedText(side.description, false)
    description += desText
    locale = desLocale
  }
  if (side.transcription) {
    const [traText, traLocale] = localizedText(side.transcription, true)

    if (description.length > 0) {
      description += "\n"
    }
    description += traText
    locale ||= traLocale
  }

  return [description, locale]
}

export const dateString = (date: Date): string => date.toISOString().replace(/T.*$/, '')

export const cssSize = (size: Size): string => `width:${size.w.toFixed(1)}px;height:${size.h.toFixed(1)}px`

export const cssSizeWithMargins = (sizes: DoubleSidedSize, front: boolean): string => {
  const size = front ? sizes.front() : sizes.back()
  const marginX = (sizes.outer().w - size.w) / 2
  const marginY = (sizes.outer().h - size.h) / 2
  
  return `${cssSize(size)};margin:${marginY.toFixed(1)}px ${marginX.toFixed(1)}px`
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