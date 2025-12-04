import express from 'express';
const router = express.Router();

import { authenticateUser } from '../middleware/authentication.js';
import {
createReview,
getAllReviews,
getSingleReview,
updateReview,
deleteReview
} from '../controllers/reviewController.js';

// rutas reviews
router.route('/')
.post(authenticateUser, createReview)
.get(getAllReviews);

router.route('/:id')
.get(getSingleReview)
.patch(authenticateUser, updateReview)
.delete(authenticateUser, deleteReview);

// export default para ESM
export default router;
