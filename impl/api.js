import { get, post } from './http'

export const apiLogin = p => post('/auth/login', p) // 登陆
export const apiGetCode = p => post('/auth/reg_sms', p) // 验证码
export const apiRegist = p => post('/auth/reg', p) // 注册
export const apiRegistLogin = p => post('/auth/reg_login', p) // 注册并登陆
export const apiMenu = p => get('/info/funcs', p) // 菜单
export const apiremains = p => get('/info/remains', p) // 余额
export const apiExChang = p => post('/bill/exchange', p) // 兑换
export const apiExChangRate = p => get('/info/exchange_rate', p) // 获取汇率
export const apiTransfer = p => post('/bill/transfer', p) // 转账
export const apiSettingAmountRes = p => post('/bill/gen_recv_code', p) // 设置金额
export const apiScanTrans = p => get('/bill/scan_recv_code', p) // 扫码
export const apiUpdatePwd = p => post('/account/modify_pwd', p) //
export const apiRegainPwd = p => post('/auth/back_pwd', p) // 找回密码
export const apiUploadPic = p => post('/bill/upload', p) // 上传图片
export const apiNotAuthPic = p => post('/auth/download', p) // 上传图片
export const apiUpdateUserInfo = p => get('/userinfo', p) // 更新用户信息
export const apiModifyNickPic = p => post('/account/perfecting_info', p) // 完善信息 昵称或头像


export const apiUpdatePaymentPwd = p => post('/account/modify_pay_pwd', p) // 修改支付密码
export const apiCheckPhone = p => post('/auth/check_sms', p) // 验证手机号
export const apiModifyPhone = p => post('/account/modify_phone', p) // 验证手机号
export const apiGetBill = p => get('/bill/cust_bills', p) // 获取用户账单
export const apiModifyAccountNike = p => post('/account/modify_nickname', p) // 修改昵称
export const apiFindTradeRate = p => post('/bill/query_rate', p) // 修改昵称
export const apiNotifications = p => get('/info/log_app_messages', p) // 消息列表
export const apiScanTakeMoney = p => post('/bill/sweep_withdraw', p) // 扫码提现
export const apiGetTakeHistory = p => get('/bill/get_account_collect', p) // 获取转账历史账号列表
export const apiGetBillDetail = p => get('/bill/cust_order_bill', p) // 获取账单详情
export const apiModifyScanCode = p => post('/bill/modify_code_status', p) // 修改扫一扫取款吗状态
export const apiGetCard = p => get('/info/cust_payment', p) // 获取付款码支付方式列表
export const apiDefaultCard = p => post('/cust/def_card', p) // 付款码界面修改默认卡
export const apiUnread = p => post('/info/modify_app_messages_is_read', p) // 