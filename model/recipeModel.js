const db = require("../config/db");

// GET ALL
const recipeAllModel = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM recipe ORDER BY id_recipe DESC", (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// FIND Name
const recipeByname = (title_recipe) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM recipe WHERE title_recipe LIKE'%${title_recipe}%'`,
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

// FIND BY ID
const recipeById = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM recipe WHERE id_recipe = $1",
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

// ADD
const addRecipeModel = (props) => {
  // const { title_recipe, ingredients, image_recipe } = recipes;
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO recipe(title_recipe,ingredients,photo) VALUES ($1,$2,$3) RETURNING *",
      [props.title_recipe, props.ingredients, props.photo],
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

// EDIT
const editRecipeModel = (recipes) => {
  // const id_recipe = recipes.id_recipe;
  const { title_recipe, ingredients, image_recipe, id_recipe } = recipes;
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE recipe SET title_recipe = $1, ingredients = $2, image_recipe = $3 WHERE id_recipe = $4",
      [title_recipe, ingredients, image_recipe, id_recipe],
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

// DELETE
const deleteRecipeModel = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      `DELETE FROM recipe WHERE id_recipe = $1`,
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

module.exports = {
  recipeAllModel,
  recipeByname,
  recipeById,
  addRecipeModel,
  editRecipeModel,
  deleteRecipeModel,
};
