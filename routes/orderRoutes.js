import express from 'express';
const router = express.Router();

import {
authenticateUser,
authorizePermissions
} from '../middleware/authentication.js';

import {
getAllOrders,
getSingleOrder,
getCurrentUserOrders,
createOrder,
updateOrder
} from '../controllers/orderController.js';

// rutas
router
.route('/')
.post(authenticateUser, createOrder)
.get(authenticateUser, authorizePermissions('admin'), getAllOrders);

router.route('/showAllMyOrders').get(authenticateUser, getCurrentUserOrders);

router
.route('/:id')
.get(authenticateUser, getSingleOrder)
.patch(authenticateUser, updateOrder);

// export default para ESM
export default router;
