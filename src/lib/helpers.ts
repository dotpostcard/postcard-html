import type { LocalizedText, Polygon, SideDetails, Locale } from "@dotpostcard/postcards"

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