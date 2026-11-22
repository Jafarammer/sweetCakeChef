import pool from "../app/db.js";

const findById = async (userId) => {
  const query = `
    select id, name, email, phone_number, photo_profile from users where id = $1 limit 1;
  `;
  const result = await pool.query(query, [userId]);

  return result.rows[0];
};

const findByEmail = async (email) => {
  const query = `
    select id , name , email, phone_number, password from users where email = $1 limit 1
  `;

  const values = [email];

  const result = await pool.query(query, values);

  return result.rows[0] ?? null;
};

const create = async (data) => {
  const query = `
    insert into users (name,email,phone_number,password) values ($1,$2,$3,$4);
  `;

  const values = [data.name, data.email, data.phoneNumber, data.password];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export default {
  findByEmail,
  create,
  findById,
};
