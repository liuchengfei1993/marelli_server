/**
 * Lawyer.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    lawyerName: { type: 'string', required: true, maxLength: 64 }, //律师姓名
    gender: { type: 'string', }, // 性别
    phone: { type: 'string', maxLength: 11 }, // 手机号
    email: { type: 'string' }
  },
};