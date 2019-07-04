/**
 * AdminController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  


  /**
   * @description 登录接口
   * @param {*} req 
   * @param {*} res 
   */
  login: async function(req, res) {
    try {
      var userName = req.body.userName
      var password = req.body.password;
      var userData = null;
      sails.log.debug(userName, password)
      if (Utils.isNil(userName)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }
      if (Utils.isNil(password)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }
      try {
        userData = await Admin.find({ userName: userName })
        userData = userData[0];
      } catch (err) {
        sails.log.error(new Date().toISOString(), __filename + ":" + __line, err);
        return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
      }
      sails.log.debug(userData)
      if (Utils.isNil(userData)) {
        sails.log.info(new Date().toISOString(), __filename + ":" + __line, ResultCode.UNDEFINED_USER.msg);
        return res.feedback(ResultCode.UNDEFINED_USER.code, {}, ResultCode.UNDEFINED_USER.msg);
      }
      if (userData.password !== password) {
        sails.log.info(new Date().toISOString(), __filename + ":" + __line, ResultCode.INCORRCT_USERNAME_PWD.msg)
        return res.feedback(ResultCode.INCORRCT_USERNAME_PWD.code, {}, ResultCode.INCORRCT_USERNAME_PWD.msg)
      }
      return res.feedback(ResultCode.OK_TO_LOGIN.code,{}, ResultCode.OK_TO_LOGIN.msg)
    } catch (error) {
      sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
      return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
    }
  },

  /**
   * @description 获取员工信息
   * @param {*} req 
   * @param {*} res 
   */
  getEmpInfo:async function(req,res){
    try {
      var page = req.param('page')
      var type = req.param('type') || ''
      if (Utils.isNil(page)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }
      var findResult = null
      if (type === CONST.DIFFICULTEMP){
        try {
          findResult = await User.find({
            difficultEmp: true
          })
        } catch (error) {
          sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
          return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
        }
      } else if (type === CONST.EXCELLENTEMP){
        try {
          findResult = await User.find({
            excellentEmp: true
          })
        } catch (error) {
          sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
          return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
        }
      }else{
        try {
          findResult = await User.find()
        } catch (error) {
          sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
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
  }

};

