import pool from "../app/db.js";

const create = async (client, userId, payload) => {
  const query = `
    insert into recipe (title_recipe, ingredients, photo, user_id, photo_public_id) values ($1,$2,$3,$4,$5) returning *
  `;

  const values = [
    payload.titleRecipe,
    payload.ingredients,
    payload.photo.url,
    userId,
    payload.photo.publicId,
  ];

  const result = await client.query(query, values);

  return result.rows[0];
};

const findAll = async ({ limit, offset }) => {
  const query = `
    select
    r.id_recipe,
    r.title_recipe,
    r.ingredients,
    r.photo,

    u.id as user_id,
    u.name as user_name,
    u.photo_profile as user_photo

    from recipe r left join users u on r.user_id = u.id

    order by r.id_recipe desc limit $1 offset $2
  `;

  const result = await pool.query(query, [limit, offset]);

  return result.rows;
};

const findById = async (recipeId) => {
  const query = `
    select
    r.id_recipe,
    r.title_recipe,
    r.ingredients,
    r.photo,

    u.id as user_id,
    u.name as user_name,
    u.photo_profile as user_photo,

    rv.id as video_id,
    rv.video_url

    from recipe r

    left join users u on r.user_id = u.id

    left join recipe_videos rv on r.id_recipe = rv.recipe_id

    where r.id_recipe = $1
  `;

  const result = await pool.query(query, [recipeId]);

  return result.rows;
};

const countAll = async () => {
  const query = `
    select count(*) as total from recipe
  `;

  const result = await pool.query(query);

  return Number(result.rows[0].total);
};

const findMyRecipe = async (userId, { limit, offset }) => {
  const query = `
  select 
  id_recipe,
  title_recipe,
  ingredients,
  photo,
  user_id
  from recipe where user_id = $1
  order by id_recipe desc
  limit $2
  offset $3
  `;

  const result = await pool.query(query, [userId, limit, offset]);
  return result.rows;
};

const countMyRecipe = async (userId) => {
  const query = `
    select count(*) as total from recipe where user_id = $1
  `;

  const result = await pool.query(query, [userId]);
  return Number(result.rows[0].total);
};

const findByIdAndUser = async (client, recipeId, userId) => {
  const query = `
    select * from recipe where id_recipe = $1 and user_id = $2 limit 1
  `;

  const result = await client.query(query, [recipeId, userId]);

  return result.rows[0] || null;
};

const update = async (client, recipeId, payload) => {
  const fields = [];
  const values = [];
  let index = 1;

  if (payload.titleRecipe !== undefined) {
    fields.push(`title_recipe = $${index++}`);
    values.push(payload.titleRecipe);
  }

  if (payload.ingredients !== undefined) {
    fields.push(`ingredients = $${index++}`);
    values.push(payload.ingredients);
  }

  if (payload.photo !== undefined) {
    fields.push(`photo = $${index++}`);
    values.push(payload.photo);
  }

  if (fields.length === 0) {
    return await findByIdAndUser(client, recipeId, payload.userId);
  }

  values.push(recipeId, payload.userId);

  const query = `
  update recipe set ${fields.join(", ")} where id_recipe = $${index++} and user_id = $${index}
  `;

  const result = await client.query(query, values);

  return result.rows[0] || null;
};

export default {
  create,
  findAll,
  countAll,
  findMyRecipe,
  countMyRecipe,
  findById,
  update,
  findByIdAndUser,
};
