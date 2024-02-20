// require("dotenv").config({ path: "./env" });
import dotenv from "dotenv";
import express from "express";
import connectDB from "./db.js";

dotenv.config({
  path: "./env",
});

connectDB();
