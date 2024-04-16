import express from "express";
import {
  getAllTodos , createTodo, updateTodo, deleteTodo, getSingleUserTodo
} from "../controllers/todoController.js";

// router initialize

const router = express.Router();

// route set

router.route("/").get(getAllTodos).post(createTodo);
router
.route("/:id")
.get(getSingleUserTodo)
.patch(updateTodo)
router.route("/:userId/:todoId").delete(deleteTodo)

  // .get(getSingleUser)
  // .put(updateUser)
  // .delete(deleteUser);

// export userRoute

export default router;
