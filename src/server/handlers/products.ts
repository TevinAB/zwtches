import { Request, Response } from 'express';
// @ts-ignore
import Commerce from '@chec/commerce.js';

async function getAllProducts(request: Request, response: Response) {
  const { page: pageNumber, cat: categorySlug } = request.query;
  const ITEMS_PER_PAGE: number = 15;

  try {
    const commerce: any = new Commerce(process.env.COMMERCEJS_API_KEY);
    const products = await commerce.products.list({
      limit: 200,
      category_slug: [categorySlug],
    });
    const TOTAL_ITEMS: number = products.meta.pagination.total;

    //subtract 1 from the page number so page 1 will result in slicing from index 0
    let startIndex: number = ITEMS_PER_PAGE * (Number(pageNumber) - 1);

    //returns the items from the last page if page number was greater than the last page
    if (startIndex >= TOTAL_ITEMS) {
      startIndex = TOTAL_ITEMS - ITEMS_PER_PAGE - 1;
    }

    const result = {
      items: [{}],
      meta: {},
    };

    result.meta = {
      lastPage: getLastPageNumber(TOTAL_ITEMS, ITEMS_PER_PAGE),
    };

    result.items = products.data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    response.json({ result });
  } catch (error) {
    response.status(400).json({ error: error.data.error });
  }
}

async function getProduct(request: Request, response: Response) {
  const { permaLink } = request.params;

  try {
    const commerce: any = new Commerce(process.env.COMMERCEJS_API_KEY);
    const product = await commerce.products.retrieve(permaLink, {
      type: 'permalink',
    });

    response.json(product);
  } catch (error) {
    response.status(400).json({ error: error.data.error });
  }
}

async function getFeaturedItems(request: Request, response: Response) {
  const { ips: itemsPerSection } = request.query;

  try {
    const commerce: any = new Commerce(process.env.COMMERCEJS_API_KEY);
    const menItems = await commerce.products.list({
      limit: itemsPerSection,
      category_slug: ['men'],
    });
    const womenItems = await commerce.products.list({
      limit: itemsPerSection,
      category_slug: ['women'],
    });

    response.json({
      men: { title: "Men's watches", items: menItems.data },
      women: { title: "Women's watches", items: womenItems.data },
    });
  } catch (error) {
    response.status(400).json({ msg: 'Error fetching featured items' });
  }
}

export default {
  getAllProducts,
  getProduct,
  getFeaturedItems,
};

function getLastPageNumber(totalItems: number, itemsPerPage: number): number {
  let num: number = totalItems / itemsPerPage;
  if (num % 1 === 0) {
    return num;
  }

  return num - (num % 1) + 1;
}
