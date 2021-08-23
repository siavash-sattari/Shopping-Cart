import {productsData} from "./products.js";

// Get Elements From DOM

const cartBtn = document.querySelector(".cart-btn");
const cartItems = document.querySelector(".cart-items");
const productsDOM = document.querySelector(".products-content");
const backDrop = document.querySelector(".backdrop");
const cartModal = document.querySelector(".cart");
const cartContent = document.querySelector(".cart-content");
const cartTotal = document.querySelector(".total-price");
const clearCartBtn = document.querySelector(".clear-cart");
const closeModal = document.querySelector(".confirm");

let cart = [];

let buttonsDOM = [];

// Get Products
class Products {
  getProducts() {
    return productsData;
  }
}

// Dispaly Products

class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((product) => {
      result += `<div class="product">
      <img src=${product.imageUrl} class="product-img" />
      <div class="product-footer">
        <div class="product-desc">
          <p class="product-price">${product.price}</p>
          <p class="product-title">${product.title}</p>
        </div>
        <button class="btn add-to-cart" data-id=${product.id}>add to cart</button>
      </div>
    </div>`;
    });
    productsDOM.innerHTML = result;
  }

  getCartBtns() {
    const addToCartBtns = [...document.querySelectorAll(".add-to-cart")];
    buttonsDOM = addToCartBtns;
    addToCartBtns.forEach((btn) => {
      const id = btn.dataset.id; // typeof(id) : string
      // Hatman Bayad == Bashe na === ! magar inke convert konim :)
      const isInCart = cart.find((item) => item.id == id);
      //   const isInCart = cart.find((item) => {
      //     console.log(typeof(item.id); // number
      //     console.log(typeof(id); // string
      //   });
      if (isInCart) {
        btn.innerText = "In Cart";
        btn.disabled = true;
        btn.classList.add("product-added");
      }
      btn.addEventListener("click", (e) => {
        e.target.innerHTML = "In Cart";
        // console.log(e.target);
        e.target.classList.add("product-added");
        e.target.disabled = true;
        // 1. Get Product From Products
        const addedProduct = {...Storage.getProduct(id), quantity: 1};
        // 2. Add Product To Cart
        cart = [...cart, addedProduct];
        // 3. Save Cart In Local Sotrage
        Storage.saveCart(cart);
        // 4. Set Cart Values
        this.setCartValue(cart);
        // 5. Dispaly Cart Item
        this.addCartItem(addedProduct);
      });
    });
  }

  setCartValue(cart) {
    let tempCartItems = 0;
    const totalPrice = cart.reduce((acc, curr) => {
      tempCartItems += curr.quantity;
      return curr.quantity * curr.price + acc;
    }, 0);
    cartTotal.innerText = `Total Price : $ ${parseFloat(totalPrice).toFixed(2)} `;
    cartItems.innerText = tempCartItems;
  }

  addCartItem(product) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `<img class="cart-item-img" src=${product.imageUrl} />
    <div class="cart-item-desc">
      <h4>${product.title}</h4>
      <h5>${product.price}</h5>
    </div>
    <div class="cart-item-controller">
      <i class="fas fa-chevron-up" data-id=${product.id}></i>
      <p>${product.quantity}</p>
      <i class="fas fa-chevron-down" data-id=${product.id}></i>
    </div>
  <i class="fas fa-trash remove-item" data-id=${product.id}></i>
  </div>
 `;
    cartContent.appendChild(div);
  }

  setupApp() {
    cart = Storage.getCart();
    this.setCartValue(cart);
    this.populateCart(cart);
    // this.getCartBtns();
  }

  populateCart(cart) {
    cart.forEach((item) => this.addCartItem(item));
  }

  cartLogic() {
    // Clear Cart Button
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    });

    // Cart Functionality
    cartContent.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-item")) {
        const removeItem = e.target;
        const id = removeItem.dataset.id;
        console.log(id);
        // Remove From DOM :
        // console.log(removeItem.parentElement);
        cartContent.removeChild(removeItem.parentElement);
        // Remove Item From Cart , Not DOM !
        this.removeItem(id);
      } else if (e.target.classList.contains("fa-chevron-up")) {
        const addQuantity = e.target;
        const id = addQuantity.dataset.id;
        const addedItem = cart.find((c) => c.id == id);
        addedItem.quantity++;
        // Update Storage
        Storage.saveCart(cart);
        // Update Total Price
        this.setCartValue(cart);
        // Update Item Quantity
        // console.log(addQuantity.nextElementSibling);
        addQuantity.nextElementSibling.innerText = addedItem.quantity;
      } else if (e.target.classList.contains("fa-chevron-down")) {
        const subQuantity = e.target;
        const id = subQuantity.dataset.id;
        const substractedItem = cart.find((c) => c.id == id);
        if (substractedItem.quantity === 1) {
          this.removeItem(id);
          cartContent.removeChild(subQuantity.parentElement.parentElement);
          return;
        }
        substractedItem.quantity--;
        // Update Storage
        Storage.saveCart(cart);
        // Update Total Price
        this.setCartValue(cart);
        // Update Item Quantity :
        // console.log(subQuantity.previousElementSibling);
        subQuantity.previousElementSibling.innerText = substractedItem.quantity;
      }
    });
  }

  clearCart() {
    // Loop On All The Item And Tigger Remove For Each One
    cart.forEach((item) => this.removeItem(item.id));
    // console.log(cartContent.children[0]);
    while (cartContent.children.length) {
      cartContent.removeChild(cartContent.children[0]);
    }
    closeModalFunction();
  }

  removeItem(id) {
    // Reusable Method For Signle Remove And Clear All
    cart = cart.filter((cartItem) => cartItem.id != id);
    this.setCartValue(cart);
    Storage.saveCart(cart);
    const button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `add to cart`;
    button.classList.remove("product-added");
  }

  getSingleButton(id) {
    // Should Be ParseInt To Get Correct Result
    return buttonsDOM.find((btn) => parseInt(btn.dataset.id) === parseInt(id));
  }
}

// Storage

class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProduct(id) {
    const _products = JSON.parse(localStorage.getItem("products"));
    return _products.find((p) => p.id == id);
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Set Up Already Added Cart Items
  const ui = new UI();
  ui.setupApp();
  // Get All Products
  const products = new Products();
  const productsData = products.getProducts();
  ui.displayProducts(productsData);
  ui.getCartBtns();
  ui.cartLogic();
  Storage.saveProducts(productsData);
});

cartBtn.addEventListener("click", showModalFunction);
closeModal.addEventListener("click", closeModalFunction);
backDrop.addEventListener("click", closeModalFunction);

function showModalFunction() {
  backDrop.style.display = "block";
  cartModal.style.display = "block";
}

function closeModalFunction() {
  backDrop.style.display = "none";
  cartModal.style.display = "none";
}
