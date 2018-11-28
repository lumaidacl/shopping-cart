(()=>{
  console.log('Starting store');

  const SERVER = 'http://localhost:3000';
  const productsTarget = document.getElementById('products');
  const cartTarget = document.getElementById('cart');
  const counterTarget = document.getElementById('counter');

  $qS = (id, element)=>{
    return document.querySelector(`#product-${id} .product-item__${element}`);
  }

  class Store{
    constructor(productsDOM, carTDOM, counterDOM){
      this.cartItems = {};
      this.productsContainer = productsDOM;
      this.cartContainer = carTDOM;
      this.counterContainer = counterDOM;
    }

    addToCart(product){

      if(!(product._id in this.cartItems)){
        this.cartItems[product._id] = Object.assign({}, product);
        this.cartItems[product._id].items  = 0;
      }
      this.cartItems[product._id].items++;
      product.stock--;
      this.renderCart();
      return product.stock;
    }

    attachToProducts(product){
      let productHTML = `
        <div class="product-item" id="product-${product._id}">
          <img class="product-item__picture" src="${product.picture}" alt="${product.name}">
          <h2 class="product-item__name">${product.name}</h2>
          <p class="product-item__description">${product.about}</p>
          <div class="product-item__stock">Stock:${product.stock}</div> 
          <div class="product-item__price">
            <button class="product-item__button" data-product="${product._id}">Add to cart</button>
            Price: ${product.price} BS
          </div> 
          
        </div>
      `;
      this.productsContainer.innerHTML += productHTML;
    }

    attachActions(){
      let selector = `.product-item__button`;
      let buttons = document.querySelectorAll(selector);
      for (let button_index = 0; button_index < buttons.length; button_index++) {
        buttons[button_index].addEventListener('click', function(element) {
          let product = this.products.find(product => product._id === element.target.dataset.product);
          if(product.stock){
            product.stock = this.addToCart(product);
            $qS(product._id,"stock").innerHTML = "Stock:"+product.stock;
          }

        }.bind(this));
      }
    }

    renderCart(){
      this.cartContainer.innerHTML = "";
      let total = 0;
      let totalItems = 0;
      for(let index in this.cartItems){
        let product = this.cartItems[index];
        let subtotal = (+product.items * +product.price).toFixed(2);
        totalItems += +product.items;
        total += +subtotal;

        let productHTML = `
        <div class="cart-item" id="cart-${product._id}">
          <div class="cart-item__picture">
              <img class="cart-item__img" src="${product.picture}" alt="${product.name}">
          </div>
          <div class="cart-item__info">
            <h2 class="cart-item__name">${product.name}</h2>
            <span class="cart-item__items">${product.items} x ${product.price} BS = </span> 
            <span class="cart-item__price">$${subtotal} BS</span>
          </div>
        </div>
        `;
        this.cartContainer.innerHTML += productHTML;
      }
      this.counterContainer.innerHTML =  `<span  class="cart-icon__counter">${totalItems}</span>` ;

      this.cartContainer.innerHTML += `<div class="cart-total">
            <p>Total $${total.toFixed(2)} BS</p>
            <button class="cart-item__gotocart">Proceed to checkout</button>
         </div>`;
    }

    render(){
      this.counterContainer.addEventListener('click', function(element) {
        cartTarget.style.display = cartTarget.style.display === "block" ? "none":"block";
      });
      this.products.map( product => this.attachToProducts(product) );
      this.attachActions();
      this.renderCart();
    }

    async start(){
      let data = await fetch(`${SERVER}/data/products.json`);
      this.products = await data.json();
      this.render();
    }
  }

  let list = new Store(productsTarget, cartTarget, counterTarget);
  list.start();

})();