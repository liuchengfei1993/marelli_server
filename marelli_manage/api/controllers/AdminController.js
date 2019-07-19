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
      if (Utils.isNil(userData)) {
        sails.log.info(new Date().toISOString(), __filename + ":" + __line, ResultCode.UNDEFINED_USER.msg);
        return res.feedback(ResultCode.UNDEFINED_USER.code, {}, ResultCode.UNDEFINED_USER.msg);
      }
      if (userData.password !== password) {
        sails.log.info(new Date().toISOString(), __filename + ":" + __line, ResultCode.INCORRCT_USERNAME_PWD.msg)
        return res.feedback(ResultCode.INCORRCT_USERNAME_PWD.code, {}, ResultCode.INCORRCT_USERNAME_PWD.msg)
      }
      req.session.userInfo = userData
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
          findResult = await User.find({
            difficultEmp: true
          })
        } catch (error) {
          sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
          return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
        }
      } else if (type === CONST.EXCELLENTEMP) {
        try {
          findResult = await User.find({
            excellentEmp: true
          })
        } catch (error) {
          sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
          return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
        }
      } else {
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
      var total = findResult.length
      findResult = findResult.slice((page - 1) * CONST.pagenation.skip, page * CONST.pagenation.limit);
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
      if (Utils.isNil(findResult)) {
        return res.feedback(ResultCode.OK_TO_GET.code, findResult, ResultCode.OK_TO_GET.msg);
      }
      var total = findResult.length
      findResult = findResult.slice((page - 1) * CONST.pagenation.skip, page * CONST.pagenation.limit);
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
      var picture = req.session.picture || ''
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
          time
        }
      }
      //如果类型是公司简介
      if (type === CONST.ARTICLE.COMPANY_PROFILE) {
        title = CONST.UNION_INTRODUCTION
        data = {
          title: title,
          to: '',
          from: '',
          text: text,
          type: type,
          time
        }
      }
      sails.log.debug(data)
      //如果类型是福利
      if (type === CONST.ARTICLE.WELFARE) {
        if (Utils.isNil(picture)) {
          sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
          return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
        }
        data = {
          title: title,
          to: to,
          from: from,
          text: text,
          picture: picture,
          type: type,
          time
        }
      }
      //查看数据库是否有相同的标题或者相同的id的数据
      try {
        findResult = await Article.find({
          or: [{ title: title }, { id: id }]
        })
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
        return res.feedback(ResultCode.OK_TO_PUBLIC.code, {}, ResultCode.OK_TO_PUBLIC.msg)
      }
      if (!Utils.isNil(findResult[0])) {
        try {
          await Article.update({ id: id }, data)
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
      var title = req.param('title')
      // var userName = req.param('userName')
      if (Utils.isNil(title)) {
        sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
        return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      }
      //判断type类型，写入session
      // var type = req.param('type');
      // if (Utils.isNil(type)) {
      //   sails.log.debug(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_MISS_PARAMETERS.msg);
      //   return res.feedback(ResultCode.ERR_MISS_PARAMETERS.code, {}, ResultCode.ERR_MISS_PARAMETERS.msg);
      // }
      // if (typeof(type) !== 'number') {
      //   type = parseInt(type)
      // }
      // switch (type) {
      //   case 0: //营业执照
      //     var pictureType = 'license'
      //     break
      //   case 1: //负责人手持身份证照
      //     var pictureType = 'handlePicture'
      //     break
      //   case 2: //负责人身份证正面照
      //     var pictureType = 'cardFront'
      //     break
      //   case 3: //负责人身份证反面照
      //     var pictureType = 'cardBack'
      //     break
      //   case 4: //直兑点照片
      //     var pictureType = 'picture'
      //     break
      //   case 5: //头像
      //     var pictureType = 'avatar'
      //     break
      // }
      // var ext = '.png'
      var file = req.file('image').on('error', () => {
        sails.log.error(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_TO_UPLOAD.msg);
        return res.feedback(ResultCode.ERR_TO_UPLOAD.code, {}, ResultCode.ERR_TO_UPLOAD.msg);
      });
      if (!file._files[0]) {
        sails.log.error(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_TO_UPLOAD.msg);
        return res.feedback(ResultCode.ERR_TO_UPLOAD.code, {}, ResultCode.ERR_TO_UPLOAD.msg);
      }
      var name = file._files[0].stream.filename;
      let ext = name.substring(name.lastIndexOf("."));
      req.file('image').upload({
        // don't allow the total upload size to exceed ~10MB
        maxBytes: CONST.attachment.attachment_max_byte,
        //存入指定的文件夹
        dirname: sails.config.appPath + CONST.attachment.attachment_path,
        saveAs: title + ext
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
          if (!(uploadedFiles[i].type === 'image/jpeg' || 'image/jpg' || 'image/png')) {
            sails.log.error(new Date().toISOString(), __filename + ":" + __line, ResultCode.ERR_TYPE_OF_FILE.msg);
            return res.feedback(ResultCode.ERR_TYPE_OF_FILE.code, uploadedFiles[i].type, ResultCode.ERR_TYPE_OF_FILE.msg);
          }
        }
        req.session.image = uploadedFiles[0].fd
        // if (Utils.isNil(req.session.upload)) {
        //   req.session.upload = {
        //     license: '',
        //     handlePicture: '',
        //     cardFront: '',
        //     cardBack: '',
        //     picture: '',
        //     avatar: '',
        //   }
        // }
        // switch (type) {
        //   case 0: //营业执照
        //     req.session.upload.license = uploadedFiles[0].fd
        //     break
        //   case 1: //负责人手持身份证照
        //     req.session.upload.handlePicture = uploadedFiles[0].fd
        //     break
        //   case 2: //负责人身份证正面照
        //     req.session.upload.cardFront = uploadedFiles[0].fd;
        //     break
        //   case 3: //负责人身份证反面照
        //     req.session.upload.cardBack = uploadedFiles[0].fd;
        //     break
        //   case 4: //直兑点照片
        //     req.session.upload.picture = uploadedFiles[0].fd;
        //     break
        //   case 5: //头像
        //     req.session.upload.avatar = uploadedFiles[0].fd;
        //     break
        // }
        return res.feedback(ResultCode.OK_TO_UPLOAD.code, uploadedFiles, ResultCode.OK_TO_UPLOAD.msg)
      });
    } catch (err) {
      sails.log.error(new Date().toISOString(), __filename + ":" + __line, err);
      return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
    }
  },

  /**
   * @description:修改员工信息接口
   * @param {*} req 
   * @param {*} res 
   */
  updateUserData: async function(req, res) {
    try {
      let id = req.param("id"); // id
      let data = req.body;
      // let employeesID = data.employeesID; // 员工编号
      // let department = data.department; // 部门
      // let IDCard = data.IDCard; // 身份证号码
      // let gender = data.gender; // 性别
      // let phone = data.phone; // 手机号
      let difficultEmp = data.difficultEmp; //是否是困难员工
      let excellentEmp = data.excellentEmp; //是否是优秀员工

      try {
        await User.update({ id: id }).set({ difficultEmp: difficultEmp, excellentEmp: excellentEmp })
      } catch (error) {
        sails.log.error(new Date().toISOString(), __filename + ":" + __line, error);
        return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
      }
      return res.feedback(ResultCode.OK_TO_AMEND.code, {}, ResultCode.OK_TO_AMEND.msg)
    } catch (err) {
      sails.log.error(new Date().toISOString(), __filename + ":" + __line, err);
      return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
    }
  }
};