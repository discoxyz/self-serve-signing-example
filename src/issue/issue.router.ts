/**
 * Required External Modules and Interfaces
 */
import express, { Request, Response } from "express";
import { create } from "./issue.service";
import { CreateVC } from "./issue.interface";
// import { create } from "./issue.interface";

/**
 * Router Definition
 */

export const createRouter = express.Router();

/**
 * Controller Definitions
 */

// GET items

// GET items/:id

// POST items
createRouter.post("/", async (req: Request, res: Response) => {
  try {
    const data: CreateVC = req.body;
    const newItem = await create(data);
    res.status(201).json(newItem);
    return
  } catch (e) {
    res.status(500).send('Something went wrong');
  }
});

// PUT items/:id

// DELETE items/:id