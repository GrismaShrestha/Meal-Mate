import express from "express";
import { authUserRouter } from "./routes/auth-user.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authUserRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
