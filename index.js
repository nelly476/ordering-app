import { menuArray as foodData } from "/data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

const menuArray = JSON.parse(JSON.stringify(foodData));
const cardDetailsForm = document.getElementById("card-details-form");
const modal = document.getElementById("modal");
let totalPrice = 0;
let orderedItems = [];
const discountModal = document.getElementById("discount-modal");
let orderedBeers = [];
let orderedHamburgers = [];
let orderedPizzas = [];

setTimeout(function () {
  discountModal.style.display = "inline";
}, 1500);

function closeDiscount() {
  discountModal.style.display = "none";
}

document.addEventListener("click", function (e) {
  if (e.target.dataset.add) {
    addOrder(e.target.dataset.add);
  } else if (e.target.dataset.remove) {
    removeOrderItem(e.target.dataset.remove);
  } else if (e.target.dataset.complete) {
    completeOrder();
  } else if (e.target.dataset.close) {
    closeModal();
  } else if (e.target.dataset.discount) {
    closeDiscount();
  } else if (e.target.dataset.rate) {
    rateUs();
  }
});

function addOrder(itemId) {
  const targetItem = menuArray.filter(function (dish) {
    return dish.id == itemId;
  })[0];

  targetItem.number++;

  orderedItems.push(targetItem);

  renderOrder(targetItem.id);
}

function renderOrder(newItemId) {
  const targetItem = orderedItems.filter(function (item) {
    return item.id == newItemId;
  })[0];

  let orderHtml = `
  <div class="order-item">
  <div>
  <p class="selected-item-name">${targetItem.name} X ${targetItem.number} </p>
  <p class="remove-option" data-remove=${targetItem.id}>Remove</p>
  </div>
  <p>${targetItem.price}$</p>
  </div>
  `;

  const newDiv = document.createElement("div");

  if (targetItem.number == 1) {
    newDiv.innerHTML = orderHtml;
    newDiv.setAttribute("id", `item-${targetItem.id}`);
    document.getElementById("order-section").appendChild(newDiv);
  } else {
    updateOrderedItems(targetItem);
  }

  updateTotalPrice();
}

function updateOrderedItems(item) {
  const targetDiv = document.getElementById(`item-${item.id}`);

  let orderHtml = `
  <div class="order-item">
  <div>
  <p class="selected-item-name">${item.name} X ${item.number} </p>
  <p class="remove-option" data-remove=${item.id}>Remove</p>
  </div>
  <p>${item.price}$</p>
  </div>
  `;
  targetDiv.innerHTML = orderHtml;
}

function removeOrderItem(itemId) {
  const targetItem = orderedItems.filter(function (item) {
    return item.id == itemId;
  })[0];

  totalPrice -= targetItem.price;

  const index = orderedItems.indexOf(targetItem);
  if (index > -1) {
    orderedItems.splice(index, 1);
  }
  updateTotalPrice();
  updateOrder();
}

function updateTotalPrice() {
  document.getElementById("total-price").textContent = `${totalPrice}$`;
}

function updateOrder() {
  let orderHtml = "";
  orderedItems.forEach(function (item) {
    orderHtml += `
    <div class="order-item">
    <div>
    <p class="selected-item-name">${item.name} </p>
    <p class="remove-option" data-remove=${item.id}>Remove</p>
    </div>
    <p>${item.price}$</p>
    </div>
    `;
  });
  document.getElementById("order-section").innerHTML = orderHtml;
}

function completeOrder() {
  if (orderedItems.length > 0) {
    modal.style.display = "inline";
    cardDetailsForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const cardDetailsData = new FormData(cardDetailsForm);
      const name = cardDetailsData.get("name");

      let thankYouText = `
      <div class="close-btn-section">
      <button data-close="close" class="close-modal-btn">X</button>
      </div>
      <p class="thank-you-text">
      Thanks, ${name}! 
      Your order is on its way!
      </p>
      <div class="rate-us-btn-section">
      <button class="rate-us-btn" data-rate="rate">Rate us!</button>
      </div>
      `;
      modal.style.background = "#ECFDF5";
      modal.innerHTML = thankYouText;
    });
  } else {
    alert("You haven't selected any items :(");
  }
}

function rateUs() {
  let rateUsText = `
  <div class="rate-us-section">
<h2>Let us know how we're doing!</h2>
<div class="stars-section" id="star">
<a href="#" class="fas fa-star s1"></a>
<a href="#" class="fas fa-star s2"></a>
<a href="#" class="fas fa-star s3"></a>
<a href="#" class="fas fa-star s4"></a>
<a href="#" class="fas fa-star s5"></a>
</div>
</div>
`;
  modal.style.background = "";
  modal.innerHTML = rateUsText;
  document.getElementById("star").addEventListener("click", function () {
    let thankYouText = `
    <div class="close-btn-section">
    <button data-close="close" class="close-modal-btn">X</button>
    </div>
    <p class="thank-you-text">
    Thanks for the review! 
    Your order is on its way!
    </p>
    `;
    modal.innerHTML = thankYouText;
  });
}

function closeModal() {
  modal.style.display = "none";
}

function getFeedHtml() {
  let menuHtml = "";

  menuArray.forEach(function (item) {
    menuHtml += `
    <div class="item">
    <div class="item-details">
    <span class="emoji">${item.emoji}</span>
    <div class="item-description">
        <p>${item.name}</p>
        <p>${item.ingredients}</p>
        <p>${item.price}$</p>
    </div>
    </div>
    <span class="material-symbols-outlined" data-add="${item.id}">
add_circle
</span>
</div>    
    `;
  });
  return menuHtml;
}

function render() {
  document.getElementById("content").innerHTML = getFeedHtml();
}

render();
