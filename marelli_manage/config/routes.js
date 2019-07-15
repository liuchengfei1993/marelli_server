/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { view: 'pages/homepage' },
  'post /marelli_manage/admin/login/:userName':          { controller: 'AdminController', action: 'login' },
  'get  /marelli_manage/admin/getEmpInfo/:userName':     { controller: 'AdminController', action: 'getEmpInfo' },
  'get  /marelli_manage/admin/getArticle/:userName':     { controller: 'AdminController', action: 'getArticle' },
  'post /marelli_manage/admin/publishArticle/:userName': { controller: 'AdminController', action: 'publishArticle' },
  'post /marelli_manage/admin/uploadImage/:userName':    { controller: 'AdminController', action: 'uploadImage' },
  'post /marelli_manage/admin/deleteArticle/:userName':  { controller: 'AdminController', action: 'deleteArticle' },


  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
