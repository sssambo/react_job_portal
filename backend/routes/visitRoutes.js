import express from "express";
import {
	trackJobView,
	getVisitHistory,
	deleteVisitRecord,
} from "../controllers/visitController.js";

const router = express.Router();

router.post("/track-view", trackJobView);
router.get("/history/:sessionId", getVisitHistory);
router.delete("/history/:id", deleteVisitRecord);

export default router;
