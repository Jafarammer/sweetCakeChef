import pool from "../app/db.js";

const create = async (client, data) => {
  const query = `
    insert into recipe_videos (recipe_id,video_url) values ($1,$2) returning *
  `;

  const values = [data.recipeId, data.videoUrl];

  const result = await client.query(query, values);

  return result.rows[0];
};

const deleteByRecipeId = async (client, recipeId) => {
  const query = `
    delete from recipe_videos where recipe_id = $1
  `;

  return await client.query(query, [recipeId]);
};

export default {
  create,
  deleteByRecipeId,
};
