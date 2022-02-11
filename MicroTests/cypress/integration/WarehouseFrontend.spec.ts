describe('Warehouse Test', () => {
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

  it('adds palette cy01', () =>{
    cy.get('#barcodeInput').type('cy01')
    cy.get('#productInput').type('red shoes')
    cy.get('#amountInput').type('11')
    cy.get('#locationInput').type('shelf 1')
    cy.get('#add-palette-button').click()
    cy.get('#cy01').contains('11')
    cy.get('#cy01').contains('red shoes')
    cy.get('#cy01').contains('shelf 1')
  })

  it('subscribes the shop as listener to the warehouse', () => {
    cy.request('POST', 'http://localhost:3000/subscribe',{
      subscribeUrl: 'http://localhost:3100/event',
      lastEventTime: '0'
    })
    .then((response) => {
      const eventList: any[] = response.body;
      expect(eventList.length).gt(0);
    })
  })

  it('add another palette of red shoes', () =>{
    cy.get('#add-button').click()
    cy.contains('Store new palette:')

    cy.get('#barcodeInput').type('cy02')
    cy.get('#productInput').type('red shoes')
    cy.get('#amountInput').type('24')
    cy.get('#locationInput').type('shelf 03')
    cy.get('#add-palette-button').click()
    cy.get('#cy02').contains('24')
    cy.get('#cy02').contains('red shoes')
    cy.get('#cy02').contains('shelf 03')
  })
})
