import { menuArray as foodData } from "/data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

const menuArray = JSON.parse(JSON.stringify(foodData));
const cardDetailsForm = document.getElementById("card-details-form");
const modal = document.getElementById("modal");
let totalPrice = 0;
let orderedItems = [];

document.addEventListener("click", function (e) {
  if (e.target.dataset.add) {
    addOrder(e.target.dataset.add);
  } else if (e.target.dataset.remove) {
    removeOrderItem(e.target.dataset.remove);
  } else if (e.target.dataset.complete) {
    completeOrder();
  } else if (e.target.dataset.close) {
    closeModal();
  }
});

function addOrder(itemId) {
  const targetItem = menuArray.filter(function (dish) {
    return dish.id == itemId;
  })[0];

  let newOrderItem = {
    name: targetItem.name,
    price: targetItem.price,
    id: uuidv4(),
  };

  orderedItems.push(newOrderItem);

  renderOrder(newOrderItem.id);
}

function renderOrder(newItemId) {
  const targetItem = orderedItems.filter(function (item) {
    return item.id == newItemId;
  })[0];

  let orderHtml = `
  <div class="order-item">
  <div>
  <p class="selected-item-name">${targetItem.name} </p>
  <p class="remove-option" data-remove=${targetItem.id}>Remove</p>
  </div>
  <p>${targetItem.price}$</p>
  </div>
  `;

  document.getElementById("order-section").innerHTML += orderHtml;
  totalPrice += targetItem.price;
  document.getElementById("total-price").textContent = `${totalPrice}$`;
}

function removeOrderItem(itemId) {
  const targetItem = orderedItems.filter(function (item) {
    return item.id == itemId;
  })[0];

  const index = orderedItems.indexOf(targetItem);
  if (index > -1) {
    orderedItems.splice(index, 1);
  }
  updateOrder();
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
      `;
      modal.style.background = "#ECFDF5";
      modal.innerHTML = thankYouText;
    });
  } else {
    alert("You haven't selected any items :(");
  }
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
