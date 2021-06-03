import page1 from '../../fixtures/catalog/menCatalog1.json';
import page2 from '../../fixtures/catalog/menCatalog2.json';

describe('Catalog Page', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/products?page=1&cat=men', {
      fixture: 'catalog/menCatalog1.json',
    });

    cy.intercept('GET', '/api/products?page=2&cat=men', {
      fixture: 'catalog/menCatalog2.json',
    });

    cy.intercept('GET', '/api/products?page=1&cat=women', {
      fixture: 'catalog/womenCatalog1.json',
    });

    cy.intercept('GET', '/product/WQaZ6z', {
      fixture: '/product/product.json',
    });

    cy.visit('/catalog?page=1&cat=men');
  });

  it('should be able to add an item to cart from catalog', () => {
    cy.get('.nav__cart-quantity')
      .as('qty')
      .invoke('text')
      .then((text) => {
        const quantity = Number(text);

        cy.contains('Add to cart').click();

        cy.get('@qty').should('contain', quantity + 1 + '');
      });
  });

  it('should be able to navigate using pagination', () => {
    cy.get('a[href="?page=2&cat=men"]').first().click();

    cy.contains(page2.result.items[0].name);
  });

  it('should be able to navigate to the product description page using product card', () => {
    cy.get('.product-card__title > a').click();

    cy.contains(page1.result.items[0].name);
  });

  it('should be able to navigate to the cart from catalog', () => {
    cy.get('a[href="/cart"]').click();

    cy.contains('Inside your cart');
  });

  it("should be able to navigate to the women's catalog", () => {
    cy.contains('Women').click();

    cy.contains("women's watches");
  });
});
