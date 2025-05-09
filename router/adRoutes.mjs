import express from 'express';
import {
  getAllAds,
  createAd,
  updateAd,
  deleteAd
} from '../controller/adController.mjs';

const router = express.Router();

router.get('/', getAllAds);
router.post('/', createAd);
router.put('/:id', updateAd);
router.delete('/:id', deleteAd);

export default router;
