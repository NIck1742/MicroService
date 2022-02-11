describe('Shop Test', () => {
  it('visits the shop frontend', () => {
    cy.visit('http://localhost:4400/offer-tasks')
  })




  it('clicks on edit button', () => {
    cy.get('#edit-button').click()
    cy.contains('Edit offer:')
  })

  it('sets the price of jeans to 49.99', () => {
    cy.get('#productNameInput').type('jeans')
    cy.get('#productPriceInput').type('fifty')
    cy.get('#submitOfferButton').should('be.disabled')


    cy.contains('Edit offer:')

    cy.get('#productPriceInput').clear()
    cy.get('#productPriceInput').type('49.99')
    cy.get('#submitOfferButton').should('be.enabled')
    cy.get('#submitOfferButton').click()

    cy.contains('Offers overview:')
  })

  it('validates the jeans price in the database', () => {
    cy.request('GET', 'http://localhost:3100/query/product-jeans')
    .then((response) => {
      const product: any = response.body;
      expect(product.price).equal(49.99);
    })
  })

  it('starts shopping', () => {
    cy.visit('http://localhost:4400')
  })

  it('clicks on jeans', () => {
    cy.contains('jeans').click()
    cy.contains('Order details:')
    cy.get('#orderInput').clear().type('o_001')
    cy.get('#customerInput').type('Carli')
    cy.get('#addressInput').type('Wonderland 1')
    cy.get('#submitOrderButton').click()
  })

})
