import { Router } from "express";
import {
  getItemByCodePat,
  getItemsQtyByDependece,
  getItemsQtyByWorker,
  getConservationStatus,
  getItemByCodePatAndConservation,
  getAllItemsAndConservationLimited
} from "../controllers/getItems.controller.js";

import {
  searchGeneral,
  searchItemByPartialWorker,
  searchItemByPartialDependency,
  searchItemsByWorkerAndDescription,
  searchItemsByWorker,
  searchItemsByDependece
} from "../controllers/searchItems.controller.js";

import {
  updateDisposition,
  updateSituation,
  insertExcelData,
  getItemByCodePatAndUpdate,
  updateItem,
  addItem,
  addObservation
} from "../controllers/handlerItems.controller.js";

import { authenticateToken } from "../middleware/tokenJWT.js";

const router = Router();

/* ROUTES FOR SEARCH AND GET ITEMS */

//GET REQUEST
router.get("/", getAllItemsAndConservationLimited); // GET ALL ITEMS AND THEI CONSERVATION STATE
router.get("/search", searchGeneral); // Endpoint para la búsqueda en tiempo real
router.get("/partial/worker", searchItemByPartialWorker); // Endpoint para la búsqueda en tiempo real worker
router.get("/partial/dependency", searchItemByPartialDependency); // Endpoint para la búsqueda en tiempo real dependency
router.get("/worker", searchItemsByWorker); //GET ITEMS BY WORKER
router.get("/dependency", searchItemsByDependece); //GET ITEMS BY DEPENDENCY
router.get("/filter", searchItemsByWorkerAndDescription); // GET ITEMS BY WORKER AND DESCRIPTION
router.get("/conservation", getConservationStatus); // 
router.get("/:id" ,getItemByCodePatAndUpdate); // GET ITEMS BY PATRIMONIAL CODE AND UPDATE STATE
// router.get("/:id",authenticateToken ,getItemByCodePatAndUpdate); // GET ITEMS BY PATRIMONIAL CODE AND UPDATE STATE
router.get("/status/:id", getItemByCodePat); // GET ITEMS BY PATRIMONIAL CODE
router.get("/conservation/:id", getItemByCodePatAndConservation); // 

//GET QTY ITEMS REQUEST
router.get("/worker/qty", getItemsQtyByWorker);
router.get("/dependency/qty", getItemsQtyByDependece);

//PUT REQUEST
router.put("/disposition/:id", updateDisposition);
router.put("/situation/:id", updateSituation);
router.put("/edit/:id", updateItem);
router.put('/observation/:id', addObservation)

//POST REQUEST
router.post("/imported", insertExcelData);
router.post("/add", addItem);

export default router;
