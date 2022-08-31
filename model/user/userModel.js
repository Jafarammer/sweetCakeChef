const db = require("../../config/db");

const addUserModel = (props) => {
  return new Promise((resolve, rejects) => {
    db.query(
      `INSERT INTO users (name, email, phone_number, password, photo) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [
        props.name,
        props.email,
        props.phone_number,
        props.password,
        props.photo,
      ],
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

const editUserModel = (props) => {
  return new Promise((resolve, rejects) => {
    db.query(
      "UPDATE users SET name = $1, email = $2, phone_number = $3, password = $4, photo = $5 WHERE id = $6",
      [
        props.name,
        props.email,
        props.phone_number,
        props.password,
        props.photo,
        props.id,
      ],
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

const deleteUserModel = (id) => {
  return new Promise((resolve, rejects) => {
    db.query("DELETE FROM users WHERE id = $1", [id], (error, result) => {
      if (error) {
        rejects(error);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = { addUserModel, editUserModel, deleteUserModel };
