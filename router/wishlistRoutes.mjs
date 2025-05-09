import express from 'express';
import {
  getWishlistByUser,
  addToWishlist,
  removeFromWishlist
} from '../controller/wishlistController.mjs';

const router = express.Router();

router.get('/:user_id', getWishlistByUser);
router.post('/', addToWishlist);
router.delete('/', removeFromWishlist);

export default router;
