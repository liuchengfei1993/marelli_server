/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {


  register: async function(req, res) {
    try {
      var userName = req.param('userName')
      var password = req.body.password
      var openId = req.body.openId
      var verifyCode = req.body.verifyCode; //验证码
      var verifyType = CONST.TIPS[0].type; //验证码类型
      if (Utils.isNil(userName)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }
      if (Utils.isNil(password)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }
      sails.log.debug(req.body.openId);
      if (Utils.isNil(openId)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }

      if (!validator.isValid('Password', password)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, userName, ResultCode.ERR_FORMAT_PASSWORD.msg);
        return res.feedback(ResultCode.ERR_FORMAT_PASSWORD.code, {}, ResultCode.ERR_FORMAT_PASSWORD.msg);
      }

      //   //接收验证码手机或邮箱必须是填写手机或邮箱
      //   if (Utils.isNil(req.session.checkInfo) || !VerifyCodeUtil.compare(userName, req.session.checkInfo)) {
      //     sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_PHONE_OR_EMAIL_DIFF.msg);
      //     return res.feedback(ResultCode.ERR_PHONE_OR_EMAIL_DIFF.code, { 'info1': req.session.checkInfo, 'uname': userName }, ResultCode.ERR_PHONE_OR_EMAIL_DIFF.msg);
      //   }

      //   if (!VerifyCodeUtil.verifyCodeIsValid(req.session.verifyCodeTime)) {
      //     sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_CODE_EXPIRED.msg);
      //     return res.feedback(ResultCode.ERR_CODE_EXPIRED.code, {}, ResultCode.ERR_CODE_EXPIRED.msg);
      //   }

      //   //验证验证码是否正确
      //   if (!VerifyCodeUtil.compare(verifyCode, req.session.verifyCode) || !VerifyCodeUtil.compare(verifyType, req.session.verifyCodeType)) {
      //     sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_INVALID_CODE.msg);
      //     return res.feedback(ResultCode.ERR_INVALID_CODE.code, {}, ResultCode.ERR_INVALID_CODE.msg);
      //   }

      //Determine whether the user is registered
      try {
        var findResult = await User.find({
          or: [
            { 'userName': userName },
            { 'openId': openId }
          ]
        }).decrypt();
      } catch (err) {
        sails.log.error(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_SYSTEM_DB.msg, err);
        return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
      }
      if (!Utils.isNil(findResult)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_USER_EXISTS.msg);
        return res.feedback(ResultCode.ERR_USER_EXISTS.code, {}, ResultCode.ERR_USER_EXISTS.msg);
      }

      var salt = Utils.getSalt()
      var password = Utils.secretHash(password, salt, password);
      var createData = null
      var number = Math.floor(Math.random() * nickName.name.length)
      var randomNickNames = nickName.name[number];
      try {
        createData = await User.create({
          userName: userName,
          openId: openId,
          password: password,
          salt: salt,
          nickName: randomNickNames
        }).fetch().decrypt()
      } catch (err) {
        sails.log.error(new Date().toISOString(), __filename + ":" + __line, err);
      }
      return res.feedback(ResultCode.OK_REGISTERED.code, createData, ResultCode.OK_REGISTERED.msg)
    } catch (err) {
      sails.log.error(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_SYSTEM_DB.msg, err);
      return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
    }
  }
};