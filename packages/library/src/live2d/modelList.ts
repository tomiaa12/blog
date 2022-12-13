export interface ModelOption {
  // 名称
  name?: string
  // 模型服装列表
  list: string[]
  // 宽高比 [x,y]
  aspectRatio?: [number, number]
  // 定位增减值
  position?: {
    x?: number
    y?: number
  }
  // 缩放
  scale?:
    | number
    | {
        x?: number
        y?: number
      }
  // 宽高拉伸比
  stretch?: {
    width?: number
    height?: number
  }
  // 版本
  version?: number
}

export const Live2dModelList: ModelOption[] = [
  {
    name: "shazuku",
    scale: 0.9,
    list: ["/live2d/shizuku/shizuku.model.json"],
  },
  {
    name: "snow_miku",
    list: ["/live2d/snow_miku/model.json"],
  },
  {
    name: "Tia",
    list: [
      "/live2d/Tia/index.json",
      "/live2d/Tia/index1.json",
      "/live2d/Tia/index2.json",
      "/live2d/Tia/index3.json",
      "/live2d/Tia/index4.json",
      "/live2d/Tia/index5.json",
    ],
  },
  {
    name: "Pio",
    list: [
      "/live2d/Pio/model.json",
      "/live2d/Pio/model1.json",
      "/live2d/Pio/model2.json",
      "/live2d/Pio/model3.json",
      "/live2d/Pio/model4.json",
      "/live2d/Pio/model5.json",
    ],
  },
  {
    name: "rem",
    list: ["/live2d/rem/model.json"],
  },
  {
    name: "dollsfrontline",
    position: {
      x: -40,
      y: 30,
    },
    list: ["/live2d/dollsfrontline/fn57_2203/normal/model.json"],
  },
  {
    name: "Violet",
    position: {
      x: -30,
      y: -40,
    },
    list: ["/live2d/Violet/14.json"],
  },
  {
    name: "95type_405",
    list: [
      "/live2d/dollsfrontline/95type_405/normal/model.json",
      "/live2d/dollsfrontline/95type_405/destroy/model.json",
    ],
  },
  {
    name: "Alice",
    list: ["/live2d/Alice/model.json"],
  },
  {
    name: "g36c_1202",
    position: {
      x: -60,
      y: 10,
    },
    list: [
      "/live2d/dollsfrontline/g36c_1202/normal/model.json",
      "/live2d/dollsfrontline/g36c_1202/destroy/model.json",
    ],
  },
  {
    name: "g41_2401",
    position: {
      x: -30,
      y: 40,
    },
    list: [
      "/live2d/dollsfrontline/g41_2401/normal/model.json",
      "/live2d/dollsfrontline/g41_2401/destroy/model.json",
    ],
  },
  {
    name: "hk416_805",
    position: {
      x: -40,
      y: 10,
    },
    list: [
      "/live2d/dollsfrontline/hk416_805/normal/model.json",
      "/live2d/dollsfrontline/hk416_805/destroy/model.json",
    ],
  },
  {
    position: {
      x: -35,
    },
    list: [
      "/live2d/dollsfrontline/rfb_1601/normal/model.json",
      "/live2d/dollsfrontline/rfb_1601/destroy/model.json",
    ],
  },
  {
    name: "sat8_2601",
    list: [
      "/live2d/dollsfrontline/sat8_2601/normal/model.json",
      "/live2d/dollsfrontline/sat8_2601/destroy/model.json",
    ],
  },
  {
    name: "kp31_310",
    position: {
      x: -50,
    },
    list: [
      "/live2d/dollsfrontline/kp31_310/normal/model.json",
      "/live2d/dollsfrontline/kp31_310/destroy/model.json",
    ],
  },
  {
    name: "px4storm_2801",
    position: {
      x: -50,
      y: 35,
    },
    list: [
      "/live2d/dollsfrontline/px4storm_2801/normal/model.json",
      "/live2d/dollsfrontline/px4storm_2801/destroy/model.json",
    ],
  },
  {
    name: "welrod_1401",
    position: {
      x: -40,
    },
    list: [
      "/live2d/dollsfrontline/welrod_1401/normal/model.json",
      "/live2d/dollsfrontline/welrod_1401/destroy/model.json",
    ],
  },
  {
    name: "22_Q版",
    position: {
      x: -30,
      y: 44,
    },
    list: [
      "/live2d/22/model.default.json",
      "/live2d/22/model.2016.xmas.1.json",
      "/live2d/22/model.2016.xmas.2.json",
      "/live2d/22/model.2017.cba-normal.json",
      "/live2d/22/model.2017.cba-super.json",
      "/live2d/22/model.2017.newyear.json",
      "/live2d/22/model.2017.school.json",
      "/live2d/22/model.2017.summer.normal.1.json",
      "/live2d/22/model.2017.summer.normal.2.json",
      "/live2d/22/model.2017.summer.super.1.json",
      "/live2d/22/model.2017.summer.super.2.json",
      "/live2d/22/model.2017.tomo-bukatsu.high.json",
      "/live2d/22/model.2017.tomo-bukatsu.low.json",
      "/live2d/22/model.2017.valley.json",
      "/live2d/22/model.2017.vdays.json",
      "/live2d/22/model.2018.bls-summer.json",
      "/live2d/22/model.2018.bls-winter.json",
      "/live2d/22/model.2018.lover.json",
      "/live2d/22/model.2018.spring.json",
    ],
  },
  {
    name: "33_Q版",
    position: {
      x: -30,
      y: 44,
    },
    list: [
      "/live2d/33/model.default.json",
      "/live2d/33/model.2016.xmas.1.json",
      "/live2d/33/model.2016.xmas.2.json",
      "/live2d/33/model.2017.cba-normal.json",
      "/live2d/33/model.2017.cba-super.json",
      "/live2d/33/model.2017.newyear.json",
      "/live2d/33/model.2017.school.json",
      "/live2d/33/model.2017.summer.normal.1.json",
      "/live2d/33/model.2017.summer.normal.2.json",
      "/live2d/33/model.2017.summer.super.1.json",
      "/live2d/33/model.2017.summer.super.2.json",
      "/live2d/33/model.2017.tomo-bukatsu.high.json",
      "/live2d/33/model.2017.tomo-bukatsu.low.json",
      "/live2d/33/model.2017.valley.json",
      "/live2d/33/model.2017.vdays.json",
      "/live2d/33/model.2018.bls-summer.json",
      "/live2d/33/model.2018.bls-winter.json",
      "/live2d/33/model.2018.lover.json",
      "/live2d/33/model.2018.spring.json",
    ],
  },
  {
    name: "dsr50_2101",
    position: {
      x: -30,
      y: 10,
    },
    list: [
      "/live2d/dollsfrontline/dsr50_2101/normal/model.json",
      "/live2d/dollsfrontline/dsr50_2101/destroy/model.json",
    ],
  },
  {
    name: "kp31_1103",
    position: {
      x: -40,
      y: 30,
    },
    list: [
      "/live2d/dollsfrontline/kp31_1103/normal/model.json",
      "/live2d/dollsfrontline/kp31_1103/destroy/model.json",
    ],
  },
  {
    name: "ntw20_2301",
    position: {
      x: -30,
      y: 15,
    },
    list: [
      "/live2d/dollsfrontline/ntw20_2301/normal/model.json",
      "/live2d/dollsfrontline/ntw20_2301/destroy/model.json",
    ],
  },
  {
    name: "ots14_3001",
    list: [
      "/live2d/dollsfrontline/ots14_3001/normal/model.json",
      "/live2d/dollsfrontline/ots14_3001/destroy/model.json",
    ],
  },
  {
    name: "type64-ar_2901",
    position: { x: -40, y: 10 },
    list: [
      "/live2d/dollsfrontline/type64-ar_2901/normal/model.json",
      "/live2d/dollsfrontline/type64-ar_2901/destroy/model.json",
    ],
  },
  {
    name: "Kobayaxi",
    position: {
      x: -75,
    },
    list: ["/live2d/Kobayaxi/Kobayaxi.model.json"],
  },
  {
    name: "22_high",
    position: {
      x: -90,
    },
    list: ["/live2d/22_high/model.json"],
  },
  {
    name: "33_high",
    position: {
      x: -90,
    },
    list: ["/live2d/33_high/model.json"],
  },
  {
    name: "shield",
    list: [
      "/live2d/dollsfrontline/shield/model1.json",
      "/live2d/dollsfrontline/shield/model2.json",
      "/live2d/dollsfrontline/shield/model3.json",
    ],
  },
  {
    name: "bronya",
    list: ["/live2d/bronya/model.json"],
  },
  {
    name: "haru",
    position: {
      y: 90,
      x: -30,
    },
    scale: 0.8,
    stretch: {
      height: 1.3,
    },
    list: [
      "/live2d/haru/haru_01.model.json",
      "/live2d/haru/haru_02.model.json",
    ],
  },
  {
    name: "hijiki_tororo",
    list: [
      "/live2d/hijiki/hijiki.model.json",
      "/live2d/tororo/tororo.model.json",
    ],
  },
  {
    name: "wa2000_6",
    list: [
      "/live2d/dollsfrontline/wa2000_6/normal/model.json",
      "/live2d/dollsfrontline/wa2000_6/destroy/model.json",
    ],
  },
  {
    name: "katou_01",
    position: {
      x: -70,
      y: -55,
    },
    list: ["/live2d/katou_01/katou_01.model.json"],
  },
  {
    name: "liang",
    position: {
      y: -80,
      x: -30,
    },
    scale: 0.8,
    stretch: {
      height: 1.3,
    },
    list: ["/live2d/liang/2.json"],
  },
  {
    name: "live_uu",
    position: {
      x: 50,
    },
    scale: 1.3,
    stretch: { height: 1.3 },
    list: [
      "/live2d/live_uu/model.json" /*  "/live2d/live_uu/model_usb.json" */,
    ],
  },
  {
    name: "mei",
    position: {
      x: -60,
    },
    list: ["/live2d/mei/model.json"],
  },
  {
    name: "miku",
    position: {
      x: -40,
    },
    list: ["/live2d/miku/miku.model.json"],
  },
  {
    name: "xiaomai",
    position: {
      x: -30,
    },
    list: ["/live2d/xiaomai/xiaomai.model.json"],
  },
  {
    name: "Epsilon2.1",
    list: ["/live2d/Epsilon2.1/Epsilon2.1.model.json"],
  },
  {
    name: "platelet",
    list: ["/live2d/platelet/model.json"],
  },
  {
    name: "platelet-2-3",
    position: {
      x: 50,
    },
    list: [
      "/live2d/platelet-2/model.json",
      "/live2d/platelet-3/kesyoban.model.json",
    ],
  },
  // /* {
  //   // 无效moc数据
  //   list: ["/live2d/Terisa/model.json"],
  // }, */
  {
    name: "yuri",
    position: {
      y: 20,
    },
    list: ["/live2d/yuri/model.json"],
  },
  {
    name: "blanc",
    position: {
      y: -168,
    },
    stretch: {
      height: 1.2,
    },
    list: [
      "/live2d/HyperdimensionNeptunia/blanc_classic/index.json",
      "/live2d/HyperdimensionNeptunia/blanc_normal/index.json",
      "/live2d/HyperdimensionNeptunia/blanc_swimwear/index.json",
    ],
  },
  {
    name: "histoire",
    position: {
      y: -200,
    },
    stretch: {
      height: 1.1,
    },
    list: [
      "/live2d/HyperdimensionNeptunia/histoire/index.json" /* "/live2d/HyperdimensionNeptunia/histoirenohover/index.json" */,
    ],
  },
  {
    name: "nepmaid",
    position: {
      y: -150,
    },
    stretch: {
      height: 1.3,
    },
    list: [
      "/live2d/HyperdimensionNeptunia/nepmaid/index.json",
      "/live2d/HyperdimensionNeptunia/nepnep/index.json",
      "/live2d/HyperdimensionNeptunia/nepswim/index.json",
      "/live2d/HyperdimensionNeptunia/neptune_classic/index.json",
      "/live2d/HyperdimensionNeptunia/neptune_santa/index.json",
    ],
  },
  {
    name: "noir",
    position: {
      y: -220,
    },
    stretch: {
      height: 1.3,
    },
    list: [
      "/live2d/HyperdimensionNeptunia/noir_classic/index.json",
      "/live2d/HyperdimensionNeptunia/noir/index.json",
      "/live2d/HyperdimensionNeptunia/noir_santa/index.json",
      "/live2d/HyperdimensionNeptunia/noireswim/index.json",
    ],
  },
  {
    name: "vert",
    position: {
      y: -190,
    },
    stretch: {
      height: 1.3,
    },
    list: [
      "/live2d/HyperdimensionNeptunia/vert_classic/index.json",
      "/live2d/HyperdimensionNeptunia/vert_normal/index.json",
      "/live2d/HyperdimensionNeptunia/vert_swimwear/index.json",
    ],
  },
  {
    name: "mashiro",
    position: {
      x: -80,
      y: -80,
    },
    list: [
      "/live2d/mashiro/ryoufuku.model.json",
      "/live2d/mashiro/seifuku.model.json",
      "/live2d/mashiro/shifuku.model.json",
    ],
  },
  {
    name: "iio",
    position: {
      y: 65,
    },
    list: ["/live2d/iio/iio.model.json"],
  },
  /* {
    // 加载 网络错误
    list: ["/live2d/yukari_/live2d/yukari_model.model.json"],
  }, */
  {
    name: "fox",
    position: {
      y: -65,
    },
    list: ["/live2d/fox/model.json"],
  },
  {
    name: "himeko",
    position: {
      x: -90,
    },
    list: ["/live2d/himeko/model.json"],
  },
  {
    name: "kiana",
    position: {
      x: -30,
    },
    list: ["/live2d/kiana/model.json"],
  },
  {
    name: "redeemer",
    position: {
      x: -50,
      y: 20,
    },
    list: ["/live2d/redeemer/model.json"],
  },
  {
    name: "sakura",
    position: {
      x: -40,
      y: 10,
    },
    list: ["/live2d/sakura/model.json"],
  },
  {
    name: "seele",
    position: {
      x: -70,
    },
    list: ["/live2d/seele/model.json"],
  },
  {
    name: "sin",
    position: {
      y: -35,
    },
    list: ["/live2d/sin/model.json"],
  },
  {
    name: "theresa",
    scale: 0.8,
    position: {
      x: -60,
      y: -70,
    },
    list: ["/live2d/theresa/model.json"],
  },
  {
    name: "illyasviel",
    position: {
      y: -180,
    },
    stretch: {
      height: 1.8,
    },
    list: ["/live2d/illyasviel/illyasviel.model.json"],
  },
  {
    name: "88type_1809",
    list: [
      "/live2d/dollsfrontline/88type_1809/normal/model.json",
      "/live2d/dollsfrontline/88type_1809/destroy/model.json",
    ],
  },
  {
    name: "ags-30",
    list: ["/live2d/dollsfrontline/ags-30/model.json"],
  },
  {
    name: "armor",
    list: [
      "/live2d/dollsfrontline/armor/model1.json",
      "/live2d/dollsfrontline/armor/model2.json",
      "/live2d/dollsfrontline/armor/model3.json",
    ],
  },
  {
    name: "command",
    list: [
      "/live2d/dollsfrontline/command/model1.json",
      "/live2d/dollsfrontline/command/model2.json",
      "/live2d/dollsfrontline/command/model3.json",
    ],
  },
  {
    name: "dsr50_1801",
    position: {
      x: -30,
    },
    list: [
      "/live2d/dollsfrontline/dsr50_1801/normal/model.json",
      "/live2d/dollsfrontline/dsr50_1801/destroy/model.json",
    ],
  },
  {
    name: "fortress",
    position: {
      y: 30,
    },
    list: [
      "/live2d/dollsfrontline/fortress/model1.json",
      "/live2d/dollsfrontline/fortress/model2.json",
      "/live2d/dollsfrontline/fortress/model3.json",
    ],
  },
  {
    name: "gelina",
    scale: 0.8,
    position: {
      y: -70,
      x: -40,
    },
    list: ["/live2d/dollsfrontline/gelina/normal/model.json"],
  },
  {
    name: "golden",
    list: [
      "/live2d/dollsfrontline/golden/model1.json",
      "/live2d/dollsfrontline/golden/model2.json",
      "/live2d/dollsfrontline/golden/model3.json",
    ],
  },
  {
    name: "grizzly_2102",
    position: {
      x: -40,
    },
    list: [
      "/live2d/dollsfrontline/grizzly_2102/normal/model.json",
      "/live2d/dollsfrontline/grizzly_2102/destroy/model.json",
    ],
  },
  {
    name: "kp31_3101",
    position: {
      x: -30,
    },
    list: [
      "/live2d/dollsfrontline/kp31_3101/normal/model.json",
      "/live2d/dollsfrontline/kp31_3101/destroy/model.json",
    ],
  },
  {
    name: "mlemk1_604",
    position: {
      x: -60,
    },
    list: ["/live2d/dollsfrontline/mlemk1_604/normal/model.json"],
  },
  {
    name: "mlemk1_604",
    list: ["/live2d/dollsfrontline/mlemk1_604/destroy/model.json"],
  },
  {
    name: "vector_1901",
    list: [
      "/live2d/dollsfrontline/vector_1901/normal/model.json",
      "/live2d/dollsfrontline/vector_1901/destroy/model.json",
    ],
  },
  {
    name: "date_16",
    position: {
      y: 20,
      x: -30,
    },
    list: [
      "/live2d/date_16/date_16.model.json",
      "/live2d/hallo_16/hallo_16.model.json",
    ],
  },
  {
    name: "kanzaki",
    scale: 0.7,
    position: {
      y: -140,
      x: -40,
    },
    stretch: {
      height: 1.1,
    },
    list: ["/live2d/kanzaki/kanzaki.model.json"],
  },
  {
    name: "kuroko",
    position: {
      y: -120,
      x: -10,
    },
    scale: 0.9,
    stretch: {
      height: 1.1,
    },
    list: ["/live2d/kuroko/kuroko.model.json"],
  },
  {
    name: "len",
    position: {
      y: -140,
      x: -50,
    },
    scale: 0.8,
    stretch: {
      height: 1.2,
    },
    list: [
      "/live2d/len/len.model.json",
      "/live2d/len_impact/len_impact.model.json",
      "/live2d/len_space/len_space.model.json",
      "/live2d/len_swim/len_swim.model.json",
    ],
  },
  {
    name: "ryoufuku",
    position: {
      x: -80,
      y: -60,
    },
    list: ["/live2d/ryoufuku/ryoufuku.model.json"],
  },
  {
    name: "saten",
    position: {
      y: -100,
      x: -30,
    },
    scale: 0.8,
    stretch: {
      height: 1.1,
    },
    list: ["/live2d/saten/saten.model.json"],
  },
  {
    name: "seifuku",
    position: {
      x: -70,
      y: -70,
    },
    list: ["/live2d/seifuku/seifuku.model.json"],
  },
  {
    name: "shifuku",
    position: {
      x: -66,
      y: -65,
    },
    list: [
      "/live2d/shifuku/shifuku.model.json",
      "/live2d/shifuku2/shifuku2.model.json",
    ],
  },
  {
    name: "uiharu",
    position: {
      y: -120,
      x: -30,
    },
    scale: 0.8,
    stretch: {
      height: 1.1,
    },
    list: ["/live2d/uiharu/uiharu.model.json"],
  },
  {
    name: "wed_16",
    position: {
      x: -40,
      y: 15,
    },
    list: ["/live2d/wed_16/wed_16.model.json"],
  },
  {
    name: "z16",
    position: {
      x: -70,
    },
    list: ["/live2d/z16/z16.model.json"],
  },
  {
    name: "sagiri",
    position: {
      x: -70,
    },
    list: ["/live2d/sagiri/sagiri.model.json"],
  },
  {
    name: "makoto0",
    position: {
      x: -50,
      y: 10,
    },
    list: ["/live2d/makoto0/makoto0.model.json"],
  },
  {
    name: "penchan",
    list: ["/live2d/penchan/penchan.model.json"],
  },
  {
    name: "bronya_1",
    list: ["/live2d/bronya_1/model.json"],
  },
  {
    name: "nepgear",
    position: {
      y: -220,
    },
    scale: 0.9,
    stretch: {
      height: 1.5,
    },
    list: [
      "/live2d/HyperdimensionNeptunia/nepgear/index.json",
      "/live2d/HyperdimensionNeptunia/nepgearswim/index.json",
      "/live2d/HyperdimensionNeptunia/nepgear_extra/index.json",
    ],
  },
  {
    name: "haruto",
    position: {
      x: -40,
    },
    list: ["/live2d/haruto/haruto.model.json"],
  },
  {
    name: "hibiki",
    position: {
      x: -80,
    },
    list: ["/live2d/hibiki/hibiki.model.json"],
  },
  {
    name: "index",
    position: {
      y: -90,
      x: -10,
    },
    scale: 0.9,
    stretch: {
      height: 1.3,
    },
    list: ["/live2d/index/model.json"],
  },
  {
    name: "YuzukiYukari",
    position: {
      x: -50,
    },
    list: ["/live2d/YuzukiYukari/YuzukiYukari.model.json"],
  },
  {
    name: "izumi",
    list: ["/live2d/izumi/izumi.model.json"],
  },
  {
    name: "murakumo",
    stretch: {
      height: 0.9,
    },
    position: {
      x: -15,
    },
    list: ["/live2d/murakumo/index.json"],
  },
  {
    name: "wanko",
    position: {
      y: 300,
      x: 50,
    },
    scale: 1.3,
    stretch: {
      height: 1.2,
    },
    list: ["/live2d/wanko/wanko.model.json"],
  },
  {
    name: "tsumiki",
    position: {
      x: -60,
      y: 20,
    },
    list: ["/live2d/tsumiki/tsumiki.model.json"],
  },
  {
    name: "unitychan",
    list: ["/live2d/unitychan/unitychan.model.json"],
  },
  {
    name: "m1928a1_1501",
    position: {
      x: -50,
      y: 10,
    },
    list: [
      "/live2d/dollsfrontline/m1928a1_1501/normal/model.json",
      "/live2d/dollsfrontline/m1928a1_1501/destroy/model.json",
    ],
  },
  {
    name: "chiaki_kitty",
    position: {
      x: -60,
    },
    list: ["/live2d/chiaki_kitty/chiaki_kitty.model.json"],
  },
  {
    name: "chitose",
    position: {
      x: -50,
    },
    list: ["/live2d/chitose/chitose.model.json"],
  },
  {
    name: "stl",
    stretch: {
      height: 1.2,
    },
    scale: 0.7,
    position: {
      x: -40,
      y: -140,
    },
    list: ["/live2d/stl/stl.model.json"],
  },
  {
    name: "touma",
    position: {
      y: -180,
      x: -40,
    },
    scale: 0.7,
    list: ["/live2d/touma/touma.model.json"],
  },
]
export const Live2d_3_ModelList: ModelOption[] = [
  {
    //✨
    name: "tianlangxing_3",
    list: ["/live2d_3/Azue Lane(JP)/tianlangxing_3/tianlangxing_3.model3.json"],
    version: 3,
  },
  {
    name: "Bismarck (Majesty of the Ironblood)",
    scale: 1.5,
    position: {
      x: 40,
      y: 60,
    },
    list: ["/live2d_3/Azue Lane(JP)/bisimai_2/bisimai_2.model3.json"],
    version: 3,
  },
  {
    name: "Ark Royal (Banquet Guardian)",
    list: [
      "/live2d_3/Azue Lane(JP)/huangjiafangzhou_3/huangjiafangzhou_3.model3.json",
    ],
    version: 3,
  },
  {
    name: "Taihou (Forbidden Feast)",
    list: ["/live2d_3/Azue Lane(JP)/dafeng_2/dafeng_2.model3.json"],
    version: 3,
  },
  {
    // 模型会出现双手bug
    name: "Atago (Midsummer March)",
    list: ["/live2d_3/Azue Lane(JP)/aidang_2/aidang_2.model3.json"],
    version: 3,
  },
  {
    // ✨
    name: "Eldridge (New Year's Handholding)",
    list: ["/live2d_3/Azue Lane(JP)/aierdeliqi_4/aierdeliqi_4.model3.json"],
    version: 3,
  },
  {
    // ✨
    name: "Eldridge",
    position: {
      x: 40,
      y: 50,
    },
    scale: 1.3,
    list: ["/live2d_3/Azue Lane(JP)/aierdeliqi_5/aierdeliqi_5.model3.json"],
    version: 3,
  },
  {
    name: "Emile Bertin (Côte d'Azur)",
    list: [
      "/live2d_3/Azue Lane(JP)/aimierbeierding_2/aimierbeierding_2.model3.json",
    ],
    version: 3,
  },
  {
    name: "Centaur (Undine of the Beach)",
    list: ["/live2d_3/Azue Lane(JP)/banrenma_2/banrenma_2.model3.json"],
    version: 3,
  },
  {
    scale: 1.2,
    position: {
      x: -30,
      y: 15,
    },
    name: "Belfast (Iridescent Rose)",
    list: ["/live2d_3/Azue Lane(JP)/beierfasite_2/beierfasite_2.model3.json"],
    version: 3,
  },
  {
    position: {
      y: 13,
    },
    name: "Javelin",
    list: ["/live2d_3/Azue Lane(JP)/biaoqiang/biaoqiang.model3.json"],
    version: 3,
  },
  {
    scale: 0.9,
    position: {
      x: -10,
    },
    name: "Javelin (Beach Picnic!)",
    list: ["/live2d_3/Azue Lane(JP)/biaoqiang_3/biaoqiang_3.model3.json"],
    version: 3,
  },
  {
    position: {
      x: -40,
      y: 20,
    },
    name: "Fubuki (Music Pixy)",
    list: ["/live2d_3/Azue Lane(JP)/chuixue_3/chuixue_3.model3.json"],
    version: 3,
  },
  {
    position: {
      y: 30,
    },
    name: "Deutschland (Service Time?!)",
    list: ["/live2d_3/Azue Lane(JP)/deyizhi_3/deyizhi_3.model3.json"],
    version: 3,
  },
  {
    // ✨
    name: "Unicorn (Amusement Park Date)",
    list: ["/live2d_3/Azue Lane(JP)/dujiaoshou_4/dujiaoshou_4.model3.json"],
    version: 3,
  },
  {
    // ✨
    name: "Dunkerque (Summer Sucré)",
    list: ["/live2d_3/Azue Lane(JP)/dunkeerke_2/dunkeerke_2.model3.json"],
    version: 3,
  },
  {
    name: "Honolulu (Summer Accident?!)",
    list: ["/live2d_3/Azue Lane(JP)/huonululu_3/huonululu_3.model3.json"],
    version: 3,
  },
  {
    name: "Honolulu",
    list: ["/live2d_3/Azue Lane(JP)/huonululu_5/huonululu_5.model3.json"],
    version: 3,
  },
  {
    name: "Cleveland (Gentry Knight)",
    list: ["/live2d_3/Azue Lane(JP)/kelifulan_3/kelifulan_3.model3.json"],
    version: 3,
  },
  {
    position: {
      y: 10,
    },
    name: "Laffey",
    list: ["/live2d_3/Azue Lane(JP)/lafei/lafei.model3.json"],
    version: 3,
  },
  {
    // ✨
    name: "Laffey (New Year Rabbit)",
    list: ["/live2d_3/Azue Lane(JP)/lafei_4/lafei_4.model3.json"],
    version: 3,
  },
  {
    name: "Ayanami",
    list: ["/live2d_3/Azue Lane(JP)/lingbo/lingbo.model3.json"],
    version: 3,
  },
  {
    name: "Akashi",
    list: ["/live2d_3/Azue Lane(JP)/mingshi/mingshi.model3.json"],
    version: 3,
  },
  {
    name: "Graf Zeppelin (Beachside Urd)",
    list: ["/live2d_3/Azue Lane(JP)/qibolin_2/qibolin_2.model3.json"],
    version: 3,
  },
  {
    name: "St. Louis (Splendor of Spring)",
    list: ["/live2d_3/Azue Lane(JP)/shengluyisi_2/shengluyisi_2.model3.json"],
    version: 3,
  },
  {
    name: "St. Louis (Tipsy Snow)",
    list: ["/live2d_3/Azue Lane(JP)/shengluyisi_3/shengluyisi_3.model3.json"],
    version: 3,
  },
  {
    name: "Tai Yuan (Clamorous Tortoise)",
    list: ["/live2d_3/Azue Lane(JP)/taiyuan_2/taiyuan_2.model3.json"],
    version: 3,
  },
  {
    name: "Tirpitz (Snow-melting Summer)",
    list: ["/live2d_3/Azue Lane(JP)/tierbici_2/tierbici_2.model3.json"],
    version: 3,
  },
  {
    name: "Yukikaze",
    list: ["/live2d_3/Azue Lane(JP)/xuefeng/xuefeng.model3.json"],
    version: 3,
  },
  {
    // ✨
    name: "Ibuki (Wish of a Snow Goddess)",
    list: ["/live2d_3/Azue Lane(JP)/yichui_2/yichui_2.model3.json"],
    version: 3,
  },
  {
    position: {
      y: 10,
    },
    name: "Z23",
    list: ["/live2d_3/Azue Lane(JP)/z23/z23.model3.json"],
    version: 3,
  },
  {
    // ✨
    name: "Z46 (First Summer)",
    list: ["/live2d_3/Azue Lane(JP)/z46_2/z46_2.model3.json"],
    version: 3,
  },
  {
    name: "Gneisenau",
    list: ["/live2d_3/Azue Lane(JP)/genaisennao_2/genaisennao_2.model3.json"],
    version: 3,
  },
  {
    // ✨
    name: "Black Prince",
    list: ["/live2d_3/Azue Lane(JP)/heitaizi_2/heitaizi_2.model3.json"],
    version: 3,
  },
  {
    position: {
      x: 50,
      y: 30,
    },
    name: "Ning Hai",
    list: ["/live2d_3/Azue Lane(JP)/ninghai_4/ninghai_4.model3.json"],
    version: 3,
  },
  {
    name: "Ping Hai",
    list: ["/live2d_3/Azue Lane(JP)/pinghai_4/pinghai_4.model3.json"],
    version: 3,
  },
  {
    name: "Admiral Graf Spee",
    list: ["/live2d_3/Azue Lane(JP)/sipeibojue_5/sipeibojue_5.model3.json"],
    version: 3,
  },
  {
    // ✨
    position: {
      y: -15,
    },
    name: "Shōkaku",
    list: ["/live2d_3/Azue Lane(JP)/xianghe_2/xianghe_2.model3.json"],
    version: 3,
  },
  {
    name: "Vampire",
    list: ["/live2d_3/Azue Lane(JP)/xixuegui_4/xixuegui_4.model3.json"],
    version: 3,
  },
  {
    name: "Zara",
    list: ["/live2d_3/Azue Lane(JP)/zhala_2/zhala_2.model3.json"],
    version: 3,
  },
]
