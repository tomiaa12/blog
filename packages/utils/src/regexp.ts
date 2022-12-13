/**
 * 是否为数字
 */
export const isNumber = (val: string | number) => /^[0-9]*$/.test(val + "")

/**
 * 是否为n位数字
 */
export const isNumberLength = (val: string | number, n: number) =>
  new RegExp(`^\\d{${n}}$`).test(val + "")

/**
 * 是否为n位数字
 */
export const isAtLeastLength = (val: string | number, n: number) =>
  new RegExp(`^\\d{${n},}$`).test(val + "")

/**
 * 是否为 m 至 n 位数字
 */
export const isIntervalLength = (val: string | number, m: number, n: number) =>
  new RegExp(`^\\d{${m},${n}}$`).test(val + "")

/**
 * 零和非零开头的数字
 */
export const isZeroAndNonZero = (val: string | number) =>
  /^(0|[1-9][0-9]*)$/.test(val + "")

/**
 * 非零开头的最多带两位小数的数字
 */
export const isNonZeroAndTwoDecimalPlaces = (val: string | number) =>
  /^([1-9][0-9]*)+(.[0-9]{1,2})?$/.test(val + "")

/**
 * 带1-2位小数的正数或负数
 */
export const isNumWith1_2 = (val: string | number) =>
  /^(-)?\d+(\.\d{1,2})?$/.test(val + "")

/**
 * 正数、负数、和小数
 */
export const isPositiveAndNegativeDecimals = (val: string | number) =>
  /^(-|\+)?\d+(\.\d+)?$/.test(val + "")

/**
 * 有两位小数的正实数
 */
export const isTwoDecimalRealNumbers = (val: string | number) =>
  /^[0-9]+(.[0-9]{2})?$/.test(val + "")

/**
 * 有两位小数的正实数
 */
export const is1_3DecimalRealNumbers = (val: string | number) =>
  /^[0-9]+(.[0-9]{1,3})?$/.test(val + "")

/**
 * 非零的正整数
 */
export const isNonZeroPositiveInteger = (val: string | number) =>
  /^[1-9]\d*$/.test(val + "")

/**
 * 非零的负整数
 */
export const isNonZeroNegativeInteger = (val: string | number) =>
  /^-[1-9]\d*$/.test(val + "")

/**
 * 非负整数
 */
export const isNonNegativeInteger = (val: string | number) =>
  /^\d+$/.test(val + "")

/**
 * 非正整数
 */
export const isNonPositiveInteger = (val: string | number) =>
  /^-[1-9]\d*|0$/.test(val + "")

/**
 * 非负浮点数
 */
export const isNonNegativeFloat = (val: string | number) =>
  /^\d+(\.\d+)?$/.test(val + "")

/**
 * 非正浮点数
 */
export const isNonPositiveFloat = (val: string | number) =>
  /^((-\d+(\.\d+)?)|(0+(\.0+)?))$/.test(val + "")

/**
 * 正浮点数
 */
export const isPositiveFloat = (val: string | number) =>
  /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/.test(val + "")

/**
 * 负浮点数
 */
export const isNegativeFloat = (val: string | number) =>
  /^-([1-9]\d*\.\d*|0\.\d*[1-9]\d*)$/.test(val + "")

/**
 * 浮点数
 */
export const isFloat = (val: string | number) =>
  /^(-?\d+)(\.\d+)?$/.test(val + "")

/**
 * 中文汉字，至少输入一个
 */
export const isChinese = (val: string) => /^[\u4e00-\u9fa5]{0,}$/.test(val)

/**
 * 英文和数字
 */
export const isEnglishAndNumbers = (val: string | number) =>
  /^[A-Za-z0-9]+$/.test(val + "")

/**
 * 长度为3-20的所有字符
 */
export const is3_20Length = (val: string | number) => /^.{3,20}$/.test(val + "")

/**
 * 是英文字母
 */
export const isEnglish = (val: string) => /^[A-Za-z]+$/.test(val)

/**
 * 是大写英文字母
 */
export const isUppercaseEnglish = (val: string) => /^[A-Z]+$/.test(val)

/**
 * 是小写英文字母
 */
export const isLowercaseEnglish = (val: string) => /^[a-z]+$/.test(val)

/**
 * 数字和英文字母
 */
export const isNumbersAndEnglish = (val: string) => /^[A-Za-z0-9]+$/.test(val)

/**
 * 数字,字母,下划线
 */
export const isNumbersAndEnglishAndUnderscore = (val: string) =>
  /^\w+$/.test(val)

/**
 * 中文、英文、数字包括下划线
 */
export const isNumEngUnderChinese = (val: string) =>
  /^[\u4E00-\u9FA5A-Za-z0-9_]+$/.test(val)

/**
 * 中文、英文、数字但不包括下划线等符号
 */
export const isNumEngChinese = (val: string) =>
  /^[\u4E00-\u9FA5A-Za-z0-9]+$/.test(val)

/**
 * 输入含有^%&',;=?$\"等字符
 */
export const isSpecialCharacters = (val: string) => /[%&',;=?$\x22]+/.test(val)

/**
 * 输入含有~的字符
 */
export const isWavyLine = (val: string) => /[~\x22]+/.test(val)

/**
 * Email邮箱地址
 */
export const isEmail = (val: string) =>
  /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(val)

/**
 * URL
 */
export const isUrl = (val: string) => /[a-zA-z]+:\/\/[^\s]*/.test(val)

/**
 * 手机号码
 */
export const isPhone = (val: string | number) =>
  /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(
    val + ""
  )

/**
 * 国内电话号码
 * (0511-4405222、021-87888822)
 */
export const isDomesticCalls = (val: string | number) =>
  /\d{3}-\d{8}|\d{4}-\d{7}/.test(val + "")

/**
 * 二代身份证
 */
export const isIDCard2 = (val: string | number) =>
  /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(
    val + ""
  )

/**
 * 身份证(15位、18位数字)
 */
export const isIDCardNum = (val: string | number) =>
  /^\d{15}|\d{18}$/.test(val + "")

/**
 * 短身份证号码(数字、字母x结尾)
 */
export const isIDCard = (val: string) => /^([0-9]){7,18}(x|X)?$/.test(val)

/**
 * 帐号是否合法(字母开头，允许5-16字节，允许字母数字下划线)
 */
export const isAccountIsLegal = (val: string) =>
  /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/.test(val)

/**
 * 密码(以字母开头，长度在6~18之间，只能包含字母、数字和下划线)
 */
export const isPassword = (val: string) => /^[a-zA-Z]\w{5,17}$/.test(val)

/**
 * 强密码(必须包含大小写字母和数字的组合，不能使用特殊字符，长度在8-10之间)
 */
export const isStrongPassword = (val: string, m = 8, n = 10) =>
  new RegExp(`^(?=.*d)(?=.*[a-z])(?=.*[A-Z]).{${m},${n}}$`).test(val)

/**
 * 日期格式 2022-10-12 带有 -
 */
export const isDateFormat = (val: string) => /^\d{4}-\d{1,2}-\d{1,2}/.test(val)

/**
 * 一年的12个月(01～09和1～12)
 */
export const isMonth = (val: string) => /^(0?[1-9]|1[0-2])$/.test(val)

/**
 * 一个月的31天(01～09和1～31)
 */
export const isDay = (val: string) =>
  /^((0?[1-9])|((1|2)[0-9])|30|31)$/.test(val)

/**
 * 钱
 * 可以接受四种钱的表示："10000.00"、"10,000.00"、"10000"、"10,000"
 */
export const isMoney = (val: string) =>
  /^([0-9]+|[0-9]{1,3}(,[0-9]{3})*)(.[0-9]{1,2})?$/.test(val)

/**
 * 中国邮政编码
 */
export const isZipCode = (val: string | number) =>
  /[1-9]\d{5}(?!\d)/.test(val + "")

/**
 * IP地址
 */
export const isIP = (val: string) =>
  /((?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d))/.test(
    val
  )

/**
 * XML文件
 */
export const isXML = (val: string) =>
  /^([a-zA-Z]+-?)+[a-zA-Z0-9]+\\.[x|X][m|M][l|L]$/.test(val)

/**
 * 中文字符
 */
export const isChineseChar = (val: string) => /[\u4e00-\u9fa5]/.test(val)

/**
 * 首尾包含空白字符(包括空格、制表符、换页符等等)
 */
export const isSpaces = (val: string) => /^\s*|\s*$/.test(val)

/**
 * 腾讯QQ号(从10000开始)
 */
export const isQQ = (val: string | number) => /[1-9][0-9]{4,}/.test(val + "")

/**
 * 检查路径是否为相对路径
 * @param path 路径
 * @returns {Boolean}
 * isRelative('/foo/bar/baz'); // false
 * isRelative('C:\\foo\\bar\\baz'); // false
 * isRelative('foo/bar/baz.txt'); // true
 * isRelative('foo.md'); // true
 */
export const isRelative = (path: string): boolean =>
  !/^([a-z]+:)?[\\/]/i.test(path)

/**
 * 检查路径是否为绝对的
 * isAbsoluteUrl('https://1loc.dev'); // true
 * isAbsoluteUrl('https://1loc.dev/foo/bar'); // true
 * isAbsoluteUrl('1loc.dev'); // false
 * isAbsoluteUrl('//1loc.dev'); // false
 */
export const isAbsoluteUrl = (url: string): boolean =>
  /^[a-z][a-z0-9+.-]*:/.test(url)
