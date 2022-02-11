describe('The Shop Backend Test', () => {
  it('visits the shop backend', () => {
    cy.visit('http://localhost:3100/')
  })

  it('resets the shop database', () => {
    cy.visit('http://localhost:3100/reset')
  })

  it('posts a product stored event', () => {
    cy.request('POST', 'http://localhost:3100/event', {
      eventType: 'productStored',
      blockId: 'black_socks',
      time: '12:04',
      tags: [],
      payload: {
        product: 'black_socks',
        amount: 10,
      }
    })
    .then((response) => {
      const product = response.body;
      expect(product).have.property('product', 'black_socks')
      expect(product).have.property('amount',10);
    })
  })

  it('repeat the post without a achange', () => {
    cy.request('POST', 'http://localhost:3100/event', {
      eventType: 'productStored',
      blockId: 'black_socks',
      time: '12:04',
      tags: [],
      payload: {
        product: 'black_socks',
        amount: 10,
      }
    })
    .then((response) => {
      const product = response.body;
      expect(product).have.property('product', 'black_socks')
      expect(product).have.property('amount',10);
    })
  })

  it('sends an update with now 20 socks', () => {
    cy.request('POST', 'http://localhost:3100/event', {
      eventType: 'productStored',
      blockId: 'black_socks',
      time: '12:08',
      tags: [],
      payload: {
        product: 'black_socks',
        amount: 20,
      }
    })
    .then((response) => {
      const product = response.body;
      expect(product).have.property('product', 'black_socks')
      expect(product).have.property('amount',20);
    })
  })

  it('resets the database and sends the events in reverse order', () => {
    cy.visit('http://localhost:3100/reset');

    cy.request('POST', 'http://localhost:3100/event', {
      eventType: 'productStored',
      blockId: 'black_socks',
      time: '12:08',
      tags: [],
      payload: {
        product: 'black_socks',
        amount: 20,
      }
    })
    .then((response) => {
      const product = response.body;
      expect(product).have.property('product', 'black_socks')
      expect(product).have.property('amount',20);
    })

    cy.request('POST', 'http://localhost:3100/event', {
      eventType: 'productStored',
      blockId: 'black_socks',
      time: '12:04',
      tags: [],
      payload: {
        product: 'black_socks',
        amount: 10,
      }
    })
    .then((response) => {
      const product = response.body;
      expect(product).have.property('product', 'black_socks')
      expect(product).have.property('amount',20);
    })

  })

  it('sends an add offer for black_socks', () =>{
    cy.request('POST', 'http://localhost:3100/event', {
      eventType: 'addOffer',
      blockId: 'black_socks_price',
      time: '11:14',
      tags:[],
      payload: {
        product: 'black_socks',
        price: '$42',
      }
    })
    .then((response) =>{
      const product = response.body;
      expect(product).have.property('product', 'black_socks')
      expect(product).have.property('amount', 20)
      expect(product).have.property('price', '$42')
    })
  })

  it('sends an add offer for black_socks twice with other price', () =>{
    cy.request('POST', 'http://localhost:3100/event', {
      eventType: 'addOffer',
      blockId: 'black_socks_price',
      time: '11:14',
      tags:[],
      payload: {
        product: 'black_socks',
        price: '$48',
      }
    })
    .then((response) =>{
      const product = response.body;
      expect(product).to.be.undefined
    })

    cy.request('GET', 'http://localhost:3100/query/products')
    .then((response) => {
      const productsList: any[] = response.body;
      expect(productsList[0]).have.property('price', '$42')
    })
  })

  it('sends an place order command', () => {
    cy.request('POST', 'http://localhost:3100/event', {
      eventType:'placeOrder',
      blockId: 'o1121',
      time: '11:21',
      tags: [],
      payload: {
        code: 'o1121',
        product: 'black_socks',
        customer: 'Carli Customer',
        address: 'Wonderland 1',
        state: 'new order',
      }
    })
    .then((response) =>{
      const order = response.body;
      expect(order).have.property('product', 'black_socks')
      expect(order).have.property('customer', 'Carli Customer')
      expect(order).have.property('state', 'new order')
    })

    cy.request('GET', 'http://localhost:3100/query/customers')
    .then((response) => {
      const customerList: any[] = response.body;
      expect(customerList.length).gt(0);
    })
  })

  it('sends an place order command twice with other address', () => {
    cy.request('POST', 'http://localhost:3100/event', {
      eventType:'placeOrder',
      blockId: 'o1121',
      time: '11:21',
      tags: [],
      payload: {
        code: 'o1121',
        product: 'black_socks',
        customer: 'Carli Customer',
        address: 'Wonderland 38',
        state: 'new order',
      }
    })
    .then((response) =>{
      const newOrder = response.body;
      expect(newOrder).to.be.undefined
    })

    cy.request('GET', 'http://localhost:3100/query/orders')
    .then((response) => {
      const ordersList: any[] = response.body;
      expect(ordersList[0].address[0]).eqls('Wonderland 1');
    })

  })

})


