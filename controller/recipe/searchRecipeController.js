const model = require("../../model/recipe/searchRecipeModel");
const searchModelUser = require("../../model/user/searchUserModel");

// ALL DATA
const findAllRecipe = async (req, res) => {
  try {
    const getData = await model.recipeAllModel();
    // res.send({
    //   data: getData.rows,
    //   data: getData.rows?.map((item) => ({
    //     ...item,
    //     // ...{ photo: `https://sweet-cake-chef.herokuapp.com/${item.photo}` },
    //     ...{ photo: `http://localhost:8000/${item.photo}` },
    //   })),
    //   totalData: getData.rowCount,
    // });
    res.send({
      data: getData.rows,
      totalData: getData.rowCount,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Any error");
  }
};

// base with name
const findRecipeName = async (req, res) => {
  try {
    const { title_recipe } = req.query;
    const getData = await model.recipeByname(title_recipe);
    res.send({
      data: getData.rows,
      totalData: getData.rowCount,
    });
  } catch (error) {
    res.status(400).send("Any error");
  }
};

// base with id
const findRecipeId = async (req, res) => {
  try {
    const { id } = req.params;
    const getData = await model.recipeById(id);
    res.send({ data: getData.rows, totalData: getData.rowCount });
  } catch (error) {
    res.status(400).send("Any error");
  }
};

// base with user_id
const findRecipeUser = async (req, res) => {
  try {
    const { id } = req.params;
    const getData = await searchModelUser.getById(id);
    if (getData?.rowCount) {
      const id = getData.rows.map((res) => res.id);
      const getRecipeUser = await model.recipeByUser(id);
      res.status(200).send({
        user: getData?.rows,
        recipe: getRecipeUser?.rows,
        jumlahData: getRecipeUser?.rowCount,
      });
    } else {
      res.status(400).send("data tidak ditemukan");
    }
  } catch (error) {
    res.status(400).send("ada yang error");
  }
};

// based with user id tes
const findRecipeUserId = async (req, res) => {
  try {
    const { user_id } = req.body;
    const getData = model.recipeUserId(user_id);
    res.send({
      data: getData.rows,
      totalData: getData.rowCount,
    });
  } catch (error) {
    res.status(400).send("Any error!!!");
  }
};

module.exports = {
  findAllRecipe,
  findRecipeName,
  findRecipeId,
  findRecipeUser,
  findRecipeUserId,
};
