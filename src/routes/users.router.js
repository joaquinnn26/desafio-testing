import { Router } from "express";

import {  findUserById, findUserByEmail, createUser, changeRole } from "../controllers/users.controller.js";
const router = Router();

router.get(
  "/:idUser", findUserById);

router.post("/premium/:email",changeRole)


router.post("/", async (req, res) => {
  const user = req.body
  const createdUser = await createUser(user)
  res.json({ createdUser })
})


export default router;