const db = require("../../config/db");

const addCommentModel = (props) => {
  return new Promise((resolve, rejects) => {
    db.query(
      "INSERT INTO comment(recipe_id,user_id,comment_message)VALUES($1,$2,$3)",
      [props.recipe_id, props.user_id, props.comment_message],
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

const getCommentRecipe = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT comment.*, users.name, users.photo_profile FROM comment LEFT JOIN users ON comment.user_id = users.id WHERE comment.recipe_id = $1 ORDER BY id DESC`,
      [id],
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
module.exports = { addCommentModel, getCommentRecipe };
