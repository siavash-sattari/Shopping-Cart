import {productsData} from "./products.js";

// Get Elements From DOM

const cartBtn = document.querySelector(".cart-btn");
const cartItems = document.querySelector(".cart-items");
const productsDOM = document.querySelector(".products-content");
const backDrop = document.querySelector(".backdrop");
const cartModal = document.querySelector(".cart");
const cartContent = document.querySelector(".cart-content");
const cartTotal = document.querySelector(".cart-total");
const clearCartBtn = document.querySelector(".clear-cart");
const closeModal = document.querySelector(".confirm");

// class Products : Get Products

class Products {
  getProducts() {
    return productsData;
  }
}

// class UI : Dispaly Products

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
        <button class="btn add-to-cart" data-id=${product.id}><i class="fas fa-shopping-cart"></i>add to cart</button>
      </div>
    </div>`;
    });
    productsDOM.innerHTML = result;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Get All Products
  const products = new Products();
  const ui = new UI();
  const productsData = products.getProducts();
  ui.displayProducts(productsData);
});
