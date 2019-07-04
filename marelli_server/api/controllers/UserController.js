/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  /**
   * @description 注册
   * @param {*} req 
   * @param {*} res 
   */
  register: async function(req, res) {
    try {
      var userName = req.param('userName')
      // var password = req.body.password
      // var openId = req.body.openId
      var employeesID = req.body.employeesID
      var department = req.body.department
      var IDCard = req.body.IDCard
      var gender = req.body.gender
      var phone = req.body.phone
      // var verifyCode = req.body.verifyCode; //验证码
      // var verifyType = CONST.TIPS[0].type; //验证码类型
      if (Utils.isNil(userName)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }
      // if (Utils.isNil(password)) {
      //   sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
      //   return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      // }
      // if (Utils.isNil(openId)) {
      //   sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
      //   return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      // }
      if (Utils.isNil(employeesID)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }
      if (Utils.isNil(department)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }
      if (Utils.isNil(IDCard)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }
      if (Utils.isNil(gender)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }
      if (Utils.isNil(phone)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }

      // if (!validator.isValid('Password', password)) {
      //   sails.log.debug(new Date().toISOString(), __filename + ":" + __line, userName, ResultCode.ERR_FORMAT_PASSWORD.msg);
      //   return res.feedback(ResultCode.ERR_FORMAT_PASSWORD.code, {}, ResultCode.ERR_FORMAT_PASSWORD.msg);
      // }

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
            // { 'openId': openId }
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

      // var salt = Utils.getSalt()
      // var password = Utils.secretHash(password, salt, password);
      var createData = null
      // var number = Math.floor(Math.random() * nickName.name.length)
      // var randomNickNames = nickName.name[number];
      try {
        createData = await User.create({
          userName: userName,
          // openId: openId,
          // password: password,
          // salt: salt,
          employeesID: employeesID,
          department: department,
          IDCard: IDCard,
          gender: gender,
          phone: phone
        }).fetch().decrypt()
      } catch (err) {
        sails.log.error(new Date().toISOString(), __filename + ":" + __line, err);
      }
      req.session.user = createData
      sails.log.debug(createData)
      return res.feedback(ResultCode.OK_REGISTERED.code, createData, ResultCode.OK_REGISTERED.msg)
    } catch (err) {
      sails.log.error(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_SYSTEM_DB.msg, err);
      return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
    }
  },

  /**
   * @description 登陆
   * @param {*} req 
   * @param {*} res 
   */
  login: async function(req, res) {
    try {
      var userName = req.param('userName');
      var password = req.body.password;
      var userData = null;
      if (Utils.isNil(userName)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }
      if (Utils.isNil(password)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }
      try {
        // var userData = await User.find({ userName: userName } || { phone: userName } || { email: userName }).decrypt()
        userData = await User.find({
          'userName': userName
        }).decrypt();
        userData = userData[0];
      } catch (err) {
        sails.log.error(new Date().toISOString(), __filename + ":" + __line, err);
        return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
      }
      if (Utils.isNil(userData)) {
        sails.log.info(new Date().toISOString(), __filename + ":" + __line, ResultCode.UNDEFINED_USER.msg);
        return res.feedback(ResultCode.UNDEFINED_USER.code, {}, ResultCode.UNDEFINED_USER.msg);
      }
      //将参数密码加密
      var decpassword = Utils.secretHash(password, userData.salt, password);
      //对比输入的密码加密后和数据库的密码是否一致
      if (userData.password !== decpassword) {
        sails.log.info(new Date().toISOString(), __filename + ":" + __line, ResultCode.INCORRCT_USERNAME_PWD.msg)
        return res.feedback(ResultCode.INCORRCT_USERNAME_PWD.code, {}, ResultCode.INCORRCT_USERNAME_PWD.msg)
      }
      //单用户检查
      // var sid = '';
      // if (req.session.deviceType === 0) {
      //   sid = userData.PCSid;
      // } else {
      //   sid = userData.mobileSid;
      // }
      // if (sid && (sid.length > 0) && (sid !== req.session.id)) {
      //   req.sessionStore.destroy(sid, async function(err, desInfo) {
      //     if (err) {
      //       sails.log.error(new Date().toISOString(), __filename + ":" + __line, err);
      //       return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
      //     }
      //     var updateInfo = {};
      //     if (req.session.deviceType === 0) {
      //       updateInfo = { 'PCSid': req.session.id };
      //     } else {
      //       updateInfo = { 'mobileSid': req.session.id };
      //     }
      //     try {
      //       userData = await User.update({ id: userData.id }, updateInfo).fetch().decrypt();
      //       userData = userData[0];
      //     } catch (err) {
      //       sails.log.error(new Date().toISOString(), __filename + ":" + __line, err);
      //       return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
      //     }
      //   });
      // }
      req.session.user = userData;
      var ret = Utils.clearPrivateInfo(userData);
      return res.feedback(ResultCode.OK_TO_LOGIN.code, ret, ResultCode.OK_TO_LOGIN.msg)
    } catch (err) {
      sails.log.error(new Date().toISOString(), __filename + ":" + __line, err);
      return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
    }
  },

  /**
   * 获取用户信息
   * @param {*} req 
   * @param {*} res 
   */
  getUserInfo: function(req, res) {
    var ret = Utils.clearPrivateInfo(req.session.user);
    return res.feedback(ResultCode.OK_USER_INFO.code, ret, ResultCode.OK_USER_INFO.msg)
  },
  /**
   * @description： 登出
   * @param {*} req 
   * @param {*} res 
   */
  logout: async function(req, res) {
    // try {
    //     var userName = req.param('userName')
    //     if (Utils.isNil(userName)) {
    //         sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
    //         return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
    //     }
    //     delete req.session.user;
    //     return res.feedback(ResultCode.OK_TO_LOGOUT.code, {}, ResultCode.OK_TO_LOGOUT.msg)
    // } catch (err) {
    //     sails.log.error(new Date().toISOString(), __filename + ":" + __line, err);
    //     return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
    // }
    req.session.user = null;
    req.session.verifyCode = null;
    req.session.verifyCodeType = null;
    req.session.checkInfo = null;
    req.session.verifyErrorTimes = 0;
    req.session.ip = null;
    req.session.destroy();
    return res.feedback(ResultCode.OK_TO_LOGOUT.code, {}, ResultCode.OK_TO_LOGOUT.msg)
  },

  /**
   * @description： 修改登录密码
   * @param {userName,oldPassword,newPassword} req 
   * @param {*} res 
   */
  changeLoginPwd: async function(req, res) {
    try {
      //获取参数并检测是否正确
      var userName = req.param('userName');
      var oldPassword = req.body.oldPassword;
      var newPassword = req.body.newPassword;
      var userData = null;
      if (Utils.isNil(userName)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }
      if (Utils.isNil(oldPassword)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }
      if (Utils.isNil(newPassword)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }

      if (!validator.isValid('Password', oldPassword)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, userName, ResultCode.ERR_FORMAT_PASSWORD.msg);
        return res.feedback(ResultCode.ERR_FORMAT_PASSWORD.code, {}, ResultCode.ERR_FORMAT_PASSWORD.msg);
      }
      if (!validator.isValid('Password', newPassword)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, userName, ResultCode.ERR_FORMAT_PASSWORD.msg);
        return res.feedback(ResultCode.ERR_FORMAT_PASSWORD.code, {}, ResultCode.ERR_FORMAT_PASSWORD.msg);
      }
      // try {
      //     var findData = await User.find({ userName: userName }).decrypt();
      // } catch (err) {
      //     sails.log.error(new Date().toISOString(), __filename + ":" + __line, err);
      //     return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
      // }
      // if (Utils.isNil(findData)) {
      //     sails.log.info(new Date().toISOString(), __filename + ":" + __line, ResultCode.UNDEFINED_USER.msg);
      //     return res.feedback(ResultCode.UNDEFINED_USER.code, {}, ResultCode.UNDEFINED_USER.msg);
      // }
      userData = req.session.user;
      oldPassword = Utils.secretHash(oldPassword, userData.salt, oldPassword);
      newPassword = Utils.secretHash(newPassword, userData.salt, newPassword);
      if (oldPassword !== userData.password) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.INCORRCT_USERNAME_PWD.msg);
        return res.feedback(ResultCode.INCORRCT_USERNAME_PWD.code, {}, ResultCode.INCORRCT_USERNAME_PWD.msg);
      }
      if (oldPassword === newPassword) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.SAME_PARAMETER.msg);
        return res.feedback(ResultCode.SAME_PARAMETER.code, {}, ResultCode.SAME_PARAMETER.msg);
      }
      try {
        userData = await User.update({ id: userData.id }).set({ password: newPassword }).fetch().decrypt();
        userData = userData[0];
      } catch (err) {
        sails.log.error(new Date().toISOString(), __filename + ":" + __line, err);
        return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
      }
      req.session.user = userData;
      var ret = Utils.clearPrivateInfo(req.session.user);
      return res.feedback(ResultCode.OK_SET.code, ret, ResultCode.OK_SET.msg)

    } catch (err) {
      sails.log.error(new Date().toISOString(), __filename + ":" + __line, err);
      return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
    }
  },

  /**
   * @description： 重置登录密码
   * @param { userName, password, verifyCode } req
   * @param {*} res 
   */
  resetLoginPwd: async function(req, res) {
    try {
      //获取参数并检测是否正确
      var userName = req.param('userName');
      var verifyCode = req.body.verifyCode;
      var password = req.body.password;
      var verifyType = CONST.TIPS[4].type; //验证码类型
      var userData = null;

      if (Utils.isNil(userName)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }

      if (Utils.isNil(password)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }

      if (Utils.isNil(verifyCode)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }

      if (!validator.isValid('Password', password)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, userName, ResultCode.ERR_FORMAT_PASSWORD.msg);
        return res.feedback(ResultCode.ERR_FORMAT_PASSWORD.code, {}, ResultCode.ERR_FORMAT_PASSWORD.msg);
      }

      //接收验证码手机或邮箱必须是填写手机或邮箱
      if (Utils.isNil(req.session.checkInfo) || !VerifyCodeUtil.compare(userName, req.session.checkInfo)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_PHONE_OR_EMAIL_DIFF.msg);
        return res.feedback(ResultCode.ERR_PHONE_OR_EMAIL_DIFF.code, {}, ResultCode.ERR_PHONE_OR_EMAIL_DIFF.msg);
      }

      if (!VerifyCodeUtil.verifyCodeIsValid(req.session.verifyCodeTime)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_CODE_EXPIRED.msg);
        return res.feedback(ResultCode.ERR_CODE_EXPIRED.code, {}, ResultCode.ERR_CODE_EXPIRED.msg);
      }

      //验证验证码是否正确
      if (!VerifyCodeUtil.compare(verifyCode, req.session.verifyCode) || !VerifyCodeUtil.compare(verifyType, req.session.verifyCodeType)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_INVALID_CODE.msg);
        return res.feedback(ResultCode.ERR_INVALID_CODE.code, {}, ResultCode.ERR_INVALID_CODE.msg);
      }

      try {
        userData = await User.find({ 'userName': userName }).decrypt();
      } catch (err) {
        sails.log.error(new Date().toISOString(), __filename + ":" + __line, err);
        return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
      }
      if (Utils.isNil(userData)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_SYSTEM_DB.msg);
        return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
      }

      userData = userData[0];
      password = Utils.secretHash(password, userData.salt, password);
      try {
        await User.update({ id: userData.id }).set({ password: password })
      } catch (err) {
        sails.log.error(new Date().toISOString(), __filename + ":" + __line, err);
        return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
      }

      req.session.verifyCode = null;
      req.session.verifyCodeType = null;
      req.session.checkInfo = null;
      req.session.verifyErrorTimes = 0;
      return res.feedback(ResultCode.OK_SET.code, {}, ResultCode.OK_SET.msg);
    } catch (err) {
      sails.log.error(new Date().toISOString(), __filename + ":" + __line, err);
      return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
    }
  },

  /**
   * @description： 昵称修改
   * @param {userName,nickName} req 
   * @param {*} res 
   */
  updateNickname: async function(req, res) {
    try {
      //获取参数并检测是否正确
      var userName = req.param('userName');
      var nickName = req.body.nickName;
      var userData = null;
      if (Utils.isNil(userName)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }
      if (Utils.isNil(nickName)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }
      if (!validator.isValid('NickName', nickName)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, userName, ResultCode.ERR_FORMAT_NICKNAME.msg);
        return res.feedback(ResultCode.ERR_FORMAT_NICKNAME.code, {}, ResultCode.ERR_FORMAT_NICKNAME.msg);
      }

      try {
        userData = await User.update({ id: req.session.user.id }).set({ nickName: nickName }).fetch().decrypt();
        userData = userData[0];
      } catch (err) {
        sails.log.error(new Date().toISOString(), __filename + ":" + __line, err);
        return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
      }
      req.session.user = userData;
      var ret = Utils.clearPrivateInfo(req.session.user);

      return res.feedback(ResultCode.OK_SET.code, ret, ResultCode.OK_SET.msg);
    } catch (err) {
      sails.log.error(new Date().toISOString(), __filename + ":" + __line, err);
      return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
    }
  },

  /**
   * @description 获取员工信息(困难员工，优秀员工)
   * @param {*} req 
   * @param {*} res 
   */
  getEmpInfo:async function(req,res){
    try {
      var userName = req.param('userName')
      var page = req.param('page')
      var empStatus = req.param('empStatus')
      if (Utils.isNil(userName)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }
      if (Utils.isNil(page)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }
      if (Utils.isNil(empStatus)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }
      var findResult = null
      if(empStatus === CONST.DIFFICULTEMP){
        try {
          findResult = await User.find({
            difficultEmp:true
          })
        } catch (error) {
          sails.log.error(new Date().toISOString(), __filename + ":" + __line, err);
          return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
        }
      }
      if(empStatus === CONST.EXCELLENTEMP){
        try {
          findResult = await User.find({
            excellentEmp: true
          })
        } catch (error) {
          sails.log.error(new Date().toISOString(), __filename + ":" + __line, err);
          return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
        }
      }
      if (Utils.isNil(findResult)) {
        return res.feedback(ResultCode.OK_TO_GET.code, findResult, ResultCode.OK_TO_GET.msg);
      }
      findResult = findResult.slice((page - 1) * CONST.pagenation.skip, page * CONST.pagenation.limit);
      var resData = {
        findResult: findResult,
        total: findResult.length
      }
      return res.feedback(ResultCode.OK_TO_GET.code, resData, ResultCode.OK_TO_GET.msg);
    } catch (error) {
      sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
      return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
    }
  },

  /**
   * @description 获取律师信息
   * @param {*} req 
   * @param {*} res 
   */
  getLawyerInfo:async function(req,res){
    try {
      var userName = req.param('userName');
      var page = req.param('page');
      if (Utils.isNil(userName)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }
      if (Utils.isNil(page)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }
      var findResult = null
      try {
        findResult = await Lawyer.find()
      } catch (error) {
        sails.log.error(new Date().toISOString(), __filename + ":" + __line, err);
        return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
      }
      if(Utils.isNil(findResult[0])){
        return res.feedback(ResultCode.OK_TO_GET.code, findResult, ResultCode.OK_TO_GET.msg);
      }
      findResult = findResult.slice((page - 1) * CONST.pagenation.skip, page * CONST.pagenation.limit);
      var resData = {
        findResult: findResult,
        total: findResult.length
      }
      return res.feedback(ResultCode.OK_TO_GET.code, resData, ResultCode.OK_TO_GET.msg);
    } catch (error) {
      sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
      return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
    }
  },

  /**
   * @description 获取通知公告，工作动态，福利等接口
   * @param {*} req 
   * @param {*} res 
   */
  getArticleInfo:async function(req,res){
    try {
      var page = req.param('page')
      var type = req.param('type')
      if (Utils.isNil(page)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }
      if (Utils.isNil(type)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }
      var findResult = null
      try {
        findResult = await Article.find({
          type:type
        })
      } catch (error) {
        sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
        return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
      }
      if (Utils.isNil(findResult[0])) {
        return res.feedback(ResultCode.OK_TO_GET.code, findResult, ResultCode.OK_TO_GET.msg);
      }
      findResult = findResult.slice((page - 1) * CONST.pagenation.skip, page * CONST.pagenation.limit);
      var resData = {
        findResult: findResult,
        total: findResult.length
      }
      return res.feedback(ResultCode.OK_TO_GET.code, resData, ResultCode.OK_TO_GET.msg);
    } catch (error) {
      sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
      return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
    }
  }
};