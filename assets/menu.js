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

const btnAddCard = document.getElementById("btn-add-cart");
const modal = document.getElementById("staticBackdrop");

let count = 1;

let addProduct = [];

let selectedData = null;

document.addEventListener("DOMContentLoaded", function () {
  addProduct = JSON.parse(localStorage.getItem("cart")) || [];

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
              <p class="fredoka-font-bold my-0 productName">${item.name}</p>
              <p class="fredoka-font my-0" style="font-size: 0.8rem">
                ${item.descripsi}
              </p>
              <div class="w-100 d-flex flex-column flex-md-row flex-lg-row justify-content-between align-items-lg-center align-items-end mt-3">
                <p class="my-0 fredoka-font w-100">
                  Rp. ${item.price.toLocaleString("id-ID")}
                </p>
                <div
                    class="w-100 d-flex justify-content-end align-items-center gap-3 mt-3 mt-md-2 mt-lg-0 d-none btn-card"
                  >
                    <button
                      type="button"
                      class="btn rounded-5 btn-unactive-menu"
                      style="padding: 6px 9px"
                      onclick="delCountCard('${item.name}')"
                    >
                      <i class="bi bi-dash"></i>
                    </button>
                    <p class="my-0 quantity"></p>
                    <button
                      type="button"
                      class="btn rounded-5 btn-unactive-menu"
                      style="padding: 6px 9px"
                      onclick="addCountCard('${item.name}')"
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
      const radios = document.querySelectorAll('input[name="radioDefault"]');
      const name = document.getElementById("detailName");
      const description = document.getElementById("detailDescription");
      const image = document.getElementById("detailImage");
      const price = document.getElementById("detailPrice");

      count = 1;

      modal.querySelector(".quantity").innerText = count;

      radios.forEach((radio) => {
        radio.checked = radio.value === "small";
      });

      name.innerText = this.dataset.name;
      description.innerText = this.dataset.descripsi;
      image.src = this.dataset.image;
      price.innerText =
        "Rp. " + Number(this.dataset.price).toLocaleString("id-ID");

      selectedData = {
        name: this.dataset.name,
        type: "small",
        quantity: count,
        unitPrice: Number(this.dataset.price),
        price: Number(this.dataset.price),
      };

      radios.forEach((radio) => {
        radio.addEventListener("change", function () {
          const type = this.value;

          const selectedProduct = products.find(
            (p) => p.name === name.innerText,
          );

          if (selectedProduct) {
            let finalPrice = selectedProduct.price;

            if (type === "large") {
              finalPrice += 10000;
            }

            if (selectedData) {
              selectedData = {
                name: selectedData.name,
                type: this.value,
                quantity: selectedData.quantity,
                unitPrice: finalPrice,
                price: finalPrice * selectedData.quantity,
              };

              price.innerText =
                "Rp. " +
                (finalPrice * selectedData.quantity).toLocaleString("id-ID");
            }
          }
        });
      });
    });
  });

  updateCartDisplay();
});

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
  if (count > 1) {
    count--;

    modal.querySelector(".quantity").innerText = count;

    if (selectedData) {
      selectedData.quantity = count;
      selectedData.price = selectedData.unitPrice * count;

      document.getElementById("detailPrice").innerText =
        "Rp. " + selectedData.price.toLocaleString("id-ID");
    }
  }
};

const addCountCard = (name) => {
  if (addProduct.length > 0) {
    addProduct = addProduct.map((item) => {
      if (name === item.name) {
        const newQuantity = item.quantity + 1;

        return {
          ...item,
          quantity: newQuantity,
          price: item.unitPrice * newQuantity,
        };
      }

      return item;
    });

    updateCartDisplay();
  }
};

const delCountCard = (name) => {
  if (addProduct.length > 0) {
    addProduct = addProduct
      .map((item) => {
        if (name === item.name) {
          const newQuantity = item.quantity - 1;

          return {
            ...item,
            quantity: newQuantity,
            price: item.unitPrice * newQuantity,
          };
        }

        return item;
      })
      .filter((item) => item.quantity > 0);

    updateCartDisplay();
  }

  // console.log(addProduct);
};

const updateCartDisplay = () => {
  const cards = document.querySelectorAll(".menu-card");

  cards.forEach((card) => {
    const name = card.dataset.name;
    const product = addProduct.find((item) => item.name === name);

    if (product) {
      card.querySelector(".quantity").innerHTML = product.quantity;
      card.querySelector(".btn-card").classList.remove("d-none");
      card.querySelector(".btn-detail").classList.add("d-none");
    } else {
      card.querySelector(".btn-card").classList.add("d-none");
      card.querySelector(".btn-detail").classList.remove("d-none");
    }
  });

  if (addProduct.length > 0) {
    document.getElementById("bar-checkout").classList.remove("d-none");

    let totalPrice = 0;
    let totalQuantity = 0;

    addProduct.forEach((item) => {
      totalPrice += item.price;
      totalQuantity += item.quantity;
    });

    document.getElementById("bar-item").innerText = totalQuantity + " Item";
    document.getElementById("bar-price").innerHTML =
      "Rp. " +
      totalPrice.toLocaleString("id-ID") +
      ` <i class="bi bi-basket3-fill"></i>`;
  } else {
    document.getElementById("bar-checkout").classList.add("d-none");

    localStorage.setItem("cart", JSON.stringify(addProduct));
  }
};

btnAddCard.addEventListener("click", () => {
  addProduct.push(selectedData);

  updateCartDisplay();
});

const btnCheckout = document.getElementById("btn-checkout");

btnCheckout.addEventListener("click", () => {
  localStorage.setItem("cart", JSON.stringify(addProduct));
});
