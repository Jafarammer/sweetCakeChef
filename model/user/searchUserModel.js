const db = require("../../config/db");

const getAllUser = () => {
  return new Promise((resolve, rejects) => {
    db.query("SELECT * FROM users ORDER BY id ASC", (error, result) => {
      if (error) {
        rejects(error);
      } else {
        resolve(result);
      }
    });
  });
};

const getById = (id) => {
  return new Promise((resolve, rejects) => {
    db.query("SELECT * FROM users WHERE id = $1", [id], (error, result) => {
      if (error) {
        rejects(error);
      } else {
        resolve(result);
      }
    });
  });
};

const getByName = (name) => {
  return new Promise((resolve, rejects) => {
    db.query(
      "SELECT * FROM users WHERE name  LIKE $1",
      [`%${name}%`],
      (error, result) => {
        if (error) {
          rejects(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const getByEmail = (email) => {
  return new Promise((resolve, rejects) => {
    db.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
      (error, result) => {
        if (error) {
          rejects(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

// pagination
const getModelPage = (page, size) => {
  return new Promise((resolve, rejects) => {
    db.query(
      "SELECT * FROM users ORDER BY id ASC LIMIT $2 OFFSET (($1 - 1) * $2)",
      [page, size],
      (error, result) => {
        if (error) {
          rejects(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

module.exports = { getAllUser, getById, getByName, getByEmail, getModelPage };
