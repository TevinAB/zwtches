import express from 'express';
import { productHandlers } from '../handlers';

const router = express.Router();

/**
 * @route /api/products/
 * @description Get all products
 * @access Public
 */
router.get('/', productHandlers.getAllProducts);

/**
 * @route /api/products/:permaLink
 * @description Get a single product using a product's permaLink
 * @access Public
 */
router.get('/:permaLink', productHandlers.getProduct);

export default router;
