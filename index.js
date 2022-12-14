import { menuArray as foodData } from "/data.js";

const menuArray = JSON.parse(JSON.stringify(foodData));
const cardDetailsForm = document.getElementById("card-details-form");
const modal = document.getElementById("modal");
let totalPrice = 0;
let orderedItems = [];
const discountModal = document.getElementById("discount-modal");
let orderedBeers = [];
let orderedHamburgers = [];
let sumOfOrdered = [];

setTimeout(() => {
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
  const targetItem = menuArray.filter((dish) => dish.id == itemId)[0];

  targetItem.number++;

  orderedItems.push(targetItem);
  sumOfOrdered.push(targetItem.price);
  updateTotalPrice();
  renderOrder(targetItem.id);
}

function renderOrder(newItemId) {
  const targetItem = orderedItems.filter((item) => item.id == newItemId)[0];

  let orderHtml = `
  <div class="order-item">
  <div>
  <p class="selected-item-name">${targetItem.name} X ${targetItem.number} </p>
  <p class="remove-option" data-remove=${targetItem.id}>Remove</p>
  </div>
  <p>${targetItem.price}$</p>
  </div>
  `;

  if (targetItem.number == 1) {
    const newDiv = document.createElement("div");
    newDiv.innerHTML = orderHtml;
    newDiv.setAttribute("id", `item-${targetItem.id}`);
    document.getElementById("order-section").appendChild(newDiv);
  } else {
    updateOrderedItems(targetItem);
  }

  if (targetItem.id == 1) {
    orderedHamburgers.push(targetItem);
  } else if (targetItem.id == 2) {
    orderedBeers.push(targetItem);
  }
  checkForDiscount();
}

function updateOrderedItems(item) {
  const targetDiv = document.getElementById(`item-${item.id}`);

  if (item.number > 0) {
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
  } else {
    targetDiv.remove();
  }
}

function removeOrderItem(itemId) {
  const targetItem = orderedItems.filter(function (item) {
    return item.id == itemId;
  })[0];

  targetItem.number--;

  if (targetItem.id == 1) {
    orderedHamburgers.pop();
  } else if (targetItem.id == 2) {
    orderedBeers.pop();
  }
  checkForDiscount();
  const itemIndex = sumOfOrdered.indexOf(targetItem.price);
  if (itemIndex > -1) {
    sumOfOrdered.splice(itemIndex, 1);
  }
  updateOrderedItems(targetItem);
  updateTotalPrice();
}

function updateTotalPrice() {
  totalPrice = sumOfOrdered.reduce((a, b) => a + b, 0);

  document.getElementById("total-price").textContent = `${totalPrice}$`;
}

function checkForDiscount() {
  if (orderedBeers.length >= 2 && orderedHamburgers.length >= 2) {
    totalPrice -= 8;
    document.getElementById("discount-applied-text").style.display = "inline";
  } else {
    updateTotalPrice();
    document.getElementById("discount-applied-text").style.display = "none";
  }
}

function completeOrder() {
  if (orderedItems.length > 0 && totalPrice > 0) {
    const addIcons = document.getElementsByClassName("add-icon");
    addIcons[0].style.display = "none";
    addIcons[1].style.display = "none";
    addIcons[2].style.display = "none";

    document.getElementById(
      "final-total"
    ).textContent = `Total: ${totalPrice}$`;
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
    <span id="add-icon" class="material-symbols-outlined add-icon" data-add="${item.id}">
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
