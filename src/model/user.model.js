import pool from "../app/db.js";

const findById = async (userId) => {
  const query = `
    select id, name, email, phone_number, photo_profile, photo_profile_id from users where id = $1 limit 1;
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

const updatePersonalInformation = async (userId, payload) => {
  const fields = [];
  const values = [];

  if (payload.name !== undefined) {
    values.push(payload.name);
    fields.push(`name = $${values.length}`);
  }

  if (payload.email !== undefined) {
    values.push(payload.email);
    fields.push(`email = $${values.length}`);
  }

  if (payload.phoneNumber !== undefined) {
    values.push(payload.phoneNumber);
    fields.push(`phone_number = $${values.length}`);
  }

  if (fields.length === 0) {
    return null;
  }

  values.push(userId);

  const query = `
    update users
    set ${fields.join(", ")}
    where id = $${values.length}
    returning id, name, email, phone_number
  `;

  const result = await pool.query(query, values);

  return result.rows[0];
};

const getPasswordByUserId = async (userId) => {
  const query = `
  select password from users where id = $1
  `;

  const result = await pool.query(query, [userId]);
  return result.rows[0];
};

const updateSecurity = async (userId, payload) => {
  const query = `
    update users set password = $1 where id = $2 returning id
  `;

  const result = await pool.query(query, [payload, userId]);

  return result.rows[0];
};

const updatePhotoProfile = async (userId, photoUrl, photoId) => {
  const query = `
    update users set photo_profile = $1 , photo_profile_id = $2 where id = $3
  `;

  const result = await pool.query(query, [photoUrl, photoId, userId]);

  return result.rows[0];
};

export default {
  findByEmail,
  create,
  findById,
  updatePersonalInformation,
  getPasswordByUserId,
  updateSecurity,
  updatePhotoProfile,
};
