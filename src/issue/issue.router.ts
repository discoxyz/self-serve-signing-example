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
// createRouter.get("/", async(req: Request, res: Response) => {
//   res.status(400).send('yo')
// })

// GET items/:id

// POST items
createRouter.post("/", async (req: Request, res: Response) => {
  console.log("BEGIN")
  try {
    const data: CreateVC = req.body;
    if (!data.schema || !data.credSubject || !data.recipient) {
      console.error('BAD REQUEST')
      res.status(400).send({message: 'bad data'})}
    const newItem = await create(data);
    console.log('CREATED')
    res.status(201).json(newItem);
    return
  } catch (e) {
    console.error('Failed to create')
    res.status(500).send('Something went wrong');
  }
});

// PUT items/:id

// DELETE items/:id