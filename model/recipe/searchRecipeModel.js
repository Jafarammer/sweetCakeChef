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
      "SELECT * FROM recipe WHERE LOWER(title_recipe) LIKE $1",
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

const recipeUserId = (user_id) => {
  return new Promise((resolve, rejects) => {
    db.query(
      "SELECT * FROM recipe WHERE user_id = ANY ($1)",
      [user_id],
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

// page
const recipePageModel = (props) => {
  return new Promise((resolve, rejects) => {
    db.query(
      "SELECT * FROM recipe ORDER BY id DESC LIMIT $2 OFFSET (($1 - 1) * $2)",
      [props.page, props.limit],
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

// asc
const ascModel = () => {
  return new Promise((resolve, rejects) => {
    db.query("SELECT * FROM recipe ORDER BY id ASC", (error, result) => {
      if (error) {
        rejects(error);
      } else {
        resolve(result);
      }
    });
  });
};

const descModel = () => {
  return new Promise((resolve, rejects) => {
    db.query("SELECT * FROM recipe ORDER BY id DESC", (error, result) => {
      if (error) {
        rejects(error);
      } else {
        resolve(result);
      }
    });
  });
};

const showAllDataModel = () => {
  return new Promise((resolve, rejects) => {
    db.query("SELECT * FROM recipe", (error, result) => {
      if (error) {
        rejects(error);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  recipeAllModel,
  recipeById,
  recipeByname,
  recipeByUser,
  recipeUserId,
  recipePageModel,
  ascModel,
  descModel,
  showAllDataModel,
};
