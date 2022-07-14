const commentModel = require("../../model/commentModel");

const getAllComments = async (req, res) => {
  try {
    const { id } = req.body;
    const getData = await commentModel.findComModel(id);
    res.send({
      data: getData.rows,
      totalData: getData.rowCount,
    });
  } catch (err) {
    console.log(`Errornya niih ${err}`);
    res.status(400).send("Internal server error");
  }
};

const addComment = async (req, res) => {
  try {
    const { comment_message, user_id, recipe_id } = req.body;
    const getCom = await commentModel.addComModel(
      comment_message,
      user_id,
      recipe_id
    );
    if (getCom) {
      res.status(200).send("Comment added successfully");
    } else {
      res.status(400).send("Comment fail to add!!");
    }
  } catch (err) {
    console.log(`IN HERE ${err}`);
    res.status(500).send("Internal server error!!!");
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.body;

    // Check user by id
    //   const getData = await recipeModel.recipeById(id);

    const delRecipe = await commentModel.deleteComModel(id);

    if (delRecipe) {
      res.send("Data deleted successfully");
    } else {
      res.status(400).send("Data failed to delete");
    }
  } catch (error) {
    console.log(`IN HERE ${error}`);
    res.status(500).send("Internal server error");
  }
};

module.exports = { addComment, deleteComment, getAllComments };
