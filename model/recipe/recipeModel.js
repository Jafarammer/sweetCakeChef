const db = require("../../config/db");

// ADD
const addRecipeModel = (props) => {
  // const { title_recipe, ingredients, photo } = props;
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO recipe(title_recipe,ingredients,photo,user_id) VALUES ($1,$2,$3,$4)",
      [props.title_recipe, props.ingredients, props.photo, props.user_id],
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

// EDIT
const editRecipeModel = (props) => {
  // const id_recipe = recipes.id_recipe;
  // const { title_recipe, ingredients, image_recipe, id } = recipes;
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE recipe SET title_recipe = $1, ingredients = $2, photo = $3, user_id = $4 WHERE id = $5",
      [
        props.title_recipe,
        props.ingredients,
        props.photo,
        props.user_id,
        props.id,
      ],
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

// DELETE
const deleteRecipeModel = (id) => {
  return new Promise((resolve, reject) => {
    db.query(`DELETE FROM recipe WHERE id = $1`, [id], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  addRecipeModel,
  editRecipeModel,
  deleteRecipeModel,
};
