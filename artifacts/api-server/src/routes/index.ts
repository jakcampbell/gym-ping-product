import { Router, type IRouter } from "express";
import healthRouter from "./health";
import gymLogsRouter from "./gymLogs";

const router: IRouter = Router();

router.use(healthRouter);
router.use(gymLogsRouter);

export default router;
