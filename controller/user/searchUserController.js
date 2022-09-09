const model = require("../../model/user/searchUserModel");

// all data
const findAllUser = async (req, res) => {
  try {
    const getData = await model.getAllUser();
    res.send({ data: getData.rows, totalData: getData.rowCount });
  } catch (error) {
    res.status(400).send("Any error");
  }
};

// based with id
const findById = async (req, res) => {
  try {
    const { id } = req.params;
    const getData = await model.getById(id);
    // res.send({
    //   data: getData.rows?.map((item) => ({
    //     ...item,
    //     // ...{ photo: `https://sweet-cake-chef.herokuapp.com/${item.photo}` },
    //     ...{ photo: `http://localhost:8000/${item.photo}` },
    //   })),
    //   totalData: getData.rowCount,
    // });
    res.send({ data: getData.rows, totalData: getData.rowCount });
  } catch (error) {
    res.status(400).send("Any error");
  }
};

// based with name
const findByName = async (req, res) => {
  try {
    const { name } = req.query;
    const getData = await model.getByName(name);
    res.send({ data: getData.rows, totalData: getData.rowCount });
  } catch (error) {
    res.status(400).send("Any error");
  }
};
//   based with email
const findByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const getData = await model.getByEmail(email);
    res.send({ data: getData.rows, totalData: getData.rowCount });
  } catch (error) {
    res.status(400).send("Any error");
  }
};

//   pagination
const findPage = async (req, res) => {
  try {
    const { page, size } = req.query;
    const getData = await model.getModelPage(page, size);
    res.send({
      data: getData.rows,
      total: getData.rowCount,
    });
  } catch (err) {
    res.status(400).send("Internal server error");
  }
};

module.exports = { findAllUser, findById, findByName, findByEmail, findPage };
