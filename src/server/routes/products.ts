import express from 'express';
import { productHandlers } from '../handlers';

const router = express.Router();

/**
 * @route /api/products
 * @description Get all products for the store
 * @access Public
 */
router.get('/', productHandlers.getAllProducts);

export default router;
