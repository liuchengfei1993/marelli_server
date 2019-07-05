/**
 * Article.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    title:    { type: 'string', required: true,}, //文章名称
    to:       { type: 'string', }, //被通知人
    from:     { type: 'string', }, //通知人
    text:     { type: 'string', required: true,}, //内容
    picture:  { type: 'string', defaultsTo:'' },  //图片url
    type:     { type: 'number', required: true,}, //文章类型（0:通知公告，1:工作动态，2：福利)
  },
};