/** Auth-related routes. */
/* fixing bug #3 with proper register login and await */
const User = require('../models/user');
const express = require('express');
const router = express.Router();
const createTokenForUser = require('../helpers/createToken');


/** Register user; return token.
 *
 *  Accepts {username, first_name, last_name, email, phone, password}.
 *
 *  Returns {token: jwt-token-string}.
 *
 */
router.post('/register', async function(req, res, next) {
  try {
    const user = await User.register(req.body);
    const token = createTokenForUser(user.username, user.admin);
    return res.status(201).json({ token });
  } catch (err) { return next(err); }
});


/** Log in user; return token.
 *
 *  Accepts {username, password}.
 *
 *  Returns {token: jwt-token-string}.
 *
 *  If incorrect username/password given, should raise 401.
 *
 */
router.post('/login', async function(req, res, next) {
  try {
    const { username, password } = req.body;
    const auth = await User.authenticate(username, password); // FIXES BUG #3
    const token = createTokenForUser(auth.username, auth.admin);
    return res.json({ token });
  } catch (err) { return next(err); }
});


module.exports = router;
