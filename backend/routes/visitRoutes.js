import express from "express";
import {
	trackJobView,
	getVisitHistory,
	deleteVisitRecord,
	clearAllVisitHistory,
} from "../controllers/visitController.js";

const router = express.Router();

router.post("/track-view", trackJobView);
router.get("/history/:sessionId", getVisitHistory);
router.delete("/history/clear/:sessionId", clearAllVisitHistory);
router.delete("/history/:id", deleteVisitRecord);

export default router;
