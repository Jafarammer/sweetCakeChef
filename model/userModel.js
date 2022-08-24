const db = require("../config/db");

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

// pagination
const findModelPage = (page, size) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM users ORDER BY id ASC LIMIT $2 OFFSET (($1 - 1) * $2)",
      [page, size],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

// ADD NEW USERS
const addUserModel = (props) => {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO users (name, email,phone_number,password) VALUES ($1, $2,$3,$4) RETURNING *`,
      [props.name, props.email, props.phoneNumber, props.password],
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
  const { name, email, phoneNumber, password, id } = user;
  const hash = crypto
    .createHmac("sha256", password)
    .update("very very important")
    .digest("hex");
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE users SET name = $1, email = $2, phone_number = $3, password = $4 WHERE id = $5`,
      [name, email, phoneNumber, hash, id],
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
  findModelPage,
  addUserModel,
  editUserModel,
  deleteUserModel,
};
