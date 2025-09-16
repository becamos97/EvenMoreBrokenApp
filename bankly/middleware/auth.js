/** Middleware for handling req authorization for routes. */
//fixing bug #5 with consistent token handling
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

/** Authorization Middleware: attach user info if a valid token is present.
 * Accepts either Authorization: Bearer <token> header or body._token (legacy).
 */

function authUser(req, res, next) {
  try {
    const auth = req.get("authorization");
    const token = (auth && auth.toLowerCase().startsWith("bearer ")) ? auth.slice(7).trim()
                 : (req.body && req.body._token) ? req.body._token
                 : null;
    if (token) {
      const payload = require('jsonwebtoken').verify(token, SECRET_KEY);
      req.curr_username = payload.username;
      req.curr_admin = !!payload.admin;
    }
    return next();
  } catch (err) {
    err.status = 401;
    return next(err);
  }
}

/** Requires user to be logged in */
function requireLogin(req, res, next) {
  if (req.curr_username) return next();
  return next({ status: 401, message: 'Unauthorized' });
}

/** Authentication Middleware: put user on request
 *
 * If there is a token, verify it, get payload (username/admin),
 * and store the username/admin on the request, so other middleware/routes
 * can use it.
 *
 * It's fine if there's no token---if not, don't set anything on the
 * request.
 *
 * If the token is invalid, an error will be raised.
 *
 **/


/** Requires user to be admin */
function requireAdmin(req, res, next) {
  if (req.curr_username && req.curr_admin === true) return next();
  return next({ status: 401, message: 'Unauthorized' });
}

module.exports = { authUser, requireLogin, requireAdmin };

