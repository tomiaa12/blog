import { addCoordinateTransforms, addProjection, Projection } from "ol/proj"
import proj4 from "proj4"
import { register } from "ol/proj/proj4"
import {
  BD092BaiduMercator,
  BD092Mercator,
  BD092WSG84,
  CGCS20002BaiduMercator,
  WSG842BD09,
  WSG842BaiduMercator,
  baiduMercator2BD09,
  baiduMercator2CGC2000,
  baiduMercator2Mercator,
  baiduMercator2WSG84,
  mercator2BD09,
  mercator2BaiduMercator,
} from "@tomiaa/coordinate-transform"

/* --------  坐标定义  --------- */

/* 天地图 CGC2000 */
proj4.defs("EPSG:4490", "+proj=longlat +ellps=GRS80 +no_defs +type=crs")
register(proj4)

/* 百度墨卡托坐标 */
const baiduMercator = new Projection({
  code: "baidu",
  extent: [
    -20022743.74356534, -12474104.1741364, 20022743.74356534, 12474104.1741364,
  ],
  // extent: [-20037726.37, -12474104.17, 20037726.37, 12474104.17],
  units: "m",
})

/* 百度 BD:09 经纬度坐标 */
const BD09 = new Projection({
  code: "BD:09",
  units: "m",
  extent: [-179.86541124, -74, 179.86541124, 74],
})
addProjection(BD09)
addProjection(baiduMercator)

/* 百度墨卡托 <==> WSG84 */
addCoordinateTransforms(
  "EPSG:4326",
  baiduMercator,
  WSG842BaiduMercator,
  baiduMercator2WSG84
)
/* 百度墨卡托 <==> 墨卡托 */
addCoordinateTransforms(
  "EPSG:3857",
  baiduMercator,
  mercator2BaiduMercator,
  baiduMercator2Mercator
)

/* WSG84 <==> BD09 */
addCoordinateTransforms("EPSG:4326", BD09, WSG842BD09, BD092WSG84)
/* 墨卡托 <==> BD09 */
addCoordinateTransforms("EPSG:3857", BD09, mercator2BD09, BD092Mercator)

/* 百度墨卡托 <==> BD:09 */
addCoordinateTransforms(
  BD09,
  baiduMercator,
  BD092BaiduMercator,
  baiduMercator2BD09
)

/* 百度墨卡托 <==> EPSG:4490(天地图) */
addCoordinateTransforms(
  baiduMercator,
  "EPSG:4490",
  baiduMercator2CGC2000,
  CGCS20002BaiduMercator
)
