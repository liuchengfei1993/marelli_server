/**
 * Session Configuration
 * (sails.config.session)
 *
 * Use the settings below to configure session integration in your app.
 * (for additional recommended settings, see `config/env/production.js`)
 *
 * For all available options, see:
 * https://sailsjs.com/config/session
 */

module.exports.session = {

  /***************************************************************************
   *                                                                          *
   * Session secret is automatically generated when your new app is created   *
   * Replace at your own risk in production-- you will invalidate the cookies *
   * of your users, forcing them to log in again.                             *
   *                                                                          *
   ***************************************************************************/
  secret: '68607cb9f236a83facaa0aa587fc1e91',


  /***************************************************************************
   *                                                                          *
   * Customize when built-in session support will be skipped.                 *
   *                                                                          *
   * (Useful for performance tuning; particularly to avoid wasting cycles on  *
   * session management when responding to simple requests for static assets, *
   * like images or stylesheets.)                                             *
   *                                                                          *
   * https://sailsjs.com/config/session                                       *
   *                                                                          *
   ***************************************************************************/
  // isSessionDisabled: function (req){
  //   return !!req.path.match(req._sails.LOOKS_LIKE_ASSET_RX);
  // },
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  },

  adapter: 'redis',

  host: 'localhost',
  port: 6379,
  db: 1,

  isSessionDisabled: function(req) {
    if (req.path.match(/^\/official\//)) {
      return false;
    }
    // Otherwise, disable session for all requests that look like assets.
    return !!req.path.match(req._sails.LOOKS_LIKE_ASSET_RX);
  }
};