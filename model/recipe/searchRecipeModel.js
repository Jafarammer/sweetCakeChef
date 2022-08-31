const db = require("../../config/db");

// GET ALL
const recipeAllModel = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM recipe ORDER BY id DESC", (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};
// FIND title
const recipeByname = (title_recipe) => {
  return new Promise((resolve, reject) => {
    db.query(
      // `SELECT * FROM recipe WHERE title_recipe LIKE'%${title_recipe}%'`,
      "SELECT * FROM recipe WHERE title_recipe = $1",
      [title_recipe],
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

// FIND BY ID
const recipeById = (id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM recipe WHERE id = $1", [id], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

const recipeByUser = (id) => {
  return new Promise((resolve, rejects) => {
    db.query(
      `SELECT * FROM recipe WHERE user_id = ANY ($1)`,
      [id],
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

module.exports = { recipeAllModel, recipeById, recipeByname, recipeByUser };
