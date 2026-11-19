import pool from "../app/db.js";

const create = async (client, data) => {
  const query = `
    insert into recipe (title_recipe, ingredients, photo, user_id) values ($1,$2,$3,$4) returning *
  `;

  const values = [data.titleRecipe, data.ingredients, data.photo, data.userId];

  const result = await client.query(query, values);

  return result.rows[0];
};

export default {
  create,
};
