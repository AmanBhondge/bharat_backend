import express from 'express';
import { createContact, getAllContacts, getContactById } from "../controllers/contact.controller.js";

const contactRouter = express.Router();

contactRouter.post("/", createContact);

contactRouter.get("/", getAllContacts);

contactRouter.get("/:id", getContactById);

export default contactRouter;