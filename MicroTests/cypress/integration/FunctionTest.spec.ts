describe('Functional Test', () => {

  it('resets the shop database', () => {
    cy.visit('http://localhost:3100/reset')
  })

  it('resets the warehouse database', () => {
    cy.visit('http://localhost:3000/reset')
  })

  it('visits the warehouse frontend', () =>{
    cy.visit('http://localhost:4200/')
    cy.contains('Warehouse Home')
  })

  it('clicks on store-tasks', () =>{
    cy.get('#store-tasks-button').click()
    cy.contains('Warehouse Palettes:')
  })

  it('clicks on the add palette button', () =>{
    cy.get('#add-button').click()
    cy.contains('Store new palette:')
  })

  it('adds palette c001', () =>{
    cy.get('#barcodeInput').type('c001')
    cy.get('#productInput').type('red_shoes')
    cy.get('#amountInput').type('10')
    cy.get('#locationInput').type('shelf_42')
    cy.get('#add-palette-button').click()
    cy.get('#c001').contains('10')
    cy.get('#c001').contains('red_shoes')
    cy.get('#c001').contains('shelf_42')
  })

  it('add another palette of red shoes', () =>{
    cy.get('#add-button').click()
    cy.contains('Store new palette:')

    cy.get('#barcodeInput').type('c002')
    cy.get('#productInput').type('red_shoes')
    cy.get('#amountInput').type('8')
    cy.get('#locationInput').type('shelf_23')
    cy.get('#add-palette-button').click()
    cy.get('#c002').contains('8')
    cy.get('#c002').contains('red_shoes')
    cy.get('#c002').contains('shelf_23')
  })

  it('add palette of blue_jeans', () =>{
    cy.get('#add-button').click()
    cy.contains('Store new palette:')

    cy.get('#barcodeInput').type('c003')
    cy.get('#productInput').type('blue_jeans')
    cy.get('#amountInput').type('6')
    cy.get('#locationInput').type('shelf_1337')
    cy.get('#add-palette-button').click()
    cy.get('#c003').contains('6')
    cy.get('#c003').contains('blue_jeans')
    cy.get('#c003').contains('shelf_1337')
  })

  it('visits the shop frontend', () => {
    cy.visit('http://localhost:4400/offer-tasks')
  })


  it('clicks on edit button', () => {
    cy.get('#edit-button').click()
    cy.contains('Edit offer:')
  })

  it('sets the price of red_shoes to 42', () => {
    cy.get('#productNameInput').clear()
    cy.get('#productNameInput').type('red_shoes')
    cy.get('#productPriceInput').clear()
    cy.get('#productPriceInput').type('42')
    cy.get('#submitOfferButton').should('be.enabled')
    cy.get('#submitOfferButton').click()

    cy.contains('Offers overview:')
    cy.get('#red_shoes').contains(42)
  })

  it('clicks on edit button', () => {
    cy.get('#edit-button').click()
    cy.contains('Edit offer:')
  })

  it('sets the price of blue_jeans to 63', () => {
    cy.get('#productNameInput').clear()
    cy.get('#productNameInput').type('blue_jeans')
    cy.get('#productPriceInput').clear()
    cy.get('#productPriceInput').type('63')
    cy.get('#submitOfferButton').should('be.enabled')
    cy.get('#submitOfferButton').click()

    cy.contains('Offers overview:')
    cy.get('#blue_jeans').contains(63)
  })

  it('validates the red_shoes price in the database', () => {
    cy.request('GET', 'http://localhost:3100/query/product-red_shoes')
    .then((response) => {
      const product: any = response.body;
      expect(product.price).equal(42);
    })
  })

  it('starts shopping', () => {
    cy.visit('http://localhost:4400')
  })

  it('clicks on red_shoes', () => {
    cy.contains('red_shoes').click()
    cy.contains('Order details:')
    cy.get('#customerInput').type('Carli_Customer')
    cy.get('#addressInput').type('Wonderland 1')
    cy.get('#submitOrderButton').click()
    cy.contains('Hello Carli_Customer')
    cy.get('#red_shoes').contains('order placed')

    cy.request('GET', 'http://localhost:3100/query/orders')
    .then((response) => {
      const ordersList: any[] = response.body;
      expect(ordersList[0].state).eqls('order placed');
    })
  })

  it('visits the warehouse frontend', () =>{
    cy.visit('http://localhost:4200/')
    cy.contains('Warehouse Home')
  })

  it('clicks on pick-tasks', () =>{
    cy.get('#pickUp-tasks-button').click()
    cy.contains('Pick Tasks:')
  })

  it('clicks on red_shoes', () => {
    cy.contains('red_shoes').click()
    cy.contains('Order details:')
  })

  it('show on picking', () =>{
    cy.visit('http://localhost:4400/home/Carli_Customer')
    cy.get('#red_shoes').contains('picking')

    cy.request('GET', 'http://localhost:3100/query/orders')
    .then((response) => {
      const ordersList: any[] = response.body;
      expect(ordersList[0].state).eqls('picking');
    })
  })

  it('complete picking-task', () =>{
    cy.visit('http://localhost:4200/pick-task')
    cy.contains('red_shoes').click()
    cy.contains('Order details:')
    cy.get('#locationInput').type('shelf_42')
    cy.get('#submitPickButton').click()
  })

  it('show on shipping', () =>{
    cy.visit('http://localhost:4400/home/Carli_Customer')
    cy.get('#red_shoes').contains('shipping')

    cy.request('GET', 'http://localhost:3100/query/orders')
    .then((response) => {
      const ordersList: any[] = response.body;
      expect(ordersList[0].state).eqls('shipping');
    })
  })

  it('visits the delivery tasks', () =>{
    cy.visit('http://localhost:4200/deliver-task')
    cy.contains('Delivery Tasks')
    cy.contains('red_shoes').click()
    cy.get('#submitDeliverButton').click()
  })

  it('show delivered', () =>{
    cy.visit('http://localhost:4400/home/Carli_Customer')
    cy.get('#red_shoes').contains('delivered')
  })


})
