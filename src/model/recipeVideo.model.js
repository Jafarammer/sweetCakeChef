import pool from "../app/db.js";
import { NODE_ENV } from "../utils/env.js";

const create = async (client, data) => {
  const query = `
    insert into recipe_videos (recipe_id,video_url,video_public_id) values ($1,$2,$3) returning *
  `;

  const values = [data.recipeId, data.videoUrl, data.videoId];

  const result = await client.query(query, values);

  return result.rows[0];
};

const deleteForUpdateRecipe = async (client, recipeId, videoIds) => {
  const type = NODE_ENV === "development" ? "::int[]" : "::uuid[]";

  const query = `
    delete from recipe_videos where recipe_id = $1 and id = any($2${type}) returning *
  `;

  return await client.query(query, [recipeId, videoIds]);
};

const findByRecipeId = async (client, recipeId) => {
  const query = `
    select * from recipe_videos where recipe_id = $1 
    
  `;

  const result = await client.query(query, [recipeId]);

  return result.rows;
};

const deleteByRecipeId = async (client, recipeId) => {
  const query = `
    delete from recipe_videos where recipe_id = $1 returning *
  `;

  const result = await client.query(query, [recipeId]);

  return result.rows;
};

export default {
  create,
  deleteForUpdateRecipe,
  findByRecipeId,
  deleteByRecipeId,
};
