/**
 * VerifyController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  //获取验证码
  verifyCode: function(req, res) {
    //获取请求参数
    try {
      var phone = req.param('phone');
      if (Utils.isNil(phone)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }

      // var params = req.query;
      // if (Utils.isNil(params)) {
      //     sails.log.debug(new Date().toISOString(), __filename+":"+__line, ResultCode.ERR_MISS_PARAMETERS.msg);
      //     return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      // }

      // var verifyType = params.verifyType; //短信验证码类型
      // if (Utils.isNil(verifyType)) {
      //     sails.log.debug(new Date().toISOString(), __filename+":"+__line, ResultCode.ERR_MISS_PARAMETERS.msg);
      //     return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      // }

      // if (!Utils.isNumber(verifyType) || verifyType >= CONST.TIPS.length) {
      //     sails.log.debug(new Date().toISOString(), __filename+":"+__line, ResultCode.ERR_INVALID_CODE_TYPE.msg);
      //     return res.feedback(ResultCode.ERR_INVALID_CODE_TYPE.code, {}, ResultCode.ERR_INVALID_CODE_TYPE.msg);
      // }

      // if (!Utils.isNil(req.session.verifyErrorTimes) &&
      //   (req.session.verifyErrorTimes >= CONST.VERIFY_ERROR_TIMES)) {
      //   sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MAX_VERIFY_TIMES.msg);
      //   req.session.imgCodeEnable = true; //验证码错误次数超过上限，将启动图形验证码
      // }

      // var data = module.exports._enableImageCode(req, res);
      // if (data !== null) {
      //   return res.feedback(data.code, {}, data.msg);
      // }
      module.exports._sendVerifyCode(phone, res, req);
    } catch (err) {
      sails.log.error(new Date().toISOString(), __filename + ":" + __line, err);
      return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
    }
  },

  _enableImageCode: function(req, res) {
    var params = req.query;
    if (Utils.isNil(params)) {
      sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
      return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
    }

    var imgCode = params.imgCode || 0;

    // 全局启用图形验证码
    if (sails.config.imgCode.enable) {
      imgCode = '' + imgCode
      req.session.imgCode = (req.session.imgCode || 0) + '';

      if (imgCode === '0') {
        return ResultCode.ERR_MISS_IMG_CODE;
      }
      if (!VerifyCodeUtil.verifyCodeIsValid(req.session.verifyImgTime)) {
        sails.log.info(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_VERIFY_EXPIRED.msg);
        return ResultCode.ERR_VERIFY_EXPIRED;
      }

      if (imgCode.toLowerCase() !== req.session.imgCode.toLowerCase()) {
        sails.log.info(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_INVALID_CODE.msg);
        return ResultCode.ERR_INVALID_CODE;
      }
    } else {
      // 如果session启用图形验证码
      if (req.session.imgCodeEnable || false) {
        imgCode = '' + imgCode

        if (!VerifyCodeUtil.verifyCodeIsValid(req.session.verifyImgTime)) {
          sails.log.info(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_VERIFY_EXPIRED.msg);
          return ResultCode.ERR_VERIFY_EXPIRED;
        }

        if (imgCode.toLowerCase() !== req.session.imgCode.toLowerCase()) {
          sails.log.info(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_INVALID_CODE.msg);
          return ResultCode.ERR_INVALID_CODE;
        }
      }
    }
    req.session.imgCodeEnable = false;
    req.session.imgCode = null;
    return null;
  },

  _sendVerifyCode: async function(phone, res, req) {
    // if (phone.indexOf('@') === -1) {
    if (!validator.isValid('Phone', phone)) {
      sails.log.debug(new Date().toISOString(), __filename + ":" + __line, phone);
      return res.feedback(ResultCode.ERR_FORMAT_PHONE.code, {}, ResultCode.ERR_FORMAT_PHONE.msg);
    }
    // } else {
    //   if (!validator.isValid('Email', phone)) {
    //     sails.log.debug(new Date().toISOString(), __filename + ":" + __line, phone);
    //     return res.feedback(ResultCode.ERR_FORMAT_EMAIL.code, {}, ResultCode.ERR_FORMAT_EMAIL.msg);
    //   }
    // }
    var code;
    if (process.env.NODE_ENV !== "production") {
      code = 999999;
    } else {
      code = Utils.rndNum(6);
    }

    code = '' + code;

    if (phone.indexOf('@') === -1) { //发短信
      var ret = false;
      if (process.env.NODE_ENV !== "production") {
        sails.log.debug(phone, code)
        ret = await aliyunSms.sendSms(phone, code);
      } else {
        ret = await aliyunSms.sendSms(phone, code);
      }
      if (ret) {
        sails.log.error(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_SEND_VERIFY_CODE.msg, phone);
        return res.feedback(ResultCode.ERR_SEND_VERIFY_CODE.code, {}, ResultCode.ERR_SEND_VERIFY_CODE.msg);
      } else {
        req.session.verifyCode = '' + code;
        // req.session.verifyCodeType = CONST.TIPS[_type].type;
        req.session.verifyCodeTime = new Date().getTime();
        req.session.checkInfo = phone;
        // req.session.verifyErrorTimes = 0;
        return res.feedback(ResultCode.OK_SEND_CODE.code, {}, ResultCode.OK_SEND_CODE.msg);
      }
    } else { //发邮件
      var ret = await VerifyCodeUtil.sendmail(phone, CONST.MSG_CODE_TITLE, content);
      if (!ret) {
        sails.log.error(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_SEND_VERIFY_CODE.msg, phone);
        return res.feedback(ResultCode.ERR_SEND_VERIFY_CODE.code, {}, ResultCode.ERR_SEND_VERIFY_CODE.msg);
      }
      req.session.verifyCode = '' + code;
      // req.session.verifyCodeType = CONST.TIPS[_type].type;
      req.session.verifyCodeTime = new Date().getTime();
      req.session.checkInfo = phone;
      // req.session.verifyErrorTimes = 0;
      return res.feedback(ResultCode.OK_SEND_CODE.code, {}, ResultCode.OK_SEND_CODE.msg, true);
    }
  },

  //检查验证码 GET
  checkVerifyCode: function(req, res) {
    //获取请求参数
    var phone = req.param('phone');
    if (Utils.isNil(phone)) {
      sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
      return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
    }

    var params = req.query;
    if (Utils.isNil(params)) {
      sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
      return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
    }

    var verifyCode = params.verifyCode; //验证码
    // var verifyType = params.verifyType; //验证码类型

    if (Utils.isNil(verifyCode)) {
      sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
      return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
    }

    // if (Utils.isNil(verifyType)) {
    //   sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
    //   return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
    // }

    // if (!Utils.isNumber(verifyType) || verifyType >= CONST.TIPS.length) {
    //   sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_INVALID_CODE_TYPE.msg);
    //   return res.feedback(ResultCode.ERR_INVALID_CODE_TYPE.code, {}, ResultCode.ERR_INVALID_CODE_TYPE.msg);
    // }

    if (phone.indexOf('@') === -1) {
      if (!validator.isValid('Phone', phone)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, phone);
        return res.feedback(ResultCode.ERR_FORMAT_PHONE.code, {}, ResultCode.ERR_FORMAT_PHONE.msg);
      }
    } else {
      if (!validator.isValid('Email', phone)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, phone);
        return res.feedback(ResultCode.ERR_FORMAT_EMAIL.code, {}, ResultCode.ERR_FORMAT_EMAIL.msg);
      }
    }

    // 接收验证码手机或邮箱必须是填写手机或邮箱
    if (!VerifyCodeUtil.compare(phone, req.session.checkInfo)) {
      sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_PHONE_OR_EMAIL_DIFF.msg);
      return res.feedback(ResultCode.ERR_PHONE_OR_EMAIL_DIFF.code, {}, ResultCode.ERR_PHONE_OR_EMAIL_DIFF.msg);
    }

    // expired 60s
    if (phone.indexOf('@') === -1) {
      if (!VerifyCodeUtil.verifyCodeIsValid(req.session.verifyCodeTime)) {
        sails.log.info(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_VERIFY_EXPIRED.msg);
        return res.feedback(ResultCode.ERR_VERIFY_EXPIRED.code, {}, ResultCode.ERR_VERIFY_EXPIRED.msg);
      }
    } else {
      if (!VerifyCodeUtil.verifyEmailCodeIsValid(req.session.verifyCodeTime)) {
        sails.log.info(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_VERIFY_EXPIRED.msg);
        return res.feedback(ResultCode.ERR_VERIFY_EXPIRED.code, {}, ResultCode.ERR_VERIFY_EXPIRED.msg);
      }
    }

    if (!VerifyCodeUtil.compare(verifyCode, req.session.verifyCode)) {
      // req.session.verifyErrorTimes++;
      sails.log.info(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_INVALID_CODE.msg);
      return res.feedback(ResultCode.ERR_INVALID_CODE.code, {}, ResultCode.ERR_INVALID_CODE.msg);
    }
    // req.session.verifyErrorTimes = 0;
    return res.feedback(ResultCode.OK_VERIFY_CODE.code, {}, ResultCode.OK_VERIFY_CODE.msg);

  },

  imgCode: function(req, res) {
    //获取请求参数
    var svgCaptcha = require('svg-captcha');
    var type = Math.round(Math.random() * 100) % 2
    var captcha;
    var options = {
      width: 180,
      height: 65,
      size: 4 + Math.round(Math.random() * 100) % 2,
      noise: 2,
      ignoreChars: '0o1i'
    };
    if (type) {
      captcha = svgCaptcha.create(options);
    } else {
      captcha = svgCaptcha.createMathExpr(options)
    }

    req.session.imgCodeEnable = true;
    req.session.imgCode = captcha.text;
    sails.log.debug(new Date().toISOString(), __filename + ":" + __line, 'imgCode:', req.session.imgCode);
    req.session.verifyImgTime = new Date().getTime();
    return res.feedback(ResultCode.OK_SEND_CODE.code, {
      img: captcha.data
    }, ResultCode.OK_SEND_CODE.msg, true);
  },
  // 检查图形验证码
  checkImgCode: function(req, res) {
    var params = req.query;
    if (Utils.isNil(params)) {
      sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
      return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
    }
    //验证码
    var imgCode = params.imgCode;

    if (Utils.isNil(imgCode)) {
      sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
      return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
    }

    // expired 60s 和短信验证码使用相同的计时变量
    if (!VerifyCodeUtil.verifyImgCodeIsValid(req.session.verifyImgTime)) {
      sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_VERIFY_EXPIRED.msg);
      return res.feedback(ResultCode.ERR_VERIFY_EXPIRED.code, {}, ResultCode.ERR_VERIFY_EXPIRED.msg);
    }

    imgCode = '' + imgCode;
    if (!VerifyCodeUtil.compare(imgCode.toLowerCase(), req.session.imgCode.toLowerCase())) {
      sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_INVALID_CODE.msg);
      return res.feedback(ResultCode.ERR_INVALID_CODE.code, {}, ResultCode.ERR_INVALID_CODE.msg);
    }

    return res.feedback(ResultCode.OK_VERIFY_CODE.code, {}, ResultCode.OK_VERIFY_CODE.msg);
  }
};