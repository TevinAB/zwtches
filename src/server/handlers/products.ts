import { Request, Response } from 'express';
// @ts-ignore
import Commerce from '@chec/commerce.js';

async function getAllProducts(request: Request, response: Response) {
  try {
    const commerce: any = new Commerce(process.env.COMMERCEJS_API_KEY);
    const products = await commerce.products.list();
    response.json(products);
  } catch (err) {
    response.status(400).json({ msg: 'Error fetching product list' });
  }
}

async function getProduct(request: Request, response: Response) {
  //
}

export default {
  getAllProducts,
  getProduct,
};
