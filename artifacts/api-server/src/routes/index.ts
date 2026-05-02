import { Router, type IRouter } from "express";
import healthRouter from "./health";
import adminRouter from "./admin";
import projectsRouter from "./projects";
import postsRouter from "./posts";
import skillsRouter from "./skills";
import settingsRouter from "./settings";
import uploadsRouter from "./uploads";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(adminRouter);
router.use(projectsRouter);
router.use(postsRouter);
router.use(skillsRouter);
router.use(settingsRouter);
router.use(uploadsRouter);
router.use(storageRouter);

export default router;
