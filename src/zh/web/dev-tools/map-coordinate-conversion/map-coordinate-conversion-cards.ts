import { getMapCoordinateIndexCopy, getMapCoordinateRouteParams, type LangCode } from './[source]-[target].paths'

export interface MapCoordinateCardItem {
  title: string
  desc: string
  href: string
}

export function getMapCoordinateCards(lang: LangCode) {
  return [
    {
      children: getMapCoordinateRouteParams(lang).map(item => ({
        title: item.h1,
        desc: item.description,
        href: `/web/dev-tools/map-coordinate-conversion/${item.source}-${item.target}`,
      })),
    },
  ]
}

export function getMapCoordinatePageCopy(lang: LangCode) {
  return getMapCoordinateIndexCopy(lang)
}

export const mapCoordinateCards = getMapCoordinateCards('zh')
