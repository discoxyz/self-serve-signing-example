/**
 * Required External Modules
 */
import 'dotenv/config'
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createRouter} from "./issue/issue.router";

/**
 * App Variables
 */
if (!process.env.PORT) {
  console.log('no port')
  process.exit(1);
}
const PORT: number = parseInt(process.env.PORT as string, 10);
const app = express();

/**
 *  App Configuration
 */
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/create", createRouter);

/**
 * Server Activation
 */
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});