/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
        openId:   { type: 'string', required: true, unique: true, maxLength: 64 },
        userName: { type: 'string', required: true, unique: true, maxLength: 64 },
        password: { type: 'string', required: true, protect: true, encrypt: true, maxLength: 512 }, // 登陆密码
        salt:     { type: 'string', required: true, protect: true, encrypt: true, maxLength: 64 }, //加密盐
        nickName: { type: 'string', maxLength: 64 }, // 昵称
        avatar:   { type: 'string', defaultsTo: '', maxLength: 256 }, // 头像URL
    },
};