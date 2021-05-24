import productCard from '@/components/productCard/productCard';
import { SectionData, State } from '@/types';

export default function featuredSection(
  { title, items, category }: SectionData,
  state: State
): string {
  return `
  <section class="featured-items">
    <h2 aria-label="${title}..">${title}</h2>
    <div class="featured-items__container">
      ${items
        .map(
          ({
            name,
            id,
            media: { source: image },
            price: { formatted: pricePerUnit },
            permalink,
          }) => {
            return productCard(
              {
                name,
                id,
                image,
                pricePerUnit,
                permaLink: permalink,
                quantity: 0,
              },
              Boolean(state.shoppingCart.find((item) => item.id === id))
            );
          }
        )
        .join('')}
    </div>
    <a href='/catalog?page=1&cat=${category}' data-link class="featured-items__view-all"
    aria-label="View all ${title}..">View All</a>
  </section>
  `;
}
