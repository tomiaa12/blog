import {
  addCoordinateTransforms,
  addProjection,
  Projection,
  transform,
} from "ol/proj"
// @ts-ignore
import projzh from "projzh"
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';

let isInit = false
export const openlayersProjDefs = () => {
  if(isInit) return
  isInit = true

  proj4.defs("EPSG:4490","+proj=longlat +ellps=GRS80 +no_defs +type=crs");
  register(proj4);

  /* 百度墨卡托坐标 */
  const baiduMercator = new Projection({
    code: "baidu",
    extent: [
      -20022743.74356534, -12474104.1741364, 20022743.74356534,
      12474104.1741364,
    ],
    // extent: [-20037726.37, -12474104.17, 20037726.37, 12474104.17],
    units: "m",
  })
  addProjection(baiduMercator)
  addCoordinateTransforms(
    "EPSG:4326",
    baiduMercator,
    projzh.ll2bmerc,
    projzh.bmerc2ll
  )
  addCoordinateTransforms(
    "EPSG:3857",
    baiduMercator,
    projzh.smerc2bmerc,
    projzh.bmerc2smerc
  )

  /* 百度 BD:09 经纬度坐标 */
  const BD09 = new Projection({
    code: "BD:09",
    units: "m",
    extent: [-179.86541124, -74, 179.86541124, 74],
  })
  addProjection(BD09)
  addCoordinateTransforms(
    "EPSG:4326",
    BD09,
    coordinate => {
      return projzh.datum.bd09.fromWGS84(coordinate)
    },
    coordinate => {
      return projzh.datum.bd09.toWGS84(coordinate)
    }
  )
  addCoordinateTransforms(
    "EPSG:3857",
    BD09,
    coordinate => {
      const WWGS84 = transform(coordinate, "EPSG:3857", "EPSG:4326")
      return projzh.datum.bd09.fromWGS84(WWGS84)
    },
    coordinate => {
      const WGS84 = projzh.datum.bd09.toWGS84(coordinate)
      return transform(WGS84, "EPSG:3857", "EPSG:4326")
    }
  )

  /* 百度墨卡托 BD:09 互转 */
  addCoordinateTransforms(
    BD09,
    baiduMercator,
    coordinate => {
      const WGS84 = projzh.datum.bd09.toWGS84(coordinate)
      return projzh.ll2bmerc(WGS84)
    },
    coordinate => {
      const WGS84 = projzh.bmerc2ll(coordinate)
      return projzh.datum.bd09.fromWGS84(WGS84)
    }
  )

  /* 百度墨卡托 <==> EPSG:4490 */
  addCoordinateTransforms(
    baiduMercator,
    'EPSG:4490',
    coordinate => {
      const WGS84 = projzh.bmerc2ll(coordinate)

      return transform(WGS84,'EPSG:4326',"EPSG:4490")
    },
    coordinate => {
      const WGS84 = transform(coordinate,'EPSG:4490',"EPSG:4326")
      return projzh.ll2bmerc(WGS84)
    }
  )
}
