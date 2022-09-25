const model = require("../../model/recipe/searchRecipeModel");
const searchModelUser = require("../../model/user/searchUserModel");

// All data not asc or desc
const findShowAllRecipe = async (req, res) => {
  try {
    const getData = await model.showAllDataModel();
    res.send({
      data: getData.rows,
      totalData: getData.rowCount,
    });
  } catch (error) {
    res.status(400).send("Any error");
  }
};
// ALL DATA DESC
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
    // if (getData.rowCount > 0) {
    res.send({
      data: getData.rows,
      totalData: getData.rowCount,
    });
    // }
  } catch (error) {
    console.log(error);
    res.status(400).send("Any error");
  }
};

// sort
const sortRecipe = async (req, res) => {
  try {
    const { asc } = req.query;
    if (asc) {
      const getAsc = await model.ascModel();
      res.send({
        data: getAsc.rows,
        totalData: getAsc.rowCount,
      });
    } else {
      const getDesc = await model.descModel();
      res.send({
        data: getDesc.rows,
        totalData: getDesc.rowCount,
      });
    }
  } catch (error) {
    res.status(400).send("Any error");
  }
};

// base with name
const findRecipeName = async (req, res) => {
  try {
    const { title_recipe } = req.query;
    const title = `%${title_recipe.toLowerCase()}%`;
    const getData = await model.recipeByname(title);
    if (getData.rowCount > 0) {
      res.send({
        data: getData.rows,
        totalData: getData.rowCount,
      });
    } else {
      res.status(400).send(`Data ${title_recipe} not found`);
    }
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

// base with page & search
const findPageRecipe = async (req, res) => {
  try {
    const { page } = parseInt(req.query.page) || 0;
    const { limit } = parseInt(req.query.limit) || 5;
    const getAllRecipe = await model.recipeAllModel();
    const getData = await model.recipePageModel({ page, limit });
    if (getData.rowCount > 0) {
      res.status(200).send({
        totalData: getAllRecipe.rowCount,
        data: getData.rows,
        page: page,
        limit,
      });
    } else {
      res.status(400).send("Data not found!!!");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Any error!!!");
  }
};

module.exports = {
  findAllRecipe,
  findRecipeName,
  findRecipeId,
  findRecipeUser,
  findRecipeUserId,
  findPageRecipe,
  sortRecipe,
  findShowAllRecipe,
};
