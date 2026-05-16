import { Router } from "express";
import { profileController } from "./profile.controller";

const router = Router();

router.post("/", profileController.createProfile);

router.get("/:id", profileController.getAllProfileInfo);

router.get("/:id", profileController.getProfileInfo);

router.put("/:id", profileController.updateProfileInfo);

router.delete("/:id", profileController.deleteProfile);

export const profileRoute = router;
