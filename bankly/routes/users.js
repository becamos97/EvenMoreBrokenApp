/** User related routes. */

const User = require('../models/user');
const express = require('express');
const router = new express.Router();
const ExpressError = require('../helpers/expressError');
const { authUser, requireLogin, requireAdmin } = require('../middleware/auth');

/** GET /
 *
 * Get list of users. Only logged-in users should be able to use this.
 *
 * It should return only *basic* info:
 *    {users: [{username, first_name, last_name}, ...]}
 *
 */
router.get('/', authUser, requireLogin, async function(req, res, next) {
  try {
    const users = await User.getAll();
    return res.json({ users });
  } catch (err) { return next(err); }
});



/** GET /[username]
 *
 * Get details on a user. Only logged-in users should be able to use this.
 *
 * It should return:
 *     {user: {username, first_name, last_name, phone, email}}
 *
 * If user cannot be found, return a 404 err.
 *
 */

router.get('/:username', authUser, requireLogin, async function(req, res, next) {
  try {
    const { username } = req.params;
    if (req.curr_username !== username && !req.curr_admin) {
      throw new ExpressError('Unauthorized', 401);
    }
    const user = await User.get(username);
    return res.json({ user });
  } catch (err) { return next(err); }
});

/** PATCH /[username]
 *
 * Update user. Only the user themselves or any admin user can use this.
 *
 * It should accept:
 *  {first_name, last_name, phone, email}
 *
 * It should return:
 *  {user: all-data-about-user}
 *
 * It user cannot be found, return a 404 err. If they try to change
 * other fields (including non-existent ones), an error should be raised.
 *
 */

router.patch('/:username', authUser, requireLogin, async function(req, res, next) {
  try {
    const { username } = req.params;
    if (req.curr_username !== username && !req.curr_admin) {
      throw new ExpressError('Unauthorized', 401);
    }
    delete req.body.username;
    if ('admin' in req.body && !req.curr_admin) {
  throw new ExpressError('Unauthorized', 401);
}
    const user = await User.update(username, req.body);
    return res.json({ user });
  } catch (err) { return next(err); }
});

/** DELETE /[username]
 *
 * Delete a user. Only an admin user should be able to use this.
 *
 * It should return:
 *   {message: "deleted"}
 *
 * If user cannot be found, return a 404 err.
 */

router.delete('/:username', authUser, requireAdmin, async function(req, res, next) {
  try {
    await User.delete(req.params.username); // FIXES BUG #4
    return res.json({ message: 'deleted' });
  } catch (err) { return next(err); }
});

/* Fixing bug #4 by redoing get, get/, patch and delete.*/
module.exports = router;
