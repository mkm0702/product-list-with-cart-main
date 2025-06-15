let allProducts = [];
let cart = [];
const productGrid = document.querySelector(".products-grid");
const container = document.querySelector(".container");
const cartContainer = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const carbonNeutral = document.querySelector(".carbon-neutral");
const confirmOrderBtn = document.querySelector(".confirm-order-btn");
const emptyCart = document.querySelector(".empty-cart");
const cartHeader = document.querySelector(".cart-header");
const cartTotalAmount = document.querySelector(".cart-total-amount");





class CartItem {
  constructor(itemPrice, itemName, itemCategory, itemImageSrc, itemQuantity) {
    this.itemPrice = itemPrice;
    this.itemName = itemName;
    this.itemCategory = itemCategory;
    this.itemImageSrc = itemImageSrc;
    this.itemQuantity = itemQuantity;
  }

  get totalPrice() {
    return this.itemPrice * this.itemQuantity;
  }
}

fetch("data.json")
  .then((res) => res.json())
  .then((data) => {
    allProducts = data;

    showProducts();
  });

function showProducts() {
  allProducts.forEach((product) => {
    const productImageSrc = product.image.desktop;
    const productName = product.name;
    const productCategory = product.category;
    const productPrice = product.price;

    const cardProduct = document.createElement("div");
    cardProduct.classList.add("product-card");

    cardProduct.setAttribute("data-product", productName);

    cardProduct.innerHTML = `
      <img src="${productImageSrc}" alt="Waffle with Berries" class="product-image">
                    <button class="add-to-cart-btn">
                        <span class="cart-icon"></span>
                        Add to Cart
                    </button>
                    <div class="quantity-controls hidden">
                        <button class="quantity-btn" data-action="decrease">−</button>
                        <span class="quantity-display">1</span>
                        <button class="quantity-btn" data-action="increase">+</button>
                    </div>
                    <div class="product-category">${productCategory}</div>
                    <div class="product-name">${productName}</div>
                    <div class="product-price">$${productPrice}</div>
      `;

    productGrid.appendChild(cardProduct);
  });
}

container.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart-btn")) {
    const product = e.target.closest(".product-card");

    const cartBtn = e.target;
    cartBtn.classList.add("hidden");

    const quantityControls = product.querySelector(".quantity-controls");
    quantityControls.classList.remove("hidden");

    const productName = product.querySelector(".product-name").innerText;
    const productCategory =
      product.querySelector(".product-category").innerText;
    const productPrice = product.querySelector(".product-price").innerText;
    const productImageSrc = product
      .querySelector(".product-image")
      .getAttribute("src");

    const cartItem = new CartItem(
      productPrice,
      productName,
      productCategory,
      productImageSrc,
      1
    );

    if (cart.find((cartItem) => cartItem.itemName == productName)) {
      let quantityP = cart.find((cartItem) => cartItem.itemName == productName);

      quantityP.itemQuantity = quantityP.itemQuantity + 1;
    } else {
      cart.push(cartItem);
    }
    showCart();
  }

  if (e.target.classList.contains("quantity-btn")) {
    const product = e.target.closest(".product-card");
    const productName = product.querySelector(".product-name").innerText;
    let quantityDisplay = product.querySelector(".quantity-display").innerText;
    console.log(quantityDisplay);

    if (e.target.getAttribute("data-action") == "increase") {
      if (cart.find((cartItem) => cartItem.itemName == productName)) {
        let quantityP = cart.find(
          (cartItem) => cartItem.itemName == productName
        );

        quantityP.itemQuantity = quantityP.itemQuantity + 1;

        product.querySelector(".quantity-display").innerText =
          quantityP.itemQuantity;

        console.log(cart);
        showCart();
      }
    } else {
      console.log("a");
      if (cart.find((cartItem) => cartItem.itemName == productName)) {
        console.log("b");

        let quantityP = cart.find(
          (cartItem) => cartItem.itemName == productName
        );

        if (product.querySelector(".quantity-display").innerText == 1) {
          console.log(cart);

          cart = cart.filter((cartItem) => {
            return cartItem.itemName !== productName;
          });

          console.log(cart);

          const addToCartBtn = product.querySelector(".add-to-cart-btn");
          addToCartBtn.classList.remove("hidden");

          const quantityControls = product.querySelector(".quantity-controls");

          quantityControls.classList.add("hidden");

          showCart();
        } else {
          let quantityP = cart.find(
            (cartItem) => cartItem.itemName == productName
          );

          quantityP.itemQuantity = quantityP.itemQuantity - 1;

          product.querySelector(".quantity-display").innerText =
            quantityP.itemQuantity;

          console.log(cart);
          showCart();
        }
      }
    }
  }
});


function showCart() {
  // Clear previous cart items to prevent duplicates

  let totalQuantity = 0;

  let totalPrice = 0;

  cart.forEach((cartItem) =>{
    totalQuantity += cartItem.itemQuantity;
    totalPrice += (parseInt(cartItem.itemPrice.replace("$", "")) * cartItem.itemQuantity);
    
  });
  cartHeader.innerHTML = `Your cart(${totalQuantity})`;
  cartTotalAmount.innerHTML = `$${totalPrice}`;




  if(cart.length == 0){

    cartTotal.classList.add("hidden");
    carbonNeutral.classList.add("hidden");
    confirmOrderBtn.classList.add("hidden");

    emptyCart.classList.remove("hidden");

  }else{

    cartTotal.classList.remove("hidden");
    carbonNeutral.classList.remove("hidden");
    confirmOrderBtn.classList.remove("hidden");

    emptyCart.classList.add("hidden");

  }


 
  cartContainer.innerHTML = "";

  cart.forEach((cartItem) => {
    const cartI = document.createElement("div");
    cartI.classList.add("cart-item");

    const total = (parseFloat(cartItem.itemPrice.replace("$", "")) * cartItem.itemQuantity).toFixed(2);

    cartI.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-name">${cartItem.itemName}</div>
        <div class="cart-item-details">
          <span class="cart-item-quantity">${cartItem.itemQuantity}x</span>
          <span class="cart-item-price">@ $${cartItem.itemPrice}</span>
          <span class="cart-item-total">$${total}</span>
        </div>
      </div>
      <button class="cart-item-remove">×</button>
    `;

    // ✅ Append the DOM element, not the array
    cartContainer.appendChild(cartI);
  });
}

