describe('Home page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should be able to navigate to the cart page', () => {
    cy.get('.nav__cart > a').first().click();
    cy.url().should('include', '/cart');
    cy.contains('Inside your cart').should('be.visible');
  });

  it("should be able to navigate to the men's catalog page using the nav bar", () => {
    cy.get('a[aria-label="Category, Men."]').click();

    cy.url().should('include', '/catalog?page=1&cat=men');
    cy.contains("men's watches").should('be.visible');
  });

  it("should be able to navigate to the women's catalog page using the nav bar", () => {
    cy.get('a[aria-label="Category, Women."]').click();

    cy.url().should('include', '/catalog?page=1&cat=women');
    cy.contains("women's watches").should('be.visible');
  });

  it("should be able to use the view all button from men's section to navigate to men's catalog", () => {
    cy.get('a[aria-label="View all Men\'s watches.."]').click();

    cy.url().should('include', '/catalog?page=1&cat=men');
    cy.contains("men's watches").should('be.visible');
  });

  it("should be able to use the view all button from women's section to navigate to women's catalog", () => {
    cy.get('a[aria-label="View all Women\'s watches.."]').click();

    cy.url().should('include', '/catalog?page=1&cat=women');
    cy.contains("women's watches").should('be.visible');
  });

  it('should be able to navigate to the product description page by clicking a product card', () => {
    cy.get('.product-card__title > a')
      .first()
      .as('product')
      .invoke('text')
      .then((text) => {
        cy.get('@product').click();

        cy.contains(text);
      });
  });

  it('should be able to add an item to the cart using a product card', () => {
    cy.get('.nav__cart-quantity')
      .as('quantity')
      .invoke('text')
      .then((text) => {
        const numInCart = Number(text);

        cy.contains('Add to cart').first().click();

        //should contain one more item than it did before add to cart was pressed
        cy.get('@quantity').should('contain.text', numInCart + 1 + '');
      });
  });
});
