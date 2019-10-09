/**
 * Emp.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    EmpName: { type: 'string', required: true, maxLength: 64 }, //员工姓名
    employeesID: { type: 'string', maxLength: 64, unique: true, }, // 员工编号
    department: { type: 'string', maxLength: 256 }, // 部门
    IDCard: { type: 'string', maxLength: 18 }, // 身份证号码
    gender: { type: 'string', }, // 性别
    difficultEmp: { type: 'boolean', defaultsTo: false }, //是否是困难员工
    excellentEmp: { type: 'boolean', defaultsTo: false }, //是否是优秀员工
  },
};