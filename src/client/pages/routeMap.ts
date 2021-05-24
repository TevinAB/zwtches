import CatalogPage from '@/pages/catalog/catalog';
import HomePage from '@/pages/home/home';

//keys are converted to regex to match pathname
export default {
  '/catalog[?]page=[0-9]+&cat=[a-zA-Z]+$': CatalogPage,
  '/$': HomePage,
};
