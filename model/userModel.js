const db = require("../config/db");
const crypto = require("crypto");

// ALL USERS
const userAllModel = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM users ORDER BY id ASC", (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// USERS BY ID
const findModelId = (id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM users WHERE id = $1", [id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// USERS BY EMAIL
const findModelEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM users WHERE email = $1", [email], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// ADD NEW USERS
const addUserModel = (user) => {
  const { name, email, password } = user;
  const hash = crypto
    .createHmac("sha256", password)
    .update("very very important")
    .digest("hex");

  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO users (name, email,password) VALUES ($1, $2,$3)`,
      [name, email, hash],
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

// EDIT USERS
const editUserModel = (user) => {
  const { name, email, password, id } = user;
  const hash = crypto
    .createHmac("sha256", password)
    .update("very very important")
    .digest("hex");
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4`,
      [name, email, hash, id],
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

// DELETE USERS
const deleteUserModel = (id) => {
  return new Promise((resolve, reject) => {
    db.query(`DELETE FROM users WHERE id = $1`, [id], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  userAllModel,
  findModelId,
  findModelEmail,
  addUserModel,
  editUserModel,
  deleteUserModel,
};
