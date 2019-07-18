/** @fileOverview Javascript cryptography implementation.
 *
 * Crush to remove comments, shorten variable names and
 * generally reduce transmission size.
 *
 * @author xdjiang
 * @author xdjiang
 * @author xdjiang
 */

module.exports = {

  MEMO_MAX_LENGTH: 512,

  ERR_PHONE_EXISTS: '手机号已经存在',
  ERR_EMAIL_EXISTS: '邮箱已经存在',

  // 短信验证码超时最长时间
  VERIFY_CODE_TIME_MAX: 60000 * 5,

  // 邮件验证码超时最长时间
  VERIFY_EMAIL_CODE_TIME_MAX: 60000 * 60,

  // token有效时间
  VERIFY_TOKEN_TIME_MAX: 60000 * 60,

  //验证码错误次数
  VERIFY_ERROR_TIMES: 5,

  UNION_INTRODUCTION: '工会介绍',
  DIFFICULTEMP: 0, //困难员工
  EXCELLENTEMP: 1, //优秀员工,

  //分页信息
  pagenation: {
    skip: 10,
    limit: 10,
  },

  //验证码提示信息
  TIPS: [
    { type: 0, msg: '您的注册验证码是：' },
    { type: 1, msg: '欢迎使用EGP支付，您的登录验证码是：' },
    { type: 2, msg: '欢迎使用EGP支付，您的手机解绑验证码是：' },
    { type: 3, msg: '欢迎使用EGP支付，您的手机绑定验证码是：' },
    { type: 4, msg: '欢迎使用EGP支付，您的验证码(重置登录密码)是：' },
    { type: 5, msg: '欢迎使用EGP支付，您的导入钱包验证码是：' },
    { type: 6, msg: '欢迎使用EGP支付，您的绑定银行卡验证码是：' },
    { type: 7, msg: '欢迎使用EGP支付，您的解绑银行卡验证码是：' },
    { type: 8, msg: '欢迎使用EGP支付，您的邮箱验证码是：' },
    { type: 9, msg: '欢迎使用EGP支付，您的验证码(重置交易密码)是：' },
  ],

  ARTICLE: {
    NOTICE: 0, //通知公告
    WORK_STATUS: 1, //工作动态
    WELFARE: 2, //福利
    COMPANY_PROFILE: 3 //公司简介
  },

  attachment: {
    attachment_max_byte: 1024 * 1024 * 100,
    attachment_path: '/upload'
  },
};