import CatalogPage from '@/pages/catalog/catalog';
import HomePage from '@/pages/home/home';
import Cart from '@/pages/cart/cart';
import ProductPage from '@/pages/product/product';

//keys are converted to regex to match pathname extracted from page url
export default {
  '/catalog[?]page=[0-9]+&cat=[a-zA-Z]+$': CatalogPage,
  '/$': HomePage,
  '/cart$': Cart,
  '/product/[a-zA-Z0-9]+$': ProductPage,
};
