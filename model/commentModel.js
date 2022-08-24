const db = require("../config/db");

const findComModel = (id) => {
  return new Promise((reject, resolve) => {
    db.query(
      "SELECT * FROM comments INNER JOIN users ON comments.user_id=users.id INNER JOIN recipe ON comments.recipe_id=recipes.id_recipe WHERE id=$1",
      [id],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const addComModel = (comment) => {
  const { comment_message, user_id, recipe_id } = comment;
  return new Promise((reject, resolve) => {
    db.query(
      "INSERT INTO comments(comment_message,user_id,recipe_id) VALUES ($1,$2,$3) RETURNING *",
      [comment_message, user_id, recipe_id],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const deleteComModel = (id) => {
  return new Promise((resolve, reject) => {
    db.query(`DELETE FROM comments WHERE id = $1`, [id], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = { addComModel, deleteComModel, findComModel };
