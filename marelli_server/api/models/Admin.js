/**
 * Admin.js
 *
 * A user who can log in to this application.
 */

module.exports = {

  fetchRecordsOnUpdate: true,//覆盖模型模版设置

  attributes: {
    userName: { type: 'string', required: true, unique: true, maxLength: 64 },
    password: { type: 'string', required: true, protect: true, maxLength: 512 }, // 登陆密码
  },
};