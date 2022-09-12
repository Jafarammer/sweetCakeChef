const model = require("../../model/comment/commentModel");

const addComment = async (req, res) => {
  try {
    const { recipe_id, user_id, comment_message } = req.body;
    const getData = await model.addCommentModel({
      recipe_id,
      user_id,
      comment_message,
    });
    if (getData) {
      const getDataRecipe = await model.getCommentRecipe(recipe_id);
      res.status(200).send({
        message: "Comment added successfully",
        data: getDataRecipe.rows,
      });
    } else {
      res.status(400).json({ message: "Comment failed" });
    }
  } catch (error) {
    res.status(400).send("Any error!!!");
  }
};

const getComment = async (req, res) => {
  try {
    const { id } = req.params;
    const getData = await model.getCommentRecipe(id);
    if (getData.rowCount > 0) {
      res.status(200).send({
        data: getData.rows,
        totalData: getData.rowCount,
      });
    } else {
      res.status(400).send("Comment not found!!!");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Any error!!!");
  }
};

module.exports = { addComment, getComment };
