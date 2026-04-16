const products = [
  {
    name: "Crispy Chicken Burger",
    descripsi:
      "Crispy fried chicken with fresh lettuce and creamy sauce in a soft burger bun.",
    price: 25000,
    image: "public/Crispy-Chicken-Burger.png",
  },
  {
    name: "Double Cheese Burger",
    descripsi:
      "Crispy fried chicken with fresh lettuce and creamy sauce in a soft burger bun.",
    price: 32000,
    image: "public/double-cheese-burger.png",
  },
  {
    name: "Mushroom Burger",
    descripsi:
      "Crispy fried chicken with fresh lettuce and creamy sauce in a soft burger bun.",
    price: 23000,
    image: "public/mushroom-burger.png",
  },
];

let count = 1;

let addProduct = [];

let selectedData = null;

document.addEventListener("DOMContentLoaded", function () {
  const menuSection = document.getElementById("menu-section");

  menuSection.innerHTML = products
    .map((item) => {
      return `
        <div class="col menu-card" data-name="${item.name}">
          <div class="h-auto bg-light shadow-lg rounded d-flex justify-content-start align-items-center gap-3"
               style="padding: 20px 25px;">
            <img
              src="${item.image}"
              alt="${item.name}"
              class="object-fit-contain"
              style="width: 100px"
            />
            <div class="d-flex flex-column justify-content-center align-items-start gap-1">
              <p class="fredoka-font-bold my-0">${item.name}</p>
              <p class="fredoka-font my-0" style="font-size: 0.8rem">
                ${item.descripsi}
              </p>
              <div class="w-100 d-flex flex-column flex-md-row flex-lg-row justify-content-between align-items-lg-center align-items-end mt-3">
                <p class="my-0 fredoka-font">
                  Rp. ${item.price.toLocaleString("id-ID")}
                </p>
                <div
                    class="w-100 d-flex justify-content-end  align-items-center gap-3 mt-3 mt-md-2 mt-lg-0 d-none btn-card"
                  >
                    <button
                      type="button"
                      class="btn rounded-5 btn-unactive btn-minus"
                      style="padding: 6px 10px"
                    >
                      <i class="bi bi-dash"></i>
                    </button>
                    <p class="my-0 quantity"></p>
                    <button
                      type="button"
                      class="btn rounded-5 btn-unactive btn-plus"
                      style="padding: 6px 10px"
                    >
                      <i class="bi bi-plus"></i>
                    </button>
                  </div>

                <button
                  type="button"
                  class="btn rounded-5 btn-active btn-detail mt-2 mt-lg-0"
                  style="padding: 6px 10px"
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop"
                  data-name="${item.name}"
                  data-image="${item.image}"
                  data-descripsi="${item.descripsi}"
                  data-price=${item.price}
                >
                  <i class="bi bi-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  const detailButtons = document.querySelectorAll(".btn-detail");

  detailButtons.forEach((button) => {
    button.addEventListener("click", function () {
      count = 1;

      modal.querySelector(".quantity").innerText = count;

      radios.forEach((radio) => {
        radio.checked = radio.value === "small";
      });

      document.getElementById("detailName").innerText = this.dataset.name;
      document.getElementById("detailDescription").innerText =
        this.dataset.descripsi;
      document.getElementById("detailImage").src = this.dataset.image;
      document.getElementById("detailPrice").innerText =
        "Rp. " + Number(this.dataset.price).toLocaleString("id-ID");

      selectedData = {
        name: this.dataset.name,
        type: "small",
        quantity: count,
        unitPrice: Number(this.dataset.price),
        price: Number(this.dataset.price),
      };
    });
  });

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.forEach((item) => {
    const card = document.querySelector(`[data-name="${item.name}"]`);

    if (card) {
      card.querySelector(".quantity").innerHTML = item.quantity;
      card.querySelector(".btn-card").classList.remove("d-none");
      card.querySelector(".btn-detail").classList.add("d-none");
    }
  });

  if (cart.length > 0) {
    document.getElementById("bar-checkout").classList.remove("d-none");

    let totalPrice = 0;
    let totalQuantity = 0;

    for (let index = 0; index < cart.length; index++) {
      totalPrice += cart[index].price;
      totalQuantity += cart[index].quantity;
    }

    document.getElementById("bar-item").innerText = totalQuantity + " Item";
    document.getElementById("bar-price").innerHTML =
      "Rp. " +
      Number(totalPrice).toLocaleString("id-ID") +
      `<i class="bi bi-basket3-fill"></i>`;
  } else {
    document.getElementById("bar-checkout").classList.add("d-none");
  }
});

const radios = document.querySelectorAll('input[name="radioDefault"]');

radios.forEach((radio) => {
  radio.addEventListener("change", function () {
    const type = this.value;

    const name = document.getElementById("detailName").innerText;
    const price = document.getElementById("detailPrice");

    const selectedProduct = products.find((p) => p.name === name);

    if (selectedProduct) {
      let finalPrice = selectedProduct.price;

      if (type === "large") {
        finalPrice += 10000;
      }

      if (selectedData) {
        selectedData = {
          name,
          type,
          quantity: count,
          unitPrice: finalPrice,
          price: finalPrice * selectedData.quantity,
        };

        price.innerText =
          "Rp. " + (finalPrice * selectedData.quantity).toLocaleString("id-ID");
      } else {
        selectedData = {
          name,
          type,
          quantity: count,
          unitPrice: finalPrice,
          price: finalPrice,
        };

        price.innerText = "Rp. " + finalPrice.toLocaleString("id-ID");
      }
    }
  });
});

const modal = document.getElementById("staticBackdrop");

const addCount = () => {
  count++;

  modal.querySelector(".quantity").innerText = count;

  if (selectedData) {
    selectedData.quantity = count;
    selectedData.price = selectedData.unitPrice * count;

    document.getElementById("detailPrice").innerText =
      "Rp. " + selectedData.price.toLocaleString("id-ID");
  }
};

const delCount = () => {
  count--;

  modal.querySelector(".quantity").innerText = count;

  if (selectedData) {
    selectedData.quantity = count;
    selectedData.price = selectedData.unitPrice * count;

    document.getElementById("detailPrice").innerText =
      "Rp. " + selectedData.price.toLocaleString("id-ID");
  }
};

modal.querySelector(".btn-plus").addEventListener("click", addCount);
modal.querySelector(".btn-minus").addEventListener("click", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  console.log(this.dataset.name);

  if (count == 1) {
    return;
  }

  delCount();
});

const btnAddCard = document.getElementById("btn-add-cart");

btnAddCard.addEventListener("click", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.push(selectedData);

  localStorage.setItem("cart", JSON.stringify(cart));

  cart.forEach((item) => {
    const card = document.querySelector(`[data-name="${item.name}"]`);

    if (card) {
      card.querySelector(".quantity").textContent = item.quantity;
      card.querySelector(".btn-card").classList.remove("d-none");
      card.querySelector(".btn-detail").classList.add("d-none");
    }
  });

  if (cart.length > 0) {
    document.getElementById("bar-checkout").classList.remove("d-none");

    let totalPrice = 0;
    let totalQuantity = 0;

    for (let index = 0; index < cart.length; index++) {
      totalPrice += cart[index].price;
      totalQuantity += cart[index].quantity;
    }

    document.getElementById("bar-item").innerText = totalQuantity + " Item";
    document.getElementById("bar-price").innerHTML =
      "Rp. " +
      Number(totalPrice).toLocaleString("id-ID") +
      `<i class="bi bi-basket3-fill"></i>`;
  }
});
