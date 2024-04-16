import asyncHandler from "express-async-handler";
import Todos from "../models/todoModel.js";
import Users from "../models/userModel.js";
import bcrypt from "bcrypt";
import { fileDeleteFromCloud, fileUploadToCloud } from "../utils/cloudinary.js";
import {
  getPublicID,
  isValidEmail,
  isValidPhoneNumber,
} from "../helpers/helpers.js";

/**
 * @description : get all todos
 * @method : GET
 * @access : private
 * @route : '/api/v1/todo'
 */
export const getAllTodos = asyncHandler(async (req, res) => {
  const todo = await Todos.find();



//  check Incoming Letter
  if (todo.length === 0) {
    return res.status(404).json({ message: "No Todo Found" });
  }
  res.status(200).json({ todo, message: "Todo Found Successful" });
});

/**
 * @description : create todo
 * @method : POST
 * @access : private
 * @route : '/api/v1/todo'
 */
export const createTodo = asyncHandler(async (req, res) => {
  const { id, title } = req.body;

  // Find User
  const findUser = await Users.findById(id);

  if (!findUser) {
    return res.status(400).json({ message: "User Not Found" });
  }

  // Data validation
  if (!title) {
    return res.status(400).json({ message: "Todo Title Required" });
  }

  // Todo creation
  const newTodo = await Todos.create({
    title,
  });

  // Associate todo with user
  findUser.todos.push(newTodo);
  await findUser.save();

  // Response
  res.status(201).json({ todo: newTodo, message: "Todo Created Successfully" });
});

// /**
//  * @description : update todo
//  * @method : PUT/PATCH
//  * @access : private
//  * @route : '/api/v1/todo'
//  */
export const updateTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, title } = req.body;

  // Check if required fields are provided
  if (!title || !status) {
    return res.status(400).json({
      message: "Todo Title  Required",
    });
  }

  // Check if the file exists
  const existingTodo = await Todos.findById(id);
  if (!existingTodo) {
    return res.status(400).json({
      message: "Todo Not Exists",
    });
  }

  // Update the Todo
  const updatedTodo = await Todos.findByIdAndUpdate(
    id,
    { title, status },
    { new: true }
  );

  if (!updatedTodo) {
    return res.status(500).json({ message: "Failed to update Todo" });
  }

  res.status(200).json({
    todo: updatedTodo,
    message: "Todo update Successful",
  });
});


//get User Todo

export const getSingleUserTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await Users.findOne().where("_id").equals(id).populate("todos");

  const userTodo = user.todos;

  //check Incoming Letter
  if (userTodo.length === 0) {
    return res.status(404).json({ message: "No Task Found" });
  }
  res.status(200).json({ userTodo: user, message: "Todo Found Successful" });
});


// /**
//  * @description : delete todo
//  * @method : DELETE
//  * @access : private
//  * @route : '/api/v1/todo'
//  */

export const deleteTodo = asyncHandler(async (req, res) => {
  const { userId, todoId } = req.params;

  // Validate the user ID and todo ID
  if (!userId || !todoId) {
    return res.status(400).json({ message: "Invalid user ID or todo ID" });
  }

  try {
    // Find the user by ID and update their todos array to remove the specified todo ID
    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      { $pull: { todos: todoId } },
      { new: true }
    );

    const todoDelete  = await Todos.findByIdAndDelete(todoId);

    // Check if the user exists and the todo was successfully removed
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with success message
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    // Respond with error message
    res.status(500).json({ message: "Internal server error" });
  }
});
