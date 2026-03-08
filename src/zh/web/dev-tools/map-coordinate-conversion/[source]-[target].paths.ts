import type { LangCode } from '../../../../types/i18n'
export type { LangCode } from '../../../../types/i18n'

export type CoordinateSystem =
  | 'mercator'
  | 'wgs84'
  | 'cgcs2000'
  | 'gcj02'
  | 'baiduMercator'
  | 'bd09'

export type TransformKey =
  | 'mercator2WSG84'
  | 'WSG842Mercator'
  | 'mercator2CGCS2000'
  | 'WSG842CGCS2000'
  | 'CGCS20002Mercator'
  | 'CGCS20002WSG84'
  | 'GCJ022WSG84'
  | 'WSG842GCJ02'
  | 'mercator2GCJ02'
  | 'GCJ022Mercator'
  | 'mercator2BaiduMercator'
  | 'baiduMercator2Mercator'
  | 'WSG842BaiduMercator'
  | 'baiduMercator2WSG84'
  | 'WSG842BD09'
  | 'BD092WSG84'
  | 'BD092Mercator'
  | 'mercator2BD09'
  | 'baiduMercator2BD09'
  | 'BD092BaiduMercator'
  | 'BD092GCJ02'
  | 'GCJ022BD09'
  | 'BD092CGCS2000'
  | 'CGCS20002BD09'
  | 'GCJ022CGC2000'
  | 'CGCS20002GCJ02'
  | 'baiduMercator2CGC2000'
  | 'CGCS20002BaiduMercator'

export interface MapCoordinateRouteParams {
  source: CoordinateSystem
  target: CoordinateSystem
  transform: TransformKey
  sourceLabel: string
  targetLabel: string
  title: string
  description: string
  keywords: string
  h1: string
  moreTools: string
}

interface CoordinateMeta {
  label: string
  short: string
  aliases: string[]
}

interface IndexCopy {
  title: string
  description: string
}

interface UiCopy {
  inputLabel: string
  outputLabel: string
}

interface SeoTemplate {
  title: string
  description: string
  keywords: string
}

type ParamsItem = { params: MapCoordinateRouteParams }

const coordinateCodes: Record<CoordinateSystem, string> = {
  mercator: 'EPSG:3857',
  wgs84: 'WGS84',
  cgcs2000: 'CGCS2000',
  gcj02: 'GCJ02',
  baiduMercator: 'baiduMercator',
  bd09: 'BD09',
}

const routeDefs: Pick<MapCoordinateRouteParams, 'source' | 'target' | 'transform'>[] = [
  { source: 'mercator', target: 'wgs84', transform: 'mercator2WSG84' },
  { source: 'wgs84', target: 'mercator', transform: 'WSG842Mercator' },
  { source: 'mercator', target: 'cgcs2000', transform: 'mercator2CGCS2000' },
  { source: 'wgs84', target: 'cgcs2000', transform: 'WSG842CGCS2000' },
  { source: 'cgcs2000', target: 'mercator', transform: 'CGCS20002Mercator' },
  { source: 'cgcs2000', target: 'wgs84', transform: 'CGCS20002WSG84' },
  { source: 'gcj02', target: 'wgs84', transform: 'GCJ022WSG84' },
  { source: 'wgs84', target: 'gcj02', transform: 'WSG842GCJ02' },
  { source: 'mercator', target: 'gcj02', transform: 'mercator2GCJ02' },
  { source: 'gcj02', target: 'mercator', transform: 'GCJ022Mercator' },
  { source: 'mercator', target: 'baiduMercator', transform: 'mercator2BaiduMercator' },
  { source: 'baiduMercator', target: 'mercator', transform: 'baiduMercator2Mercator' },
  { source: 'wgs84', target: 'baiduMercator', transform: 'WSG842BaiduMercator' },
  { source: 'baiduMercator', target: 'wgs84', transform: 'baiduMercator2WSG84' },
  { source: 'wgs84', target: 'bd09', transform: 'WSG842BD09' },
  { source: 'bd09', target: 'wgs84', transform: 'BD092WSG84' },
  { source: 'bd09', target: 'mercator', transform: 'BD092Mercator' },
  { source: 'mercator', target: 'bd09', transform: 'mercator2BD09' },
  { source: 'baiduMercator', target: 'bd09', transform: 'baiduMercator2BD09' },
  { source: 'bd09', target: 'baiduMercator', transform: 'BD092BaiduMercator' },
  { source: 'bd09', target: 'gcj02', transform: 'BD092GCJ02' },
  { source: 'gcj02', target: 'bd09', transform: 'GCJ022BD09' },
  { source: 'bd09', target: 'cgcs2000', transform: 'BD092CGCS2000' },
  { source: 'cgcs2000', target: 'bd09', transform: 'CGCS20002BD09' },
  { source: 'gcj02', target: 'cgcs2000', transform: 'GCJ022CGC2000' },
  { source: 'cgcs2000', target: 'gcj02', transform: 'CGCS20002GCJ02' },
  { source: 'baiduMercator', target: 'cgcs2000', transform: 'baiduMercator2CGC2000' },
  { source: 'cgcs2000', target: 'baiduMercator', transform: 'CGCS20002BaiduMercator' },
]

const allCoordinateCopy: Record<LangCode, Record<CoordinateSystem, CoordinateMeta>> = {
  zh: {
    mercator: { label: '墨卡托坐标（EPSG:3857）', short: '墨卡托坐标', aliases: ['墨卡托坐标', 'EPSG:3857', 'Web Mercator'] },
    wgs84: { label: '地球坐标（EPSG:4326）', short: '地球坐标', aliases: ['地球坐标', 'WGS84', 'EPSG:4326'] },
    cgcs2000: { label: '天地图坐标（EPSG:4490）', short: '天地图坐标', aliases: ['天地图坐标', 'CGCS2000', 'EPSG:4490'] },
    gcj02: { label: '火星坐标（GCJ02）', short: '火星坐标', aliases: ['火星坐标', 'GCJ02'] },
    baiduMercator: { label: '百度墨卡托（baiduMercator）', short: '百度墨卡托', aliases: ['百度墨卡托', 'baiduMercator'] },
    bd09: { label: '百度坐标（BD:09）', short: '百度坐标', aliases: ['百度坐标', 'BD09', 'BD:09'] },
  },
  'zh-TW': {
    mercator: { label: '墨卡托座標（EPSG:3857）', short: '墨卡托座標', aliases: ['墨卡托座標', 'EPSG:3857', 'Web Mercator'] },
    wgs84: { label: '地球座標（EPSG:4326）', short: '地球座標', aliases: ['地球座標', 'WGS84', 'EPSG:4326'] },
    cgcs2000: { label: '天地圖座標（EPSG:4490）', short: '天地圖座標', aliases: ['天地圖座標', 'CGCS2000', 'EPSG:4490'] },
    gcj02: { label: '火星座標（GCJ02）', short: '火星座標', aliases: ['火星座標', 'GCJ02'] },
    baiduMercator: { label: '百度墨卡托（baiduMercator）', short: '百度墨卡托', aliases: ['百度墨卡托', 'baiduMercator'] },
    bd09: { label: '百度座標（BD:09）', short: '百度座標', aliases: ['百度座標', 'BD09', 'BD:09'] },
  },
  en: {
    mercator: { label: 'Web Mercator (EPSG:3857)', short: 'Web Mercator', aliases: ['Web Mercator', 'EPSG:3857'] },
    wgs84: { label: 'WGS84 Coordinates (EPSG:4326)', short: 'WGS84 Coordinates', aliases: ['WGS84', 'EPSG:4326', 'WGS84 Coordinates'] },
    cgcs2000: { label: 'CGCS2000 Coordinates (EPSG:4490)', short: 'CGCS2000 Coordinates', aliases: ['CGCS2000', 'EPSG:4490'] },
    gcj02: { label: 'GCJ02 Coordinates', short: 'GCJ02 Coordinates', aliases: ['GCJ02', 'Mars Coordinates'] },
    baiduMercator: { label: 'Baidu Mercator', short: 'Baidu Mercator', aliases: ['Baidu Mercator', 'baiduMercator'] },
    bd09: { label: 'BD09 Coordinates', short: 'BD09 Coordinates', aliases: ['BD09', 'Baidu Coordinates'] },
  },
  ar: {
    mercator: { label: 'إحداثيات ميركاتور (EPSG:3857)', short: 'إحداثيات ميركاتور', aliases: ['ميركاتور', 'EPSG:3857'] },
    wgs84: { label: 'إحداثيات WGS84 (EPSG:4326)', short: 'إحداثيات WGS84', aliases: ['WGS84', 'EPSG:4326'] },
    cgcs2000: { label: 'إحداثيات CGCS2000 (EPSG:4490)', short: 'إحداثيات CGCS2000', aliases: ['CGCS2000', 'EPSG:4490'] },
    gcj02: { label: 'إحداثيات GCJ02', short: 'إحداثيات GCJ02', aliases: ['GCJ02', 'إحداثيات المريخ'] },
    baiduMercator: { label: 'بايدو ميركاتور', short: 'بايدو ميركاتور', aliases: ['بايدو ميركاتور', 'baiduMercator'] },
    bd09: { label: 'إحداثيات BD09', short: 'إحداثيات BD09', aliases: ['BD09', 'إحداثيات بايدو'] },
  },
  de: {
    mercator: { label: 'Mercator-Koordinaten (EPSG:3857)', short: 'Mercator-Koordinaten', aliases: ['Mercator', 'EPSG:3857'] },
    wgs84: { label: 'WGS84-Koordinaten (EPSG:4326)', short: 'WGS84-Koordinaten', aliases: ['WGS84', 'EPSG:4326'] },
    cgcs2000: { label: 'CGCS2000-Koordinaten (EPSG:4490)', short: 'CGCS2000-Koordinaten', aliases: ['CGCS2000', 'EPSG:4490'] },
    gcj02: { label: 'GCJ02-Koordinaten', short: 'GCJ02-Koordinaten', aliases: ['GCJ02', 'Mars-Koordinaten'] },
    baiduMercator: { label: 'Baidu Mercator', short: 'Baidu Mercator', aliases: ['Baidu Mercator', 'baiduMercator'] },
    bd09: { label: 'BD09-Koordinaten', short: 'BD09-Koordinaten', aliases: ['BD09', 'Baidu-Koordinaten'] },
  },
  es: {
    mercator: { label: 'Coordenadas Mercator (EPSG:3857)', short: 'Coordenadas Mercator', aliases: ['Mercator', 'EPSG:3857'] },
    wgs84: { label: 'Coordenadas WGS84 (EPSG:4326)', short: 'Coordenadas WGS84', aliases: ['WGS84', 'EPSG:4326'] },
    cgcs2000: { label: 'Coordenadas CGCS2000 (EPSG:4490)', short: 'Coordenadas CGCS2000', aliases: ['CGCS2000', 'EPSG:4490'] },
    gcj02: { label: 'Coordenadas GCJ02', short: 'Coordenadas GCJ02', aliases: ['GCJ02', 'coordenadas Mars'] },
    baiduMercator: { label: 'Baidu Mercator', short: 'Baidu Mercator', aliases: ['Baidu Mercator', 'baiduMercator'] },
    bd09: { label: 'Coordenadas BD09', short: 'Coordenadas BD09', aliases: ['BD09', 'coordenadas Baidu'] },
  },
  fr: {
    mercator: { label: 'Coordonnees Mercator (EPSG:3857)', short: 'Coordonnees Mercator', aliases: ['Mercator', 'EPSG:3857'] },
    wgs84: { label: 'Coordonnees WGS84 (EPSG:4326)', short: 'Coordonnees WGS84', aliases: ['WGS84', 'EPSG:4326'] },
    cgcs2000: { label: 'Coordonnees CGCS2000 (EPSG:4490)', short: 'Coordonnees CGCS2000', aliases: ['CGCS2000', 'EPSG:4490'] },
    gcj02: { label: 'Coordonnees GCJ02', short: 'Coordonnees GCJ02', aliases: ['GCJ02', 'coordonnees Mars'] },
    baiduMercator: { label: 'Baidu Mercator', short: 'Baidu Mercator', aliases: ['Baidu Mercator', 'baiduMercator'] },
    bd09: { label: 'Coordonnees BD09', short: 'Coordonnees BD09', aliases: ['BD09', 'coordonnees Baidu'] },
  },
  hi: {
    mercator: { label: 'मर्केटर निर्देशांक (EPSG:3857)', short: 'मर्केटर निर्देशांक', aliases: ['Mercator', 'EPSG:3857'] },
    wgs84: { label: 'WGS84 निर्देशांक (EPSG:4326)', short: 'WGS84 निर्देशांक', aliases: ['WGS84', 'EPSG:4326'] },
    cgcs2000: { label: 'CGCS2000 निर्देशांक (EPSG:4490)', short: 'CGCS2000 निर्देशांक', aliases: ['CGCS2000', 'EPSG:4490'] },
    gcj02: { label: 'GCJ02 निर्देशांक', short: 'GCJ02 निर्देशांक', aliases: ['GCJ02', 'Mars coordinates'] },
    baiduMercator: { label: 'Baidu Mercator', short: 'Baidu Mercator', aliases: ['Baidu Mercator', 'baiduMercator'] },
    bd09: { label: 'BD09 निर्देशांक', short: 'BD09 निर्देशांक', aliases: ['BD09', 'Baidu coordinates'] },
  },
  id: {
    mercator: { label: 'Koordinat Mercator (EPSG:3857)', short: 'Koordinat Mercator', aliases: ['Mercator', 'EPSG:3857'] },
    wgs84: { label: 'Koordinat WGS84 (EPSG:4326)', short: 'Koordinat WGS84', aliases: ['WGS84', 'EPSG:4326'] },
    cgcs2000: { label: 'Koordinat CGCS2000 (EPSG:4490)', short: 'Koordinat CGCS2000', aliases: ['CGCS2000', 'EPSG:4490'] },
    gcj02: { label: 'Koordinat GCJ02', short: 'Koordinat GCJ02', aliases: ['GCJ02', 'koordinat Mars'] },
    baiduMercator: { label: 'Baidu Mercator', short: 'Baidu Mercator', aliases: ['Baidu Mercator', 'baiduMercator'] },
    bd09: { label: 'Koordinat BD09', short: 'Koordinat BD09', aliases: ['BD09', 'koordinat Baidu'] },
  },
  it: {
    mercator: { label: 'Coordinate Mercator (EPSG:3857)', short: 'Coordinate Mercator', aliases: ['Mercator', 'EPSG:3857'] },
    wgs84: { label: 'Coordinate WGS84 (EPSG:4326)', short: 'Coordinate WGS84', aliases: ['WGS84', 'EPSG:4326'] },
    cgcs2000: { label: 'Coordinate CGCS2000 (EPSG:4490)', short: 'Coordinate CGCS2000', aliases: ['CGCS2000', 'EPSG:4490'] },
    gcj02: { label: 'Coordinate GCJ02', short: 'Coordinate GCJ02', aliases: ['GCJ02', 'coordinate Mars'] },
    baiduMercator: { label: 'Baidu Mercator', short: 'Baidu Mercator', aliases: ['Baidu Mercator', 'baiduMercator'] },
    bd09: { label: 'Coordinate BD09', short: 'Coordinate BD09', aliases: ['BD09', 'coordinate Baidu'] },
  },
  ja: {
    mercator: { label: 'メルカトル座標 (EPSG:3857)', short: 'メルカトル座標', aliases: ['メルカトル座標', 'EPSG:3857'] },
    wgs84: { label: 'WGS84 座標 (EPSG:4326)', short: 'WGS84 座標', aliases: ['WGS84', 'EPSG:4326'] },
    cgcs2000: { label: 'CGCS2000 座標 (EPSG:4490)', short: 'CGCS2000 座標', aliases: ['CGCS2000', 'EPSG:4490'] },
    gcj02: { label: 'GCJ02 座標', short: 'GCJ02 座標', aliases: ['GCJ02', '火星座標'] },
    baiduMercator: { label: '百度メルカトル', short: '百度メルカトル', aliases: ['百度メルカトル', 'baiduMercator'] },
    bd09: { label: 'BD09 座標', short: 'BD09 座標', aliases: ['BD09', '百度座標'] },
  },
  ko: {
    mercator: { label: '메르카토르 좌표 (EPSG:3857)', short: '메르카토르 좌표', aliases: ['메르카토르', 'EPSG:3857'] },
    wgs84: { label: 'WGS84 좌표 (EPSG:4326)', short: 'WGS84 좌표', aliases: ['WGS84', 'EPSG:4326'] },
    cgcs2000: { label: 'CGCS2000 좌표 (EPSG:4490)', short: 'CGCS2000 좌표', aliases: ['CGCS2000', 'EPSG:4490'] },
    gcj02: { label: 'GCJ02 좌표', short: 'GCJ02 좌표', aliases: ['GCJ02', '화성 좌표'] },
    baiduMercator: { label: '바이두 메르카토르', short: '바이두 메르카토르', aliases: ['바이두 메르카토르', 'baiduMercator'] },
    bd09: { label: 'BD09 좌표', short: 'BD09 좌표', aliases: ['BD09', '바이두 좌표'] },
  },
  nl: {
    mercator: { label: 'Mercator-coordinaten (EPSG:3857)', short: 'Mercator-coordinaten', aliases: ['Mercator', 'EPSG:3857'] },
    wgs84: { label: 'WGS84-coordinaten (EPSG:4326)', short: 'WGS84-coordinaten', aliases: ['WGS84', 'EPSG:4326'] },
    cgcs2000: { label: 'CGCS2000-coordinaten (EPSG:4490)', short: 'CGCS2000-coordinaten', aliases: ['CGCS2000', 'EPSG:4490'] },
    gcj02: { label: 'GCJ02-coordinaten', short: 'GCJ02-coordinaten', aliases: ['GCJ02', 'Mars-coordinaten'] },
    baiduMercator: { label: 'Baidu Mercator', short: 'Baidu Mercator', aliases: ['Baidu Mercator', 'baiduMercator'] },
    bd09: { label: 'BD09-coordinaten', short: 'BD09-coordinaten', aliases: ['BD09', 'Baidu-coordinaten'] },
  },
  pl: {
    mercator: { label: 'Wspolrzedne Mercatora (EPSG:3857)', short: 'Wspolrzedne Mercatora', aliases: ['Mercator', 'EPSG:3857'] },
    wgs84: { label: 'Wspolrzedne WGS84 (EPSG:4326)', short: 'Wspolrzedne WGS84', aliases: ['WGS84', 'EPSG:4326'] },
    cgcs2000: { label: 'Wspolrzedne CGCS2000 (EPSG:4490)', short: 'Wspolrzedne CGCS2000', aliases: ['CGCS2000', 'EPSG:4490'] },
    gcj02: { label: 'Wspolrzedne GCJ02', short: 'Wspolrzedne GCJ02', aliases: ['GCJ02', 'wspolrzedne Mars'] },
    baiduMercator: { label: 'Baidu Mercator', short: 'Baidu Mercator', aliases: ['Baidu Mercator', 'baiduMercator'] },
    bd09: { label: 'Wspolrzedne BD09', short: 'Wspolrzedne BD09', aliases: ['BD09', 'wspolrzedne Baidu'] },
  },
  pt: {
    mercator: { label: 'Coordenadas Mercator (EPSG:3857)', short: 'Coordenadas Mercator', aliases: ['Mercator', 'EPSG:3857'] },
    wgs84: { label: 'Coordenadas WGS84 (EPSG:4326)', short: 'Coordenadas WGS84', aliases: ['WGS84', 'EPSG:4326'] },
    cgcs2000: { label: 'Coordenadas CGCS2000 (EPSG:4490)', short: 'Coordenadas CGCS2000', aliases: ['CGCS2000', 'EPSG:4490'] },
    gcj02: { label: 'Coordenadas GCJ02', short: 'Coordenadas GCJ02', aliases: ['GCJ02', 'coordenadas Mars'] },
    baiduMercator: { label: 'Baidu Mercator', short: 'Baidu Mercator', aliases: ['Baidu Mercator', 'baiduMercator'] },
    bd09: { label: 'Coordenadas BD09', short: 'Coordenadas BD09', aliases: ['BD09', 'coordenadas Baidu'] },
  },
  ru: {
    mercator: { label: 'Координаты Меркатора (EPSG:3857)', short: 'Координаты Меркатора', aliases: ['Меркатор', 'EPSG:3857'] },
    wgs84: { label: 'Координаты WGS84 (EPSG:4326)', short: 'Координаты WGS84', aliases: ['WGS84', 'EPSG:4326'] },
    cgcs2000: { label: 'Координаты CGCS2000 (EPSG:4490)', short: 'Координаты CGCS2000', aliases: ['CGCS2000', 'EPSG:4490'] },
    gcj02: { label: 'Координаты GCJ02', short: 'Координаты GCJ02', aliases: ['GCJ02', 'марсианские координаты'] },
    baiduMercator: { label: 'Baidu Mercator', short: 'Baidu Mercator', aliases: ['Baidu Mercator', 'baiduMercator'] },
    bd09: { label: 'Координаты BD09', short: 'Координаты BD09', aliases: ['BD09', 'координаты Baidu'] },
  },
  sv: {
    mercator: { label: 'Mercator-koordinater (EPSG:3857)', short: 'Mercator-koordinater', aliases: ['Mercator', 'EPSG:3857'] },
    wgs84: { label: 'WGS84-koordinater (EPSG:4326)', short: 'WGS84-koordinater', aliases: ['WGS84', 'EPSG:4326'] },
    cgcs2000: { label: 'CGCS2000-koordinater (EPSG:4490)', short: 'CGCS2000-koordinater', aliases: ['CGCS2000', 'EPSG:4490'] },
    gcj02: { label: 'GCJ02-koordinater', short: 'GCJ02-koordinater', aliases: ['GCJ02', 'Mars-koordinater'] },
    baiduMercator: { label: 'Baidu Mercator', short: 'Baidu Mercator', aliases: ['Baidu Mercator', 'baiduMercator'] },
    bd09: { label: 'BD09-koordinater', short: 'BD09-koordinater', aliases: ['BD09', 'Baidu-koordinater'] },
  },
  th: {
    mercator: { label: 'พิกัดเมอร์เคเตอร์ (EPSG:3857)', short: 'พิกัดเมอร์เคเตอร์', aliases: ['Mercator', 'EPSG:3857'] },
    wgs84: { label: 'พิกัด WGS84 (EPSG:4326)', short: 'พิกัด WGS84', aliases: ['WGS84', 'EPSG:4326'] },
    cgcs2000: { label: 'พิกัด CGCS2000 (EPSG:4490)', short: 'พิกัด CGCS2000', aliases: ['CGCS2000', 'EPSG:4490'] },
    gcj02: { label: 'พิกัด GCJ02', short: 'พิกัด GCJ02', aliases: ['GCJ02', 'พิกัด Mars'] },
    baiduMercator: { label: 'Baidu Mercator', short: 'Baidu Mercator', aliases: ['Baidu Mercator', 'baiduMercator'] },
    bd09: { label: 'พิกัด BD09', short: 'พิกัด BD09', aliases: ['BD09', 'พิกัด Baidu'] },
  },
  tr: {
    mercator: { label: 'Merkator koordinatlari (EPSG:3857)', short: 'Merkator koordinatlari', aliases: ['Mercator', 'EPSG:3857'] },
    wgs84: { label: 'WGS84 koordinatlari (EPSG:4326)', short: 'WGS84 koordinatlari', aliases: ['WGS84', 'EPSG:4326'] },
    cgcs2000: { label: 'CGCS2000 koordinatlari (EPSG:4490)', short: 'CGCS2000 koordinatlari', aliases: ['CGCS2000', 'EPSG:4490'] },
    gcj02: { label: 'GCJ02 koordinatlari', short: 'GCJ02 koordinatlari', aliases: ['GCJ02', 'Mars koordinatlari'] },
    baiduMercator: { label: 'Baidu Mercator', short: 'Baidu Mercator', aliases: ['Baidu Mercator', 'baiduMercator'] },
    bd09: { label: 'BD09 koordinatlari', short: 'BD09 koordinatlari', aliases: ['BD09', 'Baidu koordinatlari'] },
  },
  vi: {
    mercator: { label: 'Toa do Mercator (EPSG:3857)', short: 'Toa do Mercator', aliases: ['Mercator', 'EPSG:3857'] },
    wgs84: { label: 'Toa do WGS84 (EPSG:4326)', short: 'Toa do WGS84', aliases: ['WGS84', 'EPSG:4326'] },
    cgcs2000: { label: 'Toa do CGCS2000 (EPSG:4490)', short: 'Toa do CGCS2000', aliases: ['CGCS2000', 'EPSG:4490'] },
    gcj02: { label: 'Toa do GCJ02', short: 'Toa do GCJ02', aliases: ['GCJ02', 'toa do Mars'] },
    baiduMercator: { label: 'Baidu Mercator', short: 'Baidu Mercator', aliases: ['Baidu Mercator', 'baiduMercator'] },
    bd09: { label: 'Toa do BD09', short: 'Toa do BD09', aliases: ['BD09', 'toa do Baidu'] },
  },
}

const localeStaticCopy: Record<LangCode, { moreTools: string; index: IndexCopy; ui: UiCopy }> = {
  zh: { moreTools: '更多坐标转换', index: { title: '在线坐标转换', description: '支持地球坐标、火星坐标、百度坐标、百度墨卡托、墨卡托坐标、天地图坐标等常见坐标系互转，点击下方卡片即可进入对应转换页面。' }, ui: { inputLabel: '输入坐标', outputLabel: '输出坐标' } },
  'zh-TW': { moreTools: '更多座標轉換', index: { title: '線上座標轉換', description: '支援地球座標、火星座標、百度座標、百度墨卡托、墨卡托座標、天地圖座標等常見座標系互轉，點擊下方卡片即可進入對應轉換頁面。' }, ui: { inputLabel: '輸入座標', outputLabel: '輸出座標' } },
  en: { moreTools: 'More Coordinate Conversions', index: { title: 'Online Coordinate Converter', description: 'Convert between WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator, and CGCS2000. Click any card below to open the corresponding conversion page.' }, ui: { inputLabel: 'Input Coordinates', outputLabel: 'Output Coordinates' } },
  ar: { moreTools: 'المزيد من تحويلات الإحداثيات', index: { title: 'محول الإحداثيات عبر الإنترنت', description: 'يدعم التحويل بين WGS84 وGCJ02 وBD09 وBaidu Mercator وWeb Mercator وCGCS2000. انقر على أي بطاقة أدناه لفتح صفحة التحويل المناسبة.' }, ui: { inputLabel: 'إحداثيات الإدخال', outputLabel: 'إحداثيات الإخراج' } },
  de: { moreTools: 'Weitere Koordinatenumrechnungen', index: { title: 'Online-Koordinatenumrechner', description: 'Unterstuetzt Umrechnungen zwischen WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator und CGCS2000. Klicken Sie unten auf eine Karte, um die passende Umrechnungsseite zu oeffnen.' }, ui: { inputLabel: 'Eingabekoordinaten', outputLabel: 'Ausgabekoordinaten' } },
  es: { moreTools: 'Mas conversiones de coordenadas', index: { title: 'Convertidor de coordenadas en linea', description: 'Convierte entre WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator y CGCS2000. Haz clic en cualquier tarjeta de abajo para abrir la pagina de conversion correspondiente.' }, ui: { inputLabel: 'Coordenadas de entrada', outputLabel: 'Coordenadas de salida' } },
  fr: { moreTools: 'Plus de conversions de coordonnees', index: { title: 'Convertisseur de coordonnees en ligne', description: 'Prend en charge les conversions entre WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator et CGCS2000. Cliquez sur une carte ci-dessous pour ouvrir la page de conversion correspondante.' }, ui: { inputLabel: 'Coordonnees source', outputLabel: 'Coordonnees resultat' } },
  hi: { moreTools: 'और निर्देशांक रूपांतरण', index: { title: 'ऑनलाइन निर्देशांक कन्वर्टर', description: 'WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator और CGCS2000 के बीच रूपांतरण का समर्थन करता है। नीचे किसी भी कार्ड पर क्लिक करके संबंधित रूपांतरण पेज खोलें।' }, ui: { inputLabel: 'इनपुट निर्देशांक', outputLabel: 'आउटपुट निर्देशांक' } },
  id: { moreTools: 'Konversi koordinat lainnya', index: { title: 'Konverter koordinat online', description: 'Mendukung konversi antara WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator, dan CGCS2000. Klik kartu di bawah untuk membuka halaman konversi yang sesuai.' }, ui: { inputLabel: 'Koordinat input', outputLabel: 'Koordinat output' } },
  it: { moreTools: 'Altre conversioni di coordinate', index: { title: 'Convertitore di coordinate online', description: 'Supporta la conversione tra WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator e CGCS2000. Fai clic su una scheda qui sotto per aprire la pagina di conversione corrispondente.' }, ui: { inputLabel: 'Coordinate di input', outputLabel: 'Coordinate di output' } },
  ja: { moreTools: 'その他の座標変換', index: { title: 'オンライン座標変換', description: 'WGS84、GCJ02、BD09、Baidu Mercator、Web Mercator、CGCS2000 間の変換に対応しています。下のカードをクリックすると対応する変換ページを開けます。' }, ui: { inputLabel: '入力座標', outputLabel: '出力座標' } },
  ko: { moreTools: '더 많은 좌표 변환', index: { title: '온라인 좌표 변환기', description: 'WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator, CGCS2000 간 변환을 지원합니다. 아래 카드 중 하나를 클릭하면 해당 변환 페이지로 이동합니다.' }, ui: { inputLabel: '입력 좌표', outputLabel: '출력 좌표' } },
  nl: { moreTools: 'Meer coordinatenconversies', index: { title: 'Online coordinatenconverter', description: 'Ondersteunt conversies tussen WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator en CGCS2000. Klik op een kaart hieronder om de bijbehorende conversiepagina te openen.' }, ui: { inputLabel: 'Invoercoordinaten', outputLabel: 'Uitvoercoordinaten' } },
  pl: { moreTools: 'Wiecej konwersji wspolrzednych', index: { title: 'Internetowy konwerter wspolrzednych', description: 'Obsluguje konwersje miedzy WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator i CGCS2000. Kliknij dowolna karte ponizej, aby otworzyc odpowiednia strone konwersji.' }, ui: { inputLabel: 'Wspolrzedne wejsciowe', outputLabel: 'Wspolrzedne wyjsciowe' } },
  pt: { moreTools: 'Mais conversoes de coordenadas', index: { title: 'Conversor de coordenadas online', description: 'Suporta conversoes entre WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator e CGCS2000. Clique em qualquer cartao abaixo para abrir a pagina de conversao correspondente.' }, ui: { inputLabel: 'Coordenadas de entrada', outputLabel: 'Coordenadas de saida' } },
  ru: { moreTools: 'Другие преобразования координат', index: { title: 'Онлайн-конвертер координат', description: 'Поддерживает преобразование между WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator и CGCS2000. Нажмите на любую карточку ниже, чтобы открыть нужную страницу преобразования.' }, ui: { inputLabel: 'Входные координаты', outputLabel: 'Выходные координаты' } },
  sv: { moreTools: 'Fler koordinatkonverteringar', index: { title: 'Online koordinatkonverterare', description: 'Stoeder konvertering mellan WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator och CGCS2000. Klicka pa ett kort nedan for att oppna motsvarande konverteringssida.' }, ui: { inputLabel: 'Inmatningskoordinater', outputLabel: 'Utmatningskoordinater' } },
  th: { moreTools: 'การแปลงพิกัดเพิ่มเติม', index: { title: 'เครื่องมือแปลงพิกัดออนไลน์', description: 'รองรับการแปลงระหว่าง WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator และ CGCS2000 คลิกการ์ดด้านล่างเพื่อเปิดหน้าการแปลงที่ตรงกัน' }, ui: { inputLabel: 'พิกัดขาเข้า', outputLabel: 'พิกัดขาออก' } },
  tr: { moreTools: 'Daha fazla koordinat donusumu', index: { title: 'Cevrim ici koordinat donusturucu', description: 'WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator ve CGCS2000 arasinda donusumu destekler. Ilgili donusum sayfasini acmak icin asagidaki kartlardan birine tiklayin.' }, ui: { inputLabel: 'Giris koordinatlari', outputLabel: 'Cikis koordinatlari' } },
  vi: { moreTools: 'Them chuyen doi toa do', index: { title: 'Cong cu chuyen doi toa do truc tuyen', description: 'Ho tro chuyen doi giua WGS84, GCJ02, BD09, Baidu Mercator, Web Mercator va CGCS2000. Bam vao bat ky the nao ben duoi de mo trang chuyen doi tuong ung.' }, ui: { inputLabel: 'Toa do dau vao', outputLabel: 'Toa do dau ra' } },
}

const seoMetaTemplates: Record<LangCode, SeoTemplate> = {
  zh: {
    title: '在线{sourceCode}转{targetCode} - 免费{sourceShort}转{targetShort}工具',
    description: '免费在线将{sourceLabel}转换为{targetLabel}，输入 x、y 坐标即可即时得到结果，适合地图开发、GIS 数据处理与坐标校正。',
    keywords: '{h1},{sourceCode}转{targetCode},{sourceShort}转换,{targetShort}转换,在线坐标转换,地图坐标转换',
  },
  'zh-TW': {
    title: '線上{sourceCode}轉{targetCode} - 免費{sourceShort}轉{targetShort}工具',
    description: '免費線上將{sourceLabel}轉換為{targetLabel}，輸入 x、y 座標即可立即得到結果，適合地圖開發、GIS 資料處理與座標校正。',
    keywords: '{h1},{sourceCode}轉{targetCode},{sourceShort}轉換,{targetShort}轉換,線上座標轉換,地圖座標轉換',
  },
  en: {
    title: '{sourceCode} to {targetCode} Online Converter - Free {sourceShort} to {targetShort} Tool',
    description: 'Free online conversion from {sourceLabel} to {targetLabel}. Enter x and y coordinates to get instant results for map development, GIS data processing, and coordinate correction.',
    keywords: '{h1},{sourceCode} to {targetCode},{sourceShort} converter,{targetShort} converter,online coordinate converter,map coordinate conversion',
  },
  ar: {
    title: 'تحويل {sourceCode} إلى {targetCode} عبر الإنترنت - أداة مجانية لتحويل {sourceShort} إلى {targetShort}',
    description: 'تحويل مجاني عبر الإنترنت من {sourceLabel} إلى {targetLabel}. أدخل إحداثيات x و y للحصول على النتيجة فوراً، وهو مناسب لتطوير الخرائط ومعالجة بيانات GIS وتصحيح الإحداثيات.',
    keywords: '{h1},{sourceCode} إلى {targetCode},{sourceShort},{targetShort},تحويل الإحداثيات,تحويل إحداثيات الخرائط',
  },
  de: {
    title: '{sourceCode} zu {targetCode} online umrechnen - Kostenloses Tool fuer {sourceShort} zu {targetShort}',
    description: 'Kostenlose Online-Umrechnung von {sourceLabel} nach {targetLabel}. Geben Sie x- und y-Koordinaten ein, um sofort Ergebnisse fuer Kartenentwicklung, GIS-Datenverarbeitung und Koordinatenkorrektur zu erhalten.',
    keywords: '{h1},{sourceCode} zu {targetCode},{sourceShort},{targetShort},Koordinatenumrechnung,Kartenkoordinaten umrechnen',
  },
  es: {
    title: 'Convertir {sourceCode} a {targetCode} en linea - Herramienta gratis de {sourceShort} a {targetShort}',
    description: 'Conversion gratuita en linea de {sourceLabel} a {targetLabel}. Introduce coordenadas x e y para obtener resultados al instante para desarrollo de mapas, procesamiento GIS y correccion de coordenadas.',
    keywords: '{h1},{sourceCode} a {targetCode},{sourceShort},{targetShort},conversion de coordenadas,conversion de coordenadas de mapa',
  },
  fr: {
    title: 'Convertir {sourceCode} vers {targetCode} en ligne - Outil gratuit {sourceShort} vers {targetShort}',
    description: 'Conversion gratuite en ligne de {sourceLabel} vers {targetLabel}. Saisissez les coordonnees x et y pour obtenir un resultat immediat, utile pour le developpement cartographique, le traitement GIS et la correction de coordonnees.',
    keywords: '{h1},{sourceCode} vers {targetCode},{sourceShort},{targetShort},conversion de coordonnees,conversion de coordonnees cartographiques',
  },
  hi: {
    title: '{sourceCode} से {targetCode} ऑनलाइन कन्वर्टर - मुफ्त {sourceShort} से {targetShort} टूल',
    description: '{sourceLabel} से {targetLabel} में मुफ्त ऑनलाइन रूपांतरण। x और y निर्देशांक दर्ज करें और तुरंत परिणाम पाएं। यह मैप डेवलपमेंट, GIS डेटा प्रोसेसिंग और निर्देशांक सुधार के लिए उपयुक्त है।',
    keywords: '{h1},{sourceCode} से {targetCode},{sourceShort},{targetShort},निर्देशांक रूपांतरण,मानचित्र निर्देशांक रूपांतरण',
  },
  id: {
    title: 'Konverter {sourceCode} ke {targetCode} Online - Alat gratis {sourceShort} ke {targetShort}',
    description: 'Konversi online gratis dari {sourceLabel} ke {targetLabel}. Masukkan koordinat x dan y untuk mendapatkan hasil instan, cocok untuk pengembangan peta, pemrosesan data GIS, dan koreksi koordinat.',
    keywords: '{h1},{sourceCode} ke {targetCode},{sourceShort},{targetShort},konversi koordinat,konversi koordinat peta',
  },
  it: {
    title: 'Convertitore online da {sourceCode} a {targetCode} - Strumento gratuito da {sourceShort} a {targetShort}',
    description: 'Conversione online gratuita da {sourceLabel} a {targetLabel}. Inserisci le coordinate x e y per ottenere subito il risultato, utile per sviluppo mappe, elaborazione dati GIS e correzione coordinate.',
    keywords: '{h1},{sourceCode} a {targetCode},{sourceShort},{targetShort},conversione coordinate,conversione coordinate mappa',
  },
  ja: {
    title: '{sourceCode} から {targetCode} へのオンライン変換 - 無料の {sourceShort} から {targetShort} 変換ツール',
    description: '{sourceLabel} から {targetLabel} への無料オンライン変換です。x と y の座標を入力すると即座に結果を取得でき、地図開発、GIS データ処理、座標補正に適しています。',
    keywords: '{h1},{sourceCode} から {targetCode},{sourceShort},{targetShort},座標変換,地図座標変換',
  },
  ko: {
    title: '{sourceCode}에서 {targetCode}로 온라인 변환 - 무료 {sourceShort} -> {targetShort} 도구',
    description: '{sourceLabel}에서 {targetLabel}로 무료 온라인 변환을 제공합니다. x, y 좌표를 입력하면 즉시 결과를 얻을 수 있으며 지도 개발, GIS 데이터 처리, 좌표 보정에 적합합니다.',
    keywords: '{h1},{sourceCode}에서 {targetCode},{sourceShort},{targetShort},좌표 변환,지도 좌표 변환',
  },
  nl: {
    title: '{sourceCode} naar {targetCode} online converter - Gratis {sourceShort} naar {targetShort} tool',
    description: 'Gratis online conversie van {sourceLabel} naar {targetLabel}. Voer x- en y-coordinaten in voor direct resultaat, geschikt voor kaartontwikkeling, GIS-gegevensverwerking en coordinaatcorrectie.',
    keywords: '{h1},{sourceCode} naar {targetCode},{sourceShort},{targetShort},coordinatenconversie,kaartcoordinaten converteren',
  },
  pl: {
    title: 'Konwerter online {sourceCode} na {targetCode} - Darmowe narzedzie {sourceShort} na {targetShort}',
    description: 'Darmowa konwersja online z {sourceLabel} na {targetLabel}. Wprowadz wspolrzedne x i y, aby natychmiast otrzymac wynik do zastosowan mapowych, przetwarzania danych GIS i korekty wspolrzednych.',
    keywords: '{h1},{sourceCode} na {targetCode},{sourceShort},{targetShort},konwersja wspolrzednych,konwersja wspolrzednych mapy',
  },
  pt: {
    title: 'Conversor online de {sourceCode} para {targetCode} - Ferramenta gratis de {sourceShort} para {targetShort}',
    description: 'Conversao gratuita online de {sourceLabel} para {targetLabel}. Insira coordenadas x e y para obter resultados imediatos, ideal para desenvolvimento de mapas, processamento de dados GIS e correcao de coordenadas.',
    keywords: '{h1},{sourceCode} para {targetCode},{sourceShort},{targetShort},conversao de coordenadas,conversao de coordenadas de mapa',
  },
  ru: {
    title: 'Онлайн-конвертер {sourceCode} в {targetCode} - Бесплатный инструмент {sourceShort} в {targetShort}',
    description: 'Бесплатное онлайн-преобразование из {sourceLabel} в {targetLabel}. Введите координаты x и y, чтобы мгновенно получить результат для разработки карт, обработки данных GIS и коррекции координат.',
    keywords: '{h1},{sourceCode} в {targetCode},{sourceShort},{targetShort},преобразование координат,преобразование координат карты',
  },
  sv: {
    title: '{sourceCode} till {targetCode} onlinekonverterare - Gratis verktyg foer {sourceShort} till {targetShort}',
    description: 'Gratis onlinekonvertering fraan {sourceLabel} till {targetLabel}. Ange x- och y-koordinater foer att faa resultat direkt, laempligt foer kartutveckling, GIS-databehandling och koordinatkorrigering.',
    keywords: '{h1},{sourceCode} till {targetCode},{sourceShort},{targetShort},koordinatkonvertering,kartkoordinatkonvertering',
  },
  th: {
    title: 'แปลง {sourceCode} เป็น {targetCode} ออนไลน์ - เครื่องมือฟรี {sourceShort} ไป {targetShort}',
    description: 'แปลง {sourceLabel} เป็น {targetLabel} ออนไลน์ฟรี เพียงกรอกพิกัด x และ y ก็จะได้ผลลัพธ์ทันที เหมาะสำหรับงานพัฒนาแผนที่ การประมวลผลข้อมูล GIS และการปรับแก้พิกัด',
    keywords: '{h1},{sourceCode} เป็น {targetCode},{sourceShort},{targetShort},แปลงพิกัด,แปลงพิกัดแผนที่',
  },
  tr: {
    title: '{sourceCode} -> {targetCode} cevrim ici donusturucu - Ucretsiz {sourceShort} -> {targetShort} araci',
    description: '{sourceLabel} -> {targetLabel} ucretsiz cevrim ici donusum. x ve y koordinatlarini girerek harita gelistirme, GIS veri isleme ve koordinat duzeltme icin aninda sonuc alin.',
    keywords: '{h1},{sourceCode} -> {targetCode},{sourceShort},{targetShort},koordinat donusumu,harita koordinat donusumu',
  },
  vi: {
    title: 'Chuyen doi {sourceCode} sang {targetCode} truc tuyen - Cong cu mien phi tu {sourceShort} sang {targetShort}',
    description: 'Chuyen doi truc tuyen mien phi tu {sourceLabel} sang {targetLabel}. Nhap toa do x va y de nhan ket qua ngay lap tuc, phu hop cho phat trien ban do, xu ly du lieu GIS va hieu chinh toa do.',
    keywords: '{h1},{sourceCode} sang {targetCode},{sourceShort},{targetShort},chuyen doi toa do,chuyen doi toa do ban do',
  },
}

function buildH1(lang: LangCode, source: CoordinateMeta, target: CoordinateMeta): string {
  switch (lang) {
    case 'zh':
      return `${source.short}转${target.short}`
    case 'zh-TW':
      return `${source.short}轉${target.short}`
    case 'en':
      return `${source.short} to ${target.short}`
    case 'ar':
      return `${source.short} إلى ${target.short}`
    case 'de':
      return `${source.short} zu ${target.short}`
    case 'es':
      return `${source.short} a ${target.short}`
    case 'fr':
      return `${source.short} vers ${target.short}`
    case 'hi':
      return `${source.short} से ${target.short}`
    case 'id':
      return `${source.short} ke ${target.short}`
    case 'it':
      return `Da ${source.short} a ${target.short}`
    case 'ja':
      return `${source.short}から${target.short}`
    case 'ko':
      return `${source.short} -> ${target.short}`
    case 'nl':
      return `${source.short} naar ${target.short}`
    case 'pl':
      return `${source.short} na ${target.short}`
    case 'pt':
      return `${source.short} para ${target.short}`
    case 'ru':
      return `${source.short} в ${target.short}`
    case 'sv':
      return `${source.short} till ${target.short}`
    case 'th':
      return `${source.short} เป็น ${target.short}`
    case 'tr':
      return `${source.short} -> ${target.short}`
    case 'vi':
      return `${source.short} sang ${target.short}`
  }
}

function applySeoTemplate(template: SeoTemplate, replacements: Record<string, string>): SeoTemplate {
  const replace = (value: string) =>
    value.replace(/\{(\w+)\}/g, (_, key: string) => replacements[key] ?? '')

  return {
    title: replace(template.title),
    description: replace(template.description),
    keywords: replace(template.keywords),
  }
}

export function getMapCoordinateIndexCopy(lang: LangCode): IndexCopy {
  return localeStaticCopy[lang].index
}

export function getMapCoordinateUiCopy(lang: LangCode): UiCopy {
  return localeStaticCopy[lang].ui
}

export function getMapCoordinateRouteParams(lang: LangCode): MapCoordinateRouteParams[] {
  const coordinateCopy = allCoordinateCopy[lang]
  const { moreTools } = localeStaticCopy[lang]

  return routeDefs.map(({ source, target, transform }) => {
    const sourceMeta = coordinateCopy[source]
    const targetMeta = coordinateCopy[target]
    const sourceCode = coordinateCodes[source]
    const targetCode = coordinateCodes[target]
    const h1 = buildH1(lang, sourceMeta, targetMeta)
    const seoMeta = applySeoTemplate(seoMetaTemplates[lang], {
      h1,
      sourceLabel: sourceMeta.label,
      targetLabel: targetMeta.label,
      sourceShort: sourceMeta.short,
      targetShort: targetMeta.short,
      sourceCode,
      targetCode,
    })

    return {
      source,
      target,
      transform,
      sourceLabel: sourceMeta.label,
      targetLabel: targetMeta.label,
      h1,
      title: seoMeta.title,
      description: seoMeta.description,
      keywords: seoMeta.keywords,
      moreTools,
    }
  })
}

export function getMapCoordinatePaths(lang: LangCode): { paths: () => ParamsItem[] } {
  return {
    paths: () => getMapCoordinateRouteParams(lang).map(params => ({ params })),
  }
}

export default getMapCoordinatePaths('zh')
