import express from "express";
import cors from "cors";
import { authUserRouter } from "./routes/auth-user.js";
import { authAdminRouter } from "./routes/auth-admin.js";
import { adminRouter } from "./routes/admin.js";
import { userRouter } from "./routes/user.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authUserRouter);
app.use(authAdminRouter);
app.use(adminRouter);
app.use(userRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
