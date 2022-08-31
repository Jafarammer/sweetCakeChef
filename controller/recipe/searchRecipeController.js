const model = require("../../model/recipe/searchRecipeModel");
const searchModelUser = require("../../model/user/searchUserModel");

// ALL DATA
const findAllRecipe = async (req, res) => {
  try {
    const getData = await model.recipeAllModel();
    res.send({
      data: getData.rows,
      data: getData.rows?.map((item) => ({
        ...item,
        // ...{ photo: `https://sweet-cake-chef.herokuapp.com/${item.photo}` },
        ...{ photo: `http://localhost:8000/${item.photo}` },
      })),
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
    res.send(
      getData.rows?.map((item) => ({
        ...item,
        // ...{ photo: `https://sweet-cake-chef.herokuapp.com/${item.photo}` },
        ...{ photo: `http://localhost:8000/${item.photo}` },
      }))
    );
    // res.status(200).json(getData.rows);
  } catch (error) {
    res.status(400).send("Any error");
  }
};

// base with user_id
const findRecipeUser = async (req, res) => {
  try {
    const { name } = req.body;
    const getData = await searchModelUser.getByName(name);
    if (getData?.rowCount) {
      const id = getData.rows.map((res) => res.id);
      const getRecipeUser = await model.recipeByUser(id);
      res.status(200).json({
        user: getData?.rows,
        recipe: getRecipeUser?.rows?.map((item) => ({
          ...item,
          ...{ photo: `http://localhost:8000/${item.photo}` },
        })),
        jumlahData: getRecipeUser?.rowCount,
      });
    } else {
      res.status(400).send("data tidak ditemukan");
    }
  } catch (error) {
    res.status(400).send("ada yang error");
  }
};

module.exports = {
  findAllRecipe,
  findRecipeName,
  findRecipeId,
  findRecipeUser,
};
