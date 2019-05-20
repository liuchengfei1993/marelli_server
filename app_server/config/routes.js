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

  // '/': { view: 'pages/homepage' },
  'post /user/register/:userName': { controller: 'UserController', action: 'register' },
  'post /user/login/:userName': { controller: 'UserController', action: 'login' },
  'get /user/logout/:userName': { controller: 'UserController', action: 'logout' },
  'post /user/changeLoginPwd/:userName': { controller: 'UserController', action: 'changeLoginPwd' },
  'post /user/resetLoginPwd/:userName': { controller: 'UserController', action: 'resetLoginPwd' },
  'post /user/getUserInfo/:userName': { controller: 'UserController', action: 'getUserInfo' },
  'post /user/updateNickname/:userName': { controller: 'UserController', action: 'updateNickname' },

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