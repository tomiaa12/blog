#!/usr/bin/env python3
"""Add official in-game Simplified Chinese title_zh fields to map JSON."""

from __future__ import annotations

import json
import re
from pathlib import Path

import zhconv

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data"
LOC_TABLE = DATA / "_location_table.md"

# Official / community-verified EN → 繁中（再转简中）
SHRINES = {
    "Bosh Kala Shrine": "瓦希·辽科神庙",
    "Ha Dahamar Shrine": "哈尤·达玛神庙",
    "Hila Rao Shrine": "席罗·席拉神庙",
    "Shee Venath Shrine": "希贝·尼亚斯神庙",
    "Shee Vaneer Shrine": "希贝·尼罗斯神庙",
    "Ree Dahee Shrine": "利·达席神庙",
    "Ta'loh Naeg Shrine": "塔罗·尼席神庙",
    "Lakna Rokee Shrine": "拉纳·罗基神庙",
    "Toto Sah Shrine": "托托·伊萨神庙",
    "Myahm Agana Shrine": "米亚马·迦纳神庙",
    "Mezza Lo Shrine": "米兹·耀神庙",
    "Tahno O'ah Shrine": "塔诺·阿神庙",
    "Chaas Qeta Shrine": "洽斯·科塔神庙",
    "Jitan Sa'mi Shrine": "吉塔·萨米神庙",
    "Dow Na'eh Shrine": "达乌·纳艾神庙",
    "Kam Urog Shrine": "卡姆·尤奥神庙",
    "Ne'ez Yohma Shrine": "奈兹·耀玛神庙",
    "Rucco Maag Shrine": "鲁克·玛神庙",
    "Soh Kofi Shrine": "萨奥·科席神庙",
    "Kah Mael Shrine": "卡·姆神庙",
    "Kaya Wan Shrine": "卡亚·米瓦神庙",
    "Sheh Rata Shrine": "协莫·拉塔神庙",
    "Daka Tuss Shrine": "达塔·库斯神庙",
    "Shai Yota Shrine": "希·尤塔神庙",
    "Dagah Keek Shrine": "达·基基神庙",
    "Yah Rin Shrine": "亚奥·玛耀神庙",
    "Qukah Nata Shrine": "丘卡·纳塔神庙",
    "Shoda Sah Shrine": "晓达·萨神庙",
    "Kah Yah Shrine": "玛·卡亚神庙",
    "Tawa Jinn Shrine": "塔瓦·吉努神庙",
    "Korgu Chideh Shrine": "库古·齐德神庙",
    "Shai Utoh Shrine": "塞伊·乌托神庙",
    "Muwo Jeem Shrine": "姆奥·吉姆神庙",
    "Shae Katha Shrine": "希·库乔夫神庙",
    "Ka'o Makagh Shrine": "卡奥·玛卡神庙",
    "Shoqa Tatone Shrine": "希·塔塔恩科神庙",
    "Pumaag Nitae Shrine": "普玛·尼特神庙",
    "Ishto Soh Shrine": "伊奥·索奥神庙",
    "Ya Naga Shrine": "亚·纳加神庙",
    "Jee Noh Shrine": "吉诺·耀神庙",
    "Kay Noh Shrine": "克·诺伊神庙",
    "Dako Tah Shrine": "达科·塔瓦神庙",
    "Suma Sahma Shrine": "斯玛·萨玛神庙",
    "Daqo Chisay Shrine": "古科·齐塞神庙",
    "Kema Zoos Shrine": "基玛·兹斯神庙",
    "Raqa Zunzo Shrine": "拉丘·乌罗神庙",
    "Hawa Koth Shrine": "哈瓦·卡伊神庙",
    "Dila Maag Shrine": "迪拉·玛神庙",
    "Tho Kayu Shrine": "托·卡尤神庙",
    "Korsh O'hu Shrine": "裘希·奥神庙",
    "Misae Suma Shrine": "密·苏神庙",
    "Kuh Takkar Shrine": "库伊·塔卡神庙",
    "Kema Kosassa Shrine": "基玛·科萨萨神庙",
    "Sho Dantu Shrine": "希·基托神庙",
    "Keeha Yoog Shrine": "基哈·乌神庙",
    "Joloo Nah Shrine": "究尼·希神庙",
    "Sasa Kai Shrine": "萨萨·卡伊神庙",
    "Rota Ooh Shrine": "鲁耀·塔乌神庙",
    "Kaam Ya'tak Shrine": "亚卡·玛塔神庙",
    "Noya Neha Shrine": "尼阿·奈阿神庙",
    "Dah Kaso Shrine": "达·卡索神庙",
    "Wahgo Katta Shrine": "瓦哥·卡塔神庙",
    "Katah Chuki Shrine": "卡塔·丘基神庙",
    "Namika Ozz Shrine": "纳米卡·奥兹神庙",
    "Saas Ko'sah Shrine": "萨斯·科萨神庙",
    "Zalta Wa Shrine": "基瓦·扎塔斯神庙",
    "Toh Yahsa Shrine": "托·雅萨神庙",
    "Mijah Rokee Shrine": "米达·罗基神庙",
    "Shae Loya Shrine": "夏奥·耀神庙",
    "Maag No'rah Shrine": "玛·诺拉神庙",
    "Sheem Dagoze Shrine": "希·达哥兹神庙",
    "Mogg Latan Shrine": "摩·拉塔尼阿神庙",
    "Akh Va'quot Shrine": "阿科·瓦塔神庙",
    "Bareeda Naag Shrine": "沃力达·诺神庙",
    "Sha Warvo Shrine": "夏·塔瓦神庙",
    "Voo Lota Shrine": "乌塔·多神庙",
    "Kah Okeo Shrine": "卡·奥裘神庙",
    "Tena Ko'sah Shrine": "提纳·裘扎神庙",
    "Hia Miu Shrine": "席亚·米乌神庙",
    "Qaza Tokki Shrine": "卡扎·托基神庙",
    "Mozo Shenno Shrine": "妙斯·希诺神庙",
    "Shada Naw Shrine": "夏达·阿达神庙",
    "Sha Gehma Shrine": "夏·格玛神庙",
    "Goma Asaagh Shrine": "迦奥玛·阿萨神庙",
    "To Quomo Shrine": "托·库摩神庙",
    "Rok Uwog Shrine": "拉·库阿神庙",
    "Maka Rah Shrine": "卡玛·拉席神庙",
    "Rin Oyaa Shrine": "利·摩纳神庙",
    "Lanno Kooh Shrine": "拉诺·库席神庙",
    "Dunba Taag Shrine": "多恩巴·塔神庙",
    "Gee Ha'rah Shrine": "诺基·米席神庙",
    "Mirro Shaz Shrine": "米罗·茨席神庙",
    "Monya Toma Shrine": "蒙亚·托玛神庙",
    "Ketoh Wawai Shrine": "基托·瓦瓦伊神庙",
    "Rona Kachta Shrine": "罗纳·卡塔神庙",
    "Daag Chokah Shrine": "达·乔卡席神庙",
    "Kuhn Sidajj Shrine": "库恩·希达吉神庙",
    "Maag Halan Shrine": "玛姆·拉诺神庙",
    "Keo Ruug Shrine": "基耀·乌神庙",
    "Tah Muhl Shrine": "塔·姆尔神庙",
    "Qua Raym Shrine": "丘·拉姆席神庙",
    "Kayra Mah Shrine": "克哈·拉玛神庙",
    "Gorae Torr Shrine": "古·阿齐托神庙",
    "Daqa Koh Shrine": "达卡·卡神庙",
    "Mo'a Keet Shrine": "摩阿·基希托神庙",
    "Shae Mo'sah Shrine": "希摩·依托塞神庙",
    "Shora Hah Shrine": "晓拉·哈神庙",
    "Sah Dahaj Shrine": "萨·达究神庙",
    "Dah Hesho Shrine": "达席·希诺神庙",
    "Katosa Aug Shrine": "卡茨·托萨神庙",
    "Ze Kasho Shrine": "吉兹·卡夫伊神庙",
    "Tutsuwa Nima Shrine": "茨茨阿·尼玛神庙",
    "Ke'nai Shakah Shrine": "科尼·希卡神庙",
    "Zuna Kai Shrine": "兹纳·卡伊神庙",
    "Tu Ka'loh Shrine": "图·卡罗神庙",
    "Ritaag Zumo Shrine": "利塔·兹摩神庙",
    "Oman Au Shrine": "玛·奥努神庙",
    "Ja Baij Shrine": "加·巴易神庙",
    "Owa Daim Shrine": "奥瓦·达伊姆神庙",
    "Keh Namut Shrine": "凯·纳穆特神庙",
    "Shrine of Resurrection": "复苏神庙",
}

EXTRA = {
    "Locations": "地点",
    "Services": "服务",
    "Collectibles": "收集品",
    "Treasure": "宝物",
    "Quests": "任务",
    "Enemies": "敌人",
    "Other": "其他",
    "Ore Deposits": "矿石",
    "Materials": "材料",
    "Creatures": "生物",
    "Area": "地区",
    "Divine Beast": "神兽",
    "Goddess Statue": "女神像",
    "Great Fairy": "大精灵",
    "Landmark": "地标",
    "Point of Interest": "兴趣点",
    "Province": "省份",
    "Raft": "木筏",
    "Region": "区域",
    "Settlement": "聚落",
    "Sheikah Tower": "希卡塔",
    "Shrine": "神庙",
    "Tech Lab": "研究所",
    "Village": "村庄",
    "Armor Shop": "防具店",
    "Dye Shop": "染色店",
    "Fang and Bone": "克尔顿的店",
    "General Store": "杂货店",
    "Hestu": "阿沅",
    "Inn": "旅馆",
    "Jewelry Shop": "珠宝店",
    "Mini-Game": "小游戏",
    "Stable": "驿站",
    "Key Item": "关键道具",
    "Korok Seed": "克洛格种子",
    "Voice Memory": "语音记忆",
    "Armor": "防具",
    "Arrow Chest": "箭矢箱",
    "Blupee": "卢米",
    "Gem": "宝石",
    "Rupees": "卢比",
    "Shield": "盾",
    "Treasure Chest": "宝箱",
    "Weapon": "武器",
    "Main Quest": "主线任务",
    "Memory": "记忆",
    "Shrine Quest": "神庙任务",
    "Side Quest": "支线任务",
    "Dragon": "龙",
    "Enemy Camp": "敌人营地",
    "Guardian": "守护者",
    "Hinox": "西诺克斯",
    "Lynel": "莱尼尔",
    "Molduga": "莫尔德拉吉克",
    "Stalnox": "骷髅西诺克斯",
    "Talus": "石像怪",
    "Wizzrobe": "法师",
    "Yiga": "依盖队",
    "Cooking Pot": "烹饪锅",
    "Journal": "日记",
    "Miscellaneous": "杂项",
    "NPC": "NPC",
    "Quest Objective": "任务目标",
    "Unique Horse": "特殊马匹",
    "Zora Monument": "卓拉石碑",
    "Luminous Stone": "夜光石矿",
    "Rare Ore Deposit": "稀有矿石",
    "Akkala": "阿卡莱",
    "Central": "中央海拉鲁",
    "Central Hyrule": "中央海拉鲁",
    "Dueling Peaks": "双子山",
    "Eldin": "奥尔汀",
    "Faron": "费罗尼",
    "Gerudo": "格鲁德",
    "Great Plateau": "初始台地",
    "Hateno": "哈特诺",
    "Hebra": "海布拉",
    "Lake": "湖",
    "Lanayru": "拉聂尔",
    "Ridgeland": "丘陵",
    "Tabantha": "塔邦挞",
    "Wasteland": "荒野",
    "Woodland": "森林",
    "Necluda": "内克尔",
    "West Necluda": "西内克尔",
    "East Necluda": "东内克尔",
    "Divine Beast Vah Ruta": "神兽瓦·鲁塔",
    "Divine Beast Vah Naboris": "神兽瓦·娜波力斯",
    "Divine Beast Vah Medoh": "神兽瓦·梅德",
    "Divine Beast Vah Rudania": "神兽瓦·鲁达尼亚",
    "Goddess Statue (Large)": "女神像（大）",
    "Goddess Statue (Small)": "女神像（小）",
    "Great Fairy Kayasa": "大精灵卡伊莎",
    "Great Fairy Tera": "大精灵泰拉",
    "Great Fairy Cotera": "大精灵科塔尔",
    "Great Fairy Mija": "大精灵米娅",
    "Hestu's Maracas": "阿沅的沙锤",
    "Travel Medallion": "传送勋章",
    "Thunder Helm (Borrowed)": "雷鸣头盔（借用）",
    "Thunder Helm": "雷鸣头盔",
    "Follow the Sheikah Slate": "希卡之石的指引",
    "The Isolated Plateau": "孤立的台地",
    "Seek Out Impa": "寻找英帕",
    "Destroy Ganon": "讨伐加农",
    "Free the Divine Beasts": "解放神兽",
    "Divine Beast Vah Ruta (completed)": "神兽瓦·鲁塔（完成）",
    "Zelda's Resentment": "塞尔达的愤懑",
    "Blades of the Yiga": "依盖队的刀刃",
    "Silent Princess": "宁静公主",
    "Farosh": "费罗龙",
    "Dinraal": "奥尔龙",
    "Naydra": "聂尔龙",
    "Enemy Camp": "敌人营地",
    "Guardian Stalker": "步行守护者",
    "Guardian Scout": "小型守护者",
    "Guardian Skywatcher": "飞行守护者",
    "Guardian Turret": "炮台守护者",
    "Decayed Guardian": "朽坏的守护者",
    "Hinox (Youngest Kin)": "西诺克斯（幼子）",
    "Hinox (Middle Kin)": "西诺克斯（次子）",
    "Hinox (Oldest Kin)": "西诺克斯（长子）",
    "Silver Lynel": "银色莱尼尔",
    "White-Maned Lynel": "白鬃莱尼尔",
    "Blue-Maned Lynel": "青鬃莱尼尔",
    "Stone Talus": "岩石巨人",
    "Stone Talus (Rare)": "岩石巨人（稀有）",
    "Stone Talus (Luminous)": "岩石巨人（夜光）",
    "Igneo Talus": "熔岩巨人",
    "Frost Talus": "冰岩巨人",
    "Giant Horse": "巨大的马",
    "Stalhorse": "骷髅马",
    "Lord of the Mountain": "山神",
    "History of the Zora, Part One": "卓拉的历史 其一",
    "History of the Zora, Part Two": "卓拉的历史 其二",
    "History of the Zora, Part Three": "卓拉的历史 其三",
    "History of the Zora, Part Four": "卓拉的历史 其四",
    "History of the Zora, Part Five": "卓拉的历史 其五",
    "History of the Zora, Part Six": "卓拉的历史 其六",
    "History of the Zora, Part Seven": "卓拉的历史 其七",
    "Luminous Stone Deposit": "夜光石矿",
    "Acorn": "橡子",
    "Ancient": "古代材料",
    "Ancient Core": "古代核心",
    "Ancient Shaft": "古代轴",
    "Ancient Gear": "古代齿轮",
    "Ancient Spring": "古代弹簧",
    "Ancient Screw": "古代螺丝",
    "Armoranth": "铠甲草",
    "Bird Egg": "鸟蛋",
    "Blue Nightshade": "夜光草",
    "Chickaloo Tree Nut": "小鸟的树果",
    "Chillshroom": "冰冷蘑菇",
    "Cool Safflina": "冰冷香草",
    "Electric Safflina": "电气香草",
    "Endura Carrot": "耐力胡萝卜",
    "Endura Shroom": "耐力蘑菇",
    "Fairy": "妖精",
    "Fleet-Lotus Seeds": "速速莲蓬",
    "Hearty Durian": "生命榴莲",
    "Hearty Radish": "生命小萝卜",
    "Hearty Raddish": "生命小萝卜",
    "Hearty Truffle": "生命松露",
    "Hydromelon": "含水蜜瓜",
    "Hylian Rice": "海利亚米",
    "Hylian Shroom": "海利亚蘑菇",
    "Hyrule Herb": "海拉鲁草",
    "Ironshroom": "坚硬蘑菇",
    "Mighty Bananas": "力量香蕉",
    "Mighty Thistle": "力量蓟",
    "Palm Fruit": "椰子",
    "Razorshroom": "锋利蘑菇",
    "Silent Shroom": "寂静蘑菇",
    "Spicy Pepper": "辛辣胡椒",
    "Stamella Shroom": "精力蘑菇",
    "Sunshroom": "暖暖蘑菇",
    "Swift Carrot": "速速胡萝卜",
    "Voltfruit": "电气水果",
    "Warm Safflina": "暖暖香草",
    "Wildberry": "野莓",
    "Zapshroom": "电气蘑菇",
    "Armored Carp": "铠甲鲤鱼",
    "Armored Porgy": "铠甲鲷鱼",
    "Bladed Rhino Beetle": "刀刃犀金龟",
    "Blue-Winged Heron": "蓝翅鹭",
    "Bright-Chested Duck": "白胸鸭",
    "Bright-Eyed Crab": "亮眼蟹",
    "Bushy-Tailed Squirrel": "尾巴松鼠",
    "Chillfin Trout": "冰冷鳟鱼",
    "Cold Darner": "冰冷蜻蜓",
    "Cucco": "咕咕鸡",
    "Donkey": "驴",
    "Eldin Ostrich": "奥尔汀鸵鸟",
    "Electric Darner": "电气蜻蜓",
    "Energetic Rhino Beetle": "精力犀金龟",
    "Fireproof Lizard": "耐火蜥蜴",
    "Grassland Fox": "草原狐狸",
    "Great-Horned Rhinoceros": "大角犀牛",
    "Grizzlemaw Bear": "灰嘴熊",
    "Hateno Cow": "哈特诺牛",
    "Hearty Bass": "生命鲈鱼",
    "Hearty Blueshell Snail": "生命蓝壳蜗牛",
    "Hearty Lizard": "生命蜥蜴",
    "Hearty Salmon": "生命鲑鱼",
    "Highland Sheep": "高原绵羊",
    "Hightail Lizard": "速速蜥蜴",
    "Honeyvore Bear": "食蜜熊",
    "Horse": "马",
    "Hot-Footed Frog": "速速青蛙",
    "Hylian Retriever": "海利亚猎犬",
    "Hyrule Bass": "海拉鲁鲈鱼",
    "Ironshell Crab": "坚硬蟹",
    "Maraudo Wolf": "荒野狼",
    "Mighty Carp": "力量鲤鱼",
    "Mighty Porgy": "力量鲷鱼",
    "Mountain Buck": "山鹿（公）",
    "Mountain Crow": "山乌鸦",
    "Mountain Doe": "山鹿（母）",
    "Mountain Goat": "山羊",
    "Pink Heron": "粉红鹭",
    "Rainbow Pigeon": "彩虹鸽",
    "Razorclaw Crab": "锋利蟹",
    "Red-Tusked Boar": "红牙野猪",
    "Restless Cricket": "精力蟋蟀",
    "Rugged Rhino Beetle": "坚硬犀金龟",
    "Sand Seal": "沙海象",
    "Sanke Carp": "三色鲤",
    "Seagull": "海鸥",
    "Sneaky River Snail": "潜行河蜗牛",
    "Snowcoat Fox": "雪衣狐狸",
    "Sparrow": "麻雀",
    "Common Sparrow": "普通麻雀",
    "Sparrow (Blue)": "蓝麻雀",
    "Blue Sparrow": "蓝麻雀",
    "Sparrow (Golden)": "金麻雀",
    "Golden Sparrow": "金麻雀",
    "Sparrow (Rainbow)": "彩虹麻雀",
    "Rainbow Sparrow": "彩虹麻雀",
    "Sparrow (Red)": "红麻雀",
    "Red Sparrow": "红麻雀",
    "Staminoka Bass": "精力鲈鱼",
    "Summerwing Butterfly": "夏翅蝴蝶",
    "Sunset Firefly": "黄昏萤火虫",
    "Tabantha Moose": "塔邦挞麋鹿",
    "Thunderwing Butterfly": "雷翅蝴蝶",
    "Tireless Frog": "精力青蛙",
    "Voltfin Trout": "电气鳟鱼",
    "Warm Darner": "暖暖蜻蜓",
    "Wasteland Coyote": "荒野郊狼",
    "Water Buffalo": "水牛",
    "White Goat": "白山羊",
    "White Pigeon": "白鸽",
    "Winterwing Butterfly": "冬翅蝴蝶",
    "Wood Pigeon": "木鸽",
    "Woodland Boar": "森林野猪",
    "Hylian Hood": "海利亚兜帽",
    "Hylian Tunic": "海利亚服",
    "Hylian Trousers": "海利亚裤子",
    "Soldier's Bow": "士兵之弓",
    "Soldier's Shield": "士兵盾",
    "Knight's Shield": "骑士盾",
    "Arrow x5": "箭×5",
    "Arrow": "箭",
    "Diamond": "钻石",
    "Ruby": "红宝石",
    "Sapphire": "蓝宝石",
    "Topaz": "黄玉",
    "Amber": "琥珀",
    "Opal": "蛋白石",
    "Gold Rupee": "金色卢比",
    "Silver Rupee": "银色卢比",
    "Purple Rupee": "紫色卢比",
    "Red Rupee": "红色卢比",
    "Blue Rupee": "蓝色卢比",
    "Green Rupee": "绿色卢比",
    "Luminous Stone": "夜光石",
    "Monument Shard": "石碑碎块",
    "Kochi Dye Shop": "科奇染色店",
    "Enchanted": "魔法服饰店",
    "Ventest Clothing Boutique": "文特斯特服装店",
    "Brazen Beak": "黄铜喙",
    "High Spirits Produce": "元气蔬果店",
    "The Curious Quiver": "奇妙箭袋",
    "Olkin's Pumpkins": "奥尔金的南瓜",
    "Swallow's Roost": "燕子之巢",
    "Shuteye Inn": "闭眼旅馆",
    "The Great Ton Pu Inn": "吨普大旅馆",
    "Starlight Memories": "星光回忆",
    "Ore and More": "矿石专卖",
    "Sand-Seal Racing": "沙海象拉力赛",
    "Gut Check Rock Challenge": "毅力崖挑战",
    "Rito Stable": "利特驿站",
    "Dueling Peaks Stable": "双子驿站",
    "Highland Stable": "高原驿站",
    "Watch Out for the Flowers": "不要践踏花儿",
    "The Stolen Heirloom": "被盗的宝珠",
    "The Crowned Beast": "两杆枪野兽",
    "Find Kheel": "寻找琪尔",
    "A Landscape of a Stable": "驿站的风景画",
    "Misko, the Great Bandit": "大盗密斯可",
    "Misko's Cave": "密斯可的洞窟",
    "Ancient Furnace": "古代炉",
    "Ancient Bridle [Inside Treasure Chest]": "古代马鞍（宝箱内）",
    "Ancient Saddle [in Treasure Chest]": "古代马鞍（宝箱内）",
    "Electric Wizzrobe": "电气法师",
    "Fire Wizzrobe": "火焰法师",
    "Ice Wizzrobe": "冰雪法师",
    "Lightning Rod": "闪电杖",
    "Yiga Blademaster": "依盖队刀客",
    "Yiga Footsoldier": "依盖队士兵",
    "Windcleaver": "风切刀",
    "Torch": "火把",
    "Forest Dweller's Bow": "森民之弓",
    "Silver Bow": "银色弓",
    "White Horse": "白马",
    "Hebra Mountains": "海布拉山脉",
    "Tabantha Tundra": "塔邦挞冻原",
    "Tabantha Frontier": "塔邦挞边境",
    "Hyrule Ridge": "海拉鲁丘陵",
    "Hyrule Field": "海拉鲁平原",
    "Great Hyrule Forest": "海拉鲁大森林",
    "Gerudo Desert": "格鲁德沙漠",
    "Gerudo Highlands": "格鲁德高地",
    "Eldin Canyon": "奥尔汀峡谷",
    "Eldin Mountains": "奥尔汀山脉",
    "Death Mountain": "死亡之山",
    "Faron Grasslands": "费罗尼草原",
    "Lanayru Great Spring": "拉聂尔大源泉",
    "Lanayru Wetlands": "拉聂尔湿地",
    "Lanayru Sea": "拉聂尔海",
    "Akkala Highlands": "阿卡莱高地",
    "Deep Akkala": "深远阿卡莱",
    "Akkala Sea": "阿卡莱海",
    "Mount Lanayru": "拉聂尔山",
    "Korok Forest": "克洛格森林",
    "Goron City": "鼓隆城",
    "Lurelin Village": "沃托里村",
    "Lorelin Village": "沃托里村",
    "Lost Woods": "迷途森林",
    "Sturnida Secret Hot Spring": "斯塔尼达秘泉",
    "Birda Lookout": "比利丁高地",
    "Spectable Rock": "眼镜岩",
    "Tabantha Canyon Course": "库库甲谷球场",
    "Arrow x10": "箭×10",
    "Bomb Arrow": "炸弹箭",
    "Bomb Arrow x5": "炸弹箭×5",
    "Bomb Arrow x10": "炸弹箭×10",
    "Shock Arrow": "电箭",
    "Shock Arrow x5": "电箭×5",
    "Shock Arrow x10": "电箭×10",
    "Fire Arrow": "火箭",
    "Ice Arrow": "冰箭",
    "Ancient Arrow": "古代兵装·箭",
    "Swallow Bow": "燕之弓",
    "Phrenic Bow": "远望弓",
    "Royal Guard's Bow": "近卫之弓",
    "Knight's Bow": "骑士之弓",
    "Royal Bow": "王族之弓",
    "Golden Bow": "黄金弓",
    "Falcon Bow": "游隼弓",
    "Great Eagle Bow": "大鹫弓",
    "Royal Shield": "王族盾",
    "Forest Dweller's Shield": "森民盾",
    "Silver Shield": "银色盾",
    "Soldier's Helm": "士兵头盔",
    "Soldier's Greaves": "士兵护腿",
    "Soldier's Armor": "士兵铠甲",
    "Stealth Mask": "潜行面罩",
    "Guardian Scout I": "小型守护者Ⅰ",
    "Guardian Scout II": "小型守护者Ⅱ",
    "Guardian Scout III": "小型守护者Ⅲ",
    "Guardian Scout IV": "小型守护者Ⅳ",
    "Big Hearty Radish": "大个生命萝卜",
    "Big Hearty Truffle": "大个生命松露",
    "Thunder Wizzrobe": "雷电法师",
    "Thunderstorm Rod": "雷暴杖",
    "Fire Rod": "火焰杖",
    "Ice Rod": "冰雪杖",
    "Giant Ancient Core": "巨大古代核心",
    "Flint": "打火石",
    "Star Fragment": "星之碎片",
    "Rock Salt": "岩盐",
    "Blue Hinox": "蓝色西诺克斯",
    "Black Hinox": "黑色西诺克斯",
    "Master Kohga": "可盖大师",
    "Duplex Bow": "双发弓",
    "Molduking": "莫尔德拉吉克王",
    "Igneo Talus Titan": "熔岩巨人王",
    "Horned Statue": "有角的石像",
    "Seabed Inn": "海床旅馆",
    "Rollin' Inn": "滚动旅馆",
    "Hotel Oasis": "绿洲旅馆",
    "Kara Kara's Inn": "卡拉卡拉旅馆",
    "East Wind": "东风杂货店",
    "Coral Reef": "珊瑚礁杂货店",
    "The Slippery Falcon": "滑隼杂货店",
    "Goron Gusto Shop": "鼓隆美食店",
    "Hammerhead": "锤头防具店",
    "Ripped and Shredded": "撕裂防具店",
    "Fashion Passion": "时尚热情",
    "Gerudo Secret Club": "格鲁德秘密俱乐部",
    "All or Nothing": "孤注一掷",
    "Obstacle Course": "障碍赛",
    "Selmie's Shield-Surfing": "丝蕾米的盾牌滑行",
    "Snowling": "滚雪球",
    "The Priceless Maracas": "无价的沙锤",
    "Wild Horses": "野生的马",
    "Flown the Coop": "咕咕鸡飞了",
    "Arrows of Burning Heat": "灼热的箭",
    "Secret of the Cedars": "三棵杉树的秘密",
    "The Spring of Wisdom": "探索拉聂尔山的宝物",
    "The Cursed Statue": "被诅咒的石像",
    "Master of the Wind": "御风拓路者",
    "Locked Mementos": "被封锁的记忆",
    "Captured Memories": "被夺走的记忆",
    "The Hero's Sword": "勇者的剑",
    "Reach Zora's Domain": "前往卓拉领地",
    "To Mount Lanayru": "前往拉聂尔山",
    "Father and Daughter": "父与女",
    "Subdued Ceremony": "沉静的仪式",
    "Resolve and Grief": "觉悟与悲伤",
    "Glowing Orb": "发光的宝珠",
    "Altar": "祭坛",
    "Vault": "金库",
    "The Horse God": "马神",
    "Stone Door": "石门",
    "Boulder": "岩石",
    "Ta'Loh Naeg Shrine": "塔罗·尼席神庙",
    "Yowaka Ita Shrine": "耀瓦卡·伊尔塔神庙",
    "Rohta Chigah Shrine": "罗希塔·奇古神庙",
    "Rohta Cigah Shrine": "罗希塔·奇古神庙",
    "Ruvo Korbah Shrine": "露奈·科力巴神庙",
    "Etsu Korima Shrine": "艾茨·科力玛神庙",
    "History of the Zora, Addendum One": "卓拉的历史 补遗其一",
    "History of the Zora, Addendum Two": "卓拉的历史 补遗其二",
    "Memoir of a Gifted Stonemason": "天才石匠的回忆录",
    "Chef Aurie Taamu, Vol. 1": "厨师奥利·塔姆 卷一",
    "Chef Aurie Taamu, Vol. 2": "厨师奥利·塔姆 卷二",
    "An Ancient Text": "古代文献",
    "Mountain Peak Log": "山顶日志",
}


def to_cn(text: str) -> str:
    return zhconv.convert(text, "zh-cn")


def parse_location_table() -> dict[str, str]:
    mapping: dict[str, str] = {}
    if not LOC_TABLE.exists():
        return mapping
    for line in LOC_TABLE.read_text(encoding="utf-8").splitlines():
        m = re.match(r"\|(\d+)\|([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)\|", line)
        if not m:
            continue
        en = m.group(4).strip()
        zh = to_cn(m.group(5).strip())
        if en and zh and en != "Location":
            mapping[en] = zh
            mapping[en.rstrip("s")] = zh
    return mapping


def build_names() -> dict[str, str]:
    names: dict[str, str] = {}
    existing = DATA / "names_zh.json"
    if existing.exists():
        names.update(json.loads(existing.read_text(encoding="utf-8")))
    names.update({k: to_cn(v) for k, v in EXTRA.items()})
    names.update({k: to_cn(v) for k, v in SHRINES.items()})
    names.update(parse_location_table())
    return names


CHEST_RE = re.compile(r"^Treasure Chest(?: \[(.+)\])?$")
STATUE_RE = re.compile(r"^Goddess Statue \((.+)\)$")
VOICE_RE = re.compile(r"^(\d{3}) (.+) Voice Memory$")


ARROW_RE = re.compile(r"^(Arrow|Bomb Arrow|Shock Arrow|Fire Arrow|Ice Arrow|Ancient Arrow) x(\d+)$")
DONE_RE = re.compile(r"^(.+) \((completed|Large|Small)\)$")


def lookup(title: str, names: dict[str, str]) -> str | None:
    if title in names:
        return names[title]
    chest = CHEST_RE.match(title)
    if chest:
        inner = chest.group(1)
        if not inner:
            return names.get("Treasure Chest")
        inner_zh = names.get(inner) or lookup(inner, names)
        if inner_zh:
            return f"宝箱〔{inner_zh}〕"
    arrow = ARROW_RE.match(title)
    if arrow:
        base = names.get(arrow.group(1))
        if base:
            return f"{base}×{arrow.group(2)}"
    done = DONE_RE.match(title)
    if done:
        base_zh = names.get(done.group(1)) or lookup(done.group(1), names)
        suffix = {"completed": "完成", "Large": "大", "Small": "小"}[done.group(2)]
        if base_zh:
            return f"{base_zh}（{suffix}）"
    statue = STATUE_RE.match(title)
    if statue:
        size = {"Large": "大", "Small": "小"}.get(statue.group(1))
        if size:
            return f"女神像（{size}）"
    if ":" in title:
        parts = [lookup(p, names) or names.get(p) for p in title.split(":")]
        if all(parts):
            return "：".join(parts)
    return None


def add_title_zh(obj: dict, names: dict[str, str], key: str = "title") -> bool:
    en = obj.get(key)
    if not isinstance(en, str) or not en:
        return False
    if re.search(r"[\u4e00-\u9fff]", en):
        return False
    zh = lookup(en, names)
    if not zh:
        return False
    obj[f"{key}_zh"] = zh
    return True


def patch_list(path: Path, names: dict[str, str], extra_keys: list[str] | None = None) -> tuple[int, int]:
    items = json.loads(path.read_text(encoding="utf-8"))
    hit = 0
    total = 0
    keys = ["title"] + (extra_keys or [])
    if isinstance(items, list):
        for item in items:
            if not isinstance(item, dict):
                continue
            for key in keys:
                if key in item:
                    total += 1
                    if add_title_zh(item, names, key):
                        hit += 1
            cats = item.get("categories")
            if isinstance(cats, list):
                for cat in cats:
                    if isinstance(cat, dict) and "title" in cat:
                        total += 1
                        if add_title_zh(cat, names):
                            hit += 1
    path.write_text(json.dumps(items, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return hit, total


def main():
    names = build_names()
    (DATA / "names_zh.json").write_text(
        json.dumps(dict(sorted(names.items())), ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    loc_hit, loc_total = patch_list(DATA / "locations.json", names)
    reg_hit, reg_total = patch_list(DATA / "regions.json", names, extra_keys=["subtitle"])
    cat_hit, cat_total = patch_list(DATA / "categories.json", names)
    print(f"names: {len(names)}")
    print(f"locations title_zh: {loc_hit}/{loc_total}")
    print(f"regions title_zh: {reg_hit}/{reg_total}")
    print(f"categories title_zh: {cat_hit}/{cat_total}")


if __name__ == "__main__":
    main()
