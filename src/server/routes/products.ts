import express from 'express';
import { productHandlers } from '../handlers';

const router = express.Router();

/**
 * @route /api/products?page
 * @description Get all products
 * @access Public
 */
router.get('', productHandlers.getAllProducts);

/**
 * @route /api/products/:permaLink
 * @description Get a single product using a product's permaLink
 * @access Public
 */
router.get('/:permaLink', productHandlers.getProduct);

/**
 * @route /api/products/featured/items?ips
 * @param ips - Items per section
 * @description Get featured items for each section
 * @access Public
 */
router.get('/featured/items', productHandlers.getFeaturedItems);

export default router;
