import express from "express";
import cors from "cors";
import { authUserRouter } from "./routes/auth-user.js";
import { authAdminRouter } from "./routes/auth-admin.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authUserRouter);
app.use(authAdminRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
