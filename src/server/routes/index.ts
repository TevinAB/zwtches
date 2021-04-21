import productRoutes from './products';
import express from 'express';

const router = express.Router();

router.use('/products', productRoutes);

export default router;
