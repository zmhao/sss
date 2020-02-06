// 视频判断
export const VIDEOREG = /视频/

// 取消请求提示
export const CANCELREQUEST = '取消之前请求'

let arr = 'https://www.wanandroid.com/api'.split('/')
let len = arr.length

export const NGINXSIGN = arr[len - 1] || arr[len - 2]

// 密码 尾部标识
export const PASSWORDSIGN = process.env.LOGIN_KEY

export const FILE = {
  compressPackage: {
    data: ['zip', 'rar', '7-zip', 'jar', 'z'],
    errMsg: '请上传zip或rar或7-zip或jar或z文件!'
  },
  csv: {
    data: ['csv'],
    errMsg: '请上传csv文件'
  },
  xlsx: {
    data: ['xlsx'],
    errMsg: '请上传xlsx文件'
  },
  html: {
    data: ['html'],
    errMsg: '请上传html文件'
  },
  doc: {
    data: ['doc', 'docx'],
    errMsg: '请上传doc或docx文件!'
  },
  pfx: {
    data: ['pfx'],
    errMsg: '请上传pfx文件!'
  }
}

// 页面授权使用
export const NOSELECTSIGN = '00000000-0000-0000-0000-000000000000'

export const TOP_URL_NAME = '顶级'

// 中英切换需要刷新的页面
export const REFRESHURL = [
  'merc_pay_analysis', // 商户支付统计
  'transaction_analysis', // 总交易分析
  'merchants_pool', // 商户池
  'channel_transaction_statistics', //  通道交易统计
  'transaction_month', // 近一月交易分析
  'transaction_week', //  近七天交易分析
  'transaction' // 交易分析
]
