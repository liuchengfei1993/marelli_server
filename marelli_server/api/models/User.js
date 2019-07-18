/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    // openId:       { type: 'string', required: true, unique: true, maxLength: 64 },//微信号ID
    userName:     { type: 'string', required: true, maxLength: 64 },//用户名
    password:     { type: 'string', required: true, protect: true, encrypt: true, maxLength: 512 }, // 登陆密码
    salt:         { type: 'string', required: true, protect: true, encrypt: true, maxLength: 64 }, //加密盐
    employeesID:  { type: 'string', maxLength: 64 ,unique: true,}, // 员工编号
    department:   { type: 'string', maxLength: 256 }, // 部门
    IDCard:       { type: 'string', maxLength: 18 }, // 身份证号码
    gender:       { type: 'string', }, // 性别
    phone:        { type: 'string', maxLength: 11 }, // 手机号
    difficultEmp: { type: 'boolean', defaultsTo: false }, //是否是困难员工
    excellentEmp: { type: 'boolean', defaultsTo: false }, //是否是优秀员工

  },
};