/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  // '*': true,
  AdminController: {
    login: 'noAuthSession',
    getEmpInfo: 'authSession',
    getArticle: 'authSession',
    publishArticle: 'authSession',
    uploadImage: 'authSession',
    deleteArticle: 'authSession',
    updateUserData: 'authSession',
  },
};
