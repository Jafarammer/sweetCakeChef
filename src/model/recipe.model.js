import pool from "../app/db.js";

const create = async (client, data) => {
  const query = `
    insert into recipe (title_recipe, ingredients, photo, user_id) values ($1,$2,$3,$4) returning *
  `;

  const values = [data.titleRecipe, data.ingredients, data.photo, data.userId];

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

export default {
  create,
  findAll,
  countAll,
  findMyRecipe,
  countMyRecipe,
};
