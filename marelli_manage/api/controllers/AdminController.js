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
      if (Utils.isNil(userData)) {
        sails.log.info(new Date().toISOString(), __filename + ":" + __line, ResultCode.UNDEFINED_USER.msg);
        return res.feedback(ResultCode.UNDEFINED_USER.code, {}, ResultCode.UNDEFINED_USER.msg);
      }
      if (userData.password !== password) {
        sails.log.info(new Date().toISOString(), __filename + ":" + __line, ResultCode.INCORRCT_USERNAME_PWD.msg)
        return res.feedback(ResultCode.INCORRCT_USERNAME_PWD.code, {}, ResultCode.INCORRCT_USERNAME_PWD.msg)
      }
      req.session.user = userData
      var userName = {
        userName: userData.userName
      }
      return res.feedback(ResultCode.OK_TO_LOGIN.code, userName, ResultCode.OK_TO_LOGIN.msg)
    } catch (error) {
      sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
      return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
    }
  },

  /**
   * @description： 登出
   * @param {*} req 
   * @param {*} res 
   */
  logout: async function(req, res) {
    req.session.user = null;
    req.session.ip = null;
    req.session.deviceType = null
    req.session.destroy();
    return res.feedback(ResultCode.OK_TO_LOGOUT.code, {}, ResultCode.OK_TO_LOGOUT.msg)
  },

  /**
   * @description 获取员工信息
   * @param {*} req 
   * @param {*} res 
   */
  getEmpInfo: async function(req, res) {
    try {
      var page = req.param('page')
      var type = req.param('type') || ''
      if (Utils.isNil(page)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }
      var findResult = null
      if (type === CONST.DIFFICULTEMP) {
        try {
          findResult = await Emp.find({
            difficultEmp: true
          })
        } catch (error) {
          sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
          return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
        }
      } else if (type === CONST.EXCELLENTEMP) {
        try {
          findResult = await Emp.find({
            excellentEmp: true
          })
        } catch (error) {
          sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
          return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
        }
      } else {
        try {
          findResult = await Emp.find({ sort: [{ 'id': 'DESC' }] })
        } catch (error) {
          sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
          return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
        }
      }
      if (Utils.isNil(findResult)) {
        return res.feedback(ResultCode.OK_TO_GET.code, findResult, ResultCode.OK_TO_GET.msg);
      }
      var total = findResult.length
      findResult = findResult.slice((page - 1) * CONST.pagenation.skip, page * CONST.pagenation.limit);
      for (var i = 0; i < findResult.length; i++) {
        findResult[i] = Utils.clearPrivateInfo(findResult[i]);
      }
      var resData = {
        findResult: findResult,
        total: total
      }
      return res.feedback(ResultCode.OK_TO_GET.code, resData, ResultCode.OK_TO_GET.msg);
    } catch (error) {
      sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
      return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
    }
  },

  /**
   * @description 获取文章列表
   * @param {*} req 
   * @param {*} res 
   */
  getArticle: async function(req, res) {
    try {
      var page = req.param('page')
      var type = Number(req.param('type'))
      if (Utils.isNil(page)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }
      if (Utils.isNil(type)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }
      var findResult = null
      switch (type) {
        case CONST.ARTICLE.NOTICE:
          try {
            findResult = await Article.find({ where: { type: type, status: true }, sort: [{ 'id': 'DESC' }] })
          } catch (error) {
            sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
            return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
          }
          break;
        case CONST.ARTICLE.WORK_STATUS:
          try {
            findResult = await Article.find({ where: { type: type, status: true }, sort: [{ 'id': 'DESC' }] })
          } catch (error) {
            sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
            return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
          }
          break;
        case CONST.ARTICLE.WELFARE:
          try {
            findResult = await Article.find({ where: { type: type, status: true }, sort: [{ 'id': 'DESC' }] })
          } catch (error) {
            sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
            return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
          }
          break;
        case CONST.ARTICLE.COMPANY_PROFILE:
          try {
            findResult = await Article.find({ where: { type: type, status: true }, sort: [{ 'id': 'DESC' }] })
          } catch (error) {
            sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
            return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
          }
          break;
      }
      var total = findResult.length
      if (Utils.isNil(findResult)) {
        findResult = []
      } else {
        findResult = findResult.slice((page - 1) * CONST.pagenation.skip, page * CONST.pagenation.limit);
      }
      var resData = {
        findResult: findResult,
        total: total
      }
      return res.feedback(ResultCode.OK_TO_GET.code, resData, ResultCode.OK_TO_GET.msg);
    } catch (error) {
      sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
      return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
    }
  },

  /**
   * @description 发布修改文章
   * @param {*} req 
   * @param {*} res 
   */
  publishArticle: async function(req, res) {
    try {
      var type = req.body.type
      var title = req.body.title
      var to = req.body.to
      var from = req.body.from
      var text = req.body.text
      var pictureUrl = req.body.image || ''
      var time = req.body.time
      var id = req.body.id || '0'
      var findResult = null
      var data = {}
      type = Number(type)
      if (Utils.isNil(type)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }
      if (Utils.isNil(text)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }
      if (Utils.isNil(time)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }
      //如果类型是通知公告或者工作动态，则需要以下参数
      if (type === CONST.ARTICLE.NOTICE || type === CONST.ARTICLE.WORK_STATUS) {
        if (Utils.isNil(title)) {
          sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
          return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
        }
        if (Utils.isNil(to)) {
          sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
          return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
        }
        if (Utils.isNil(type)) {
          sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
          return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
        }
        if (Utils.isNil(from)) {
          sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
          return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
        }
        data = {
          title: title,
          to: to,
          from: from,
          text: text,
          type: type,
          time: time
        }
      }
      //如果类型是公司简介
      if (type === CONST.ARTICLE.COMPANY_PROFILE) {
        if (Utils.isNil(to)) {
          sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
          return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
        }
        if (Utils.isNil(type)) {
          sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
          return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
        }
        if (Utils.isNil(from)) {
          sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
          return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
        }
        data = {
          title: CONST.UNION_INTRODUCTION,
          to: '',
          from: '',
          text: text,
          type: type,
          time: time
        }
      }
      //如果类型是福利
      if (type === CONST.ARTICLE.WELFARE) {
        if (Utils.isNil(title)) {
          sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
          return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
        }
        if (Utils.isNil(to)) {
          sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
          return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
        }
        if (Utils.isNil(type)) {
          sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
          return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
        }
        if (Utils.isNil(from)) {
          sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
          return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
        }
        if (Utils.isNil(pictureUrl)) {
          sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
          return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
        }
        var newPath = await Utils.moveImg(pictureUrl)
      }
      data = {
        title: title,
        to: to,
        from: from,
        text: text,
        picture: newPath,
        type: type,
        time: time
      }

      //查看数据库是否有相同的标题或者相同的id的数据
      try {
        findResult = await Article.find({ title: title, id: id })
      } catch (error) {
        sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
        return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
      }
      //如果没有则创建新的数据
      if (Utils.isNil(findResult[0])) {
        try {
          await Article.create(data)
        } catch (error) {
          sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
          return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
        }
        return res.feedback(ResultCode.OK_TO_PUBLIC.code, findResult, ResultCode.OK_TO_PUBLIC.msg)
      }
      if (!Utils.isNil(findResult[0])) {
        try {
          await Article.update({ id: id }, data)
        } catch (error) {
          sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
          return res.feedback(ResultCode.ERR_SYSTEM_DB.code, findResult, ResultCode.ERR_SYSTEM_DB.msg);
        }
        return res.feedback(ResultCode.OK_TO_AMEND.code, {}, ResultCode.OK_TO_AMEND.msg)
      }
    } catch (error) {
      sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
      return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
    }
  },

  /**
   * @description 删除文章（并不是删掉数据库数据，而是让前端获取不到）
   * @param {*} req 
   * @param {*} res 
   */
  deleteArticle: async function(req, res) {
    try {
      var title = req.body.title;
      if (Utils.isNil(title)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }
      try {
        await Article.update({ title: title }).set({ status: false })
      } catch (error) {
        sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
        return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
      }
      return res.feedback(ResultCode.OK_TO_DELETE.code, {}, ResultCode.OK_TO_DELETE.msg)
    } catch (error) {
      sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
      return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
    }
  },
  /**
   * @description:文件上传接口
   * @param {*} req 
   * @param {*} res 
   */
  uploadImage: function(req, res) {
    try {
      var file = req.file('image').on('error', () => {
        // sails.log.error(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_TO_UPLOAD.msg);
        // return res.feedback(ResultCode.ERR_TO_UPLOAD.code, {}, ResultCode.ERR_TO_UPLOAD.msg);
      });
      if (!file._files[0]) {
        sails.log.error(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_TO_UPLOAD.msg);
        return res.feedback(ResultCode.ERR_TO_UPLOAD.code, {}, ResultCode.ERR_TO_UPLOAD.msg);
      }
      var name = req.body.fileName
      var ext = name.substring(name.lastIndexOf("."));
      req.file('image').upload({
        // don't allow the total upload size to exceed ~10MB
        maxBytes: CONST.attachment.attachment_max_byte,
        //存入指定的文件夹
        dirname: sails.config.appPath + CONST.attachment.attachment_path,
        saveAs: Utils.rndNum(9) + ext
      }, function whenDone(err, uploadedFiles) {
        if (err) {
          sails.log.error(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_TO_UPLOAD.msg);
          return res.feedback(ResultCode.ERR_TO_UPLOAD.code, {}, ResultCode.ERR_TO_UPLOAD.msg);
        }
        // If no files were uploaded, respond with an error.
        if (uploadedFiles.length === 0) {
          sails.log.error(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_TO_UPLOAD.msg);
          return res.feedback(ResultCode.ERR_TO_UPLOAD.code, {}, ResultCode.ERR_TO_UPLOAD.msg);
        }
        //判断文件类型是否是jpg和png
        for (var i in uploadedFiles) {
          var type = uploadedFiles[i].type
          if ((type !== 'image/jpeg') && (type !== 'image/jpg') && (type !== 'image/png')) {
            Utils.deleteFile(uploadedFiles[i].fd)
            sails.log.error(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_TYPE_OF_FILE.msg);
            return res.feedback(ResultCode.ERR_TYPE_OF_FILE.code, uploadedFiles[i].type, ResultCode.ERR_TYPE_OF_FILE.msg);
          }
        }
        return res.feedback(ResultCode.OK_TO_UPLOAD.code, uploadedFiles, ResultCode.OK_TO_UPLOAD.msg)
      });
    } catch (err) {
      sails.log.error(new Date().toISOString(), __filename + ":" + __line, err);
      return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
    }
  },

  /**
   * @description:添加/修改员工信息接口
   * @param {*} req 
   * @param {*} res 
   */
  updateUserData: async function(req, res) {
    try {
      var data = req.body;
      var employeesID = data.employeesID; // 员工编号
      var department = data.department; // 部门
      var IDCard = data.IDCard; // 身份证号码
      var gender = data.gender; // 性别
      var phone = data.phone; // 手机号
      var id = data.id; // id
      var EmpName = data.EmpName //姓名
      var difficultEmp = data.difficultEmp; //是否是困难员工
      var excellentEmp = data.excellentEmp; //是否是优秀员工
      // if (Utils.isNil(difficultEmp)) {
      //   sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
      //   return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      // }
      // if (Utils.isNil(excellentEmp)) {
      //   sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
      //   return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      // }
      if (Utils.isNil(id)) {
        if (Utils.isNil(EmpName)) {
          sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
          return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
        }
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
        try {
          var findResult = await Emp.find({
            or: [
              { 'employeesID': employeesID },
            ]
          })
        } catch (err) {
          sails.log.error(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_SYSTEM_DB.msg, err);
          return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
        }
        if (!Utils.isNil(findResult)) {
          sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_USER_EXISTS.msg);
          return res.feedback(ResultCode.ERR_USER_EXISTS.code, {}, ResultCode.ERR_USER_EXISTS.msg);
        }
        try {
          createData = await Emp.create({
            EmpName: EmpName,
            employeesID: employeesID,
            department: department,
            IDCard: IDCard,
            gender: gender,
            phone: phone,
            excellentEmp: excellentEmp,
            difficultEmp: difficultEmp
          }).fetch()
          return res.feedback(ResultCode.OK_TO_ADD.code, {}, ResultCode.OK_TO_ADD.msg)
        } catch (error) {
          sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
          return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
        }
      } else {
        try {
          var resData = await Emp.update({ id: id }).set({
            EmpName: EmpName,
            employeesID: employeesID,
            department: department,
            IDCard: IDCard,
            gender: gender,
            phone: phone,
            excellentEmp: excellentEmp,
            difficultEmp: difficultEmp
          }).fetch()
          return res.feedback(ResultCode.OK_TO_AMEND.code, {}, ResultCode.OK_TO_AMEND.msg)
        } catch (error) {
          sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
          return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
        }
      }
    } catch (err) {
      sails.log.error(new Date().toISOString(), __filename + ":" + __line, err);
      return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
    }
  },

  /**
   * @description 删除员工
   * @param {*} req 
   * @param {*} res 
   */
  deleteEmp: async function(req, res) {
    try {
      var id = req.body.id
      // sails.log.debug(id)
      if (Utils.isNil(id)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }
      try {
        var resData = await Emp.destroy({ id: id }).fetch()
      } catch (error) {
        sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
        return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
      }
      // sails.log.debug("resData", resData)
      return res.feedback(ResultCode.OK_TO_DELETE.code, {}, ResultCode.OK_TO_DELETE.msg)
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
  getLawyerInfo: async function(req, res) {
    try {
      var page = req.param('page')
      if (Utils.isNil(page)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }
      try {
        var findResult = await Lawyer.find()
        findResult = findResult.reverse()
      } catch (error) {
        sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
        return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
      }
      var total = findResult.length
      if (Utils.isNil(findResult)) {
        findResult = []
      } else {
        findResult = findResult.slice((page - 1) * CONST.pagenation.skip, page * CONST.pagenation.limit);
      }
      var resData = {
        findResult: findResult,
        total: total
      }
      return res.feedback(ResultCode.OK_TO_GET.code, resData, ResultCode.OK_TO_GET.msg);
    } catch (error) {
      sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
      return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
    }
  },


  /**
   * @description 删除律师信息
   * @param {*} req 
   * @param {*} res 
   */
  deleteLawyer: async function(req, res) {
    try {
      // sails.log.debug(req.body)
      var id = req.body.id
      if (Utils.isNil(id)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }
      try {
        await Lawyer.destroy({ id: id })
      } catch (error) {
        sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
        return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
      }
      return res.feedback(ResultCode.OK_TO_DELETE.code, {}, ResultCode.OK_TO_DELETE.msg)
    } catch (error) {
      sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
      return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
    }
  },

  /**
   * @description 添加或修改律师信息
   * @param {*} req 
   * @param {*} res 
   */
  updateLawyer: async function(req, res) {
    try {
      var id = req.body.id
      var lawyerName = req.body.lawyerName
      var gender = req.body.gender
      var phone = req.body.phone
      var email = req.body.email
      if (Utils.isNil(id)) {
        if (Utils.isNil(lawyerName)) {
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
        if (Utils.isNil(email)) {
          sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
          return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
        }
        try {
          await Lawyer.create({
            lawyerName: lawyerName,
            gender: gender,
            phone: phone,
            email: email
          })
        } catch (error) {
          sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
          return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
        }
        return res.feedback(ResultCode.OK_TO_ADD.code, {}, ResultCode.OK_TO_ADD.msg)
      } else {
        try {
          await Lawyer.update({ id: id }).set({
            lawyerName: lawyerName,
            gender: gender,
            phone: phone,
            email: email
          })
        } catch (error) {
          sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
          return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
        }
        return res.feedback(ResultCode.OK_TO_AMEND.code, {}, ResultCode.OK_TO_AMEND.msg)
      }
    } catch (error) {
      sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
      return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
    }
  }
};