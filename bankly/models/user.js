//Fixing bug #6, made everything a little more compact.

const bcrypt = require('bcrypt');
const db = require('../db');
const ExpressError = require('../helpers/expressError');
const sqlForPartialUpdate = require('../helpers/partialUpdate');
const { BCRYPT_WORK_FACTOR } = require("../config");

class User {

/** Register user with data. Returns new user data. */

  static async register({username, password, first_name, last_name, email, phone, admin=false}) {
    const dup = await db.query(`SELECT username FROM users WHERE username=$1`, [username]);
    if (dup.rows[0]) {
      throw new ExpressError('Duplicate username', 400);
    }
    const hashed = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const result = await db.query(
      `INSERT INTO users
         (username, password, first_name, last_name, email, phone, admin)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING username, first_name, last_name, email, phone, admin`,
      [username, hashed, first_name, last_name, email, phone, admin]
    );
    return result.rows[0];
  }

  /** Is this username + password combo correct?
   *
   * Return all user data if true, throws error if invalid
   *
   * */

  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT username, password, admin FROM users WHERE username=$1`, [username]
    );
    const user = result.rows[0];
    if (user && await bcrypt.compare(password, user.password)) {
      return { username: user.username, admin: user.admin };
    }
    throw new ExpressError('Cannot authenticate', 401);
  }

  /** Returns list of user info:
   *
   * [{username, first_name, last_name, email, phone}, ...]
   *
   * */

  static async getAll() {
    const result = await db.query(
      `SELECT username, first_name, last_name FROM users ORDER BY username`
    );
    return result.rows;
  }

  /** Returns user info: {username, first_name, last_name, email, phone}
   *
   * If user cannot be found, should raise a 404.
   *
   **/

  static async get(username) {
    const result = await db.query(
      `SELECT username, first_name, last_name, email, phone, admin
         FROM users WHERE username=$1`, [username]
    );
    const user = result.rows[0];
    if (!user) throw new ExpressError('No such user', 404);
    return user;
  }

  /** Selectively updates user from given data
   *
   * Returns all data about user.
   *
   * If user cannot be found, should raise a 404.
   *
   **/

  static async update(username, data) {
  if ('username' in data) delete data.username; // don't allow username change
  if ('password' in data) {
    data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
  }

  const { query, values } = sqlForPartialUpdate('users', data, 'username', username);
  const result = await db.query(query, values);

  let user = result.rows[0];
  if (!user) throw new ExpressError('No such user', 404);

  // Ensure password is present in the returned object (tests expect it)
  if (user.password === undefined) {
    const r2 = await db.query(
      `SELECT username, first_name, last_name, email, phone, admin, password
         FROM users
         WHERE username = $1`,
      [username]
    );
    user = r2.rows[0];
  }

  return user;
}

  /** Delete user. Returns true.
   *
   * If user cannot be found, should raise a 404.
   *
   **/

  static async delete(username) {
    const result = await db.query(`DELETE FROM users WHERE username=$1 RETURNING username`, [username]);
    const user = result.rows[0];
    if (!user) throw new ExpressError('No such user', 404);
    return true;
  }
}

module.exports = User;
