import pool from "../app/db.js";

const create = async (client, data) => {
  const query = `
    insert into recipe (title_recipe, ingredients, photo, user_id) values ($1,$2,$3,$4) returning *
  `;

  const values = [data.titleRecipe, data.ingredients, data.photo, data.userId];

  const result = await client.query(query, values);

  return result.rows[0];
};

const findAll = async () => {
  const query = `
    select * from recipe order by id_recipe desc
  `;

  const result = await pool.query(query);

  return result;
};

export default {
  create,
  findAll,
};
