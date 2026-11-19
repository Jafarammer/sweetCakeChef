import pool from "../app/db.js";

const create = async (client, data) => {
  const query = `
    insert into recipe_videos (recipe_id,video_url) values ($1,$2)
  `;

  const values = [data.recipeId, data.videoUrl];

  const result = await client.query(query, values);

  return result.rows[0];
};

export default {
  create,
};
