document.addEventListener("DOMContentLoaded", () => {
  const products = getProducts();
  const menuSection = document.getElementById("menu-section");

  menuSection.innerHTML = products
    .map((item) => {
      return `<div class="col menu-card" data-name="${item.name}">
              <div
                class="h-auto bg-white shadow rounded d-flex justify-content-start align-items-center gap-3"
                style="padding: 20px 25px"
              >
                <img
                  src="public/Crispy-Chicken-Burger.png"
                  alt="${item.name}"
                  class="object-fit-contain"
                  style="width: 80px"
                />
                <div
                  class="w-100 d-flex flex-column justify-content-center align-items-start gap-1"
                >
                  <p class="fredoka-font-bold my-0 productName">
                    ${item.name}
                  </p>
                  <p class="fredoka-font my-0" style="font-size: 0.8rem">
                    Size: ${item.type}
                  </p>
                  <div
                    class="w-100 d-flex flex-column flex-md-row flex-lg-row justify-content-between align-items-lg-center align-items-end"
                  >
                    <p class="my-0 fredoka-font w-100 price">Rp. ${item.price.toLocaleString("id-ID")}</p>
                    <div
                      class="w-100 d-flex justify-content-end align-items-center gap-3 mt-3 mt-md-2 mt-lg-0 btn-card"
                    >
                      <button
                        type="button"
                        class="btn rounded-5 btn-unactive"
                        style="padding: 6px 9px"
                        onclick="delCountCard('${item.name}')"
                      >
                        <i class="bi bi-dash"></i>
                      </button>
                      <p class="my-0 quantity">${item.quantity}</p>
                      <button
                        type="button"
                        class="btn rounded-5 btn-unactive"
                        style="padding: 6px 9px"
                        onclick="addCountCard('${item.name}')"
                      >
                        <i class="bi bi-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>`;
    })
    .join("");

  updateCartDisplay();
});

const getProducts = () => {
  products = JSON.parse(localStorage.getItem("cart")) || [];

  if (products.length === 0) {
    window.location.href = "menu.html";
  }

  return products;
};

const updateCartDisplay = () => {
  const cards = document.querySelectorAll(".menu-card");
  const products = getProducts();
  const subtotal = document.getElementById("subtotal");
  const total = document.getElementById("total");

  let totalPrice = 0;

  cards.forEach((card) => {
    const name = card.dataset.name;
    const product = products.find((item) => item.name === name);

    if (product) {
      card.querySelector(".quantity").innerText = product.quantity;
      card.querySelector(".price").innerText =
        "Rp. " + product.price.toLocaleString("id-ID");
    } else {
      card.classList.add("d-none");
    }

    if (products.length > 0) {
      totalPrice += product.price;
    }
  });

  subtotal.innerText = "Rp. " + totalPrice.toLocaleString("id-ID");
  total.innerText = "Rp. " + totalPrice.toLocaleString("id-ID");
};

const addCountCard = (name) => {
  let products = getProducts();

  products = products.map((item) => {
    if (item.name === name) {
      const newQuantity = item.quantity + 1;

      return {
        ...item,
        quantity: newQuantity,
        price: item.unitPrice * newQuantity,
      };
    }

    return item;
  });

  localStorage.setItem("cart", JSON.stringify(products));
  updateCartDisplay();
};

const delCountCard = (name) => {
  let products = getProducts();

  products = products
    .map((item) => {
      if (item.name === name) {
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

  localStorage.setItem("cart", JSON.stringify(products));

  if (products.length === 0) {
    window.location.href = "menu.html";
  } else {
    updateCartDisplay();
  }
};

const radios = document.querySelectorAll('input[name="payment_method"]');

let payment;

radios.forEach((radio) => {
  radio.addEventListener("change", function () {
    payment = this.value;
  });
});

const myModal = document.getElementById("staticBackdrop");

const paymentImages = {
  QRIS: "public/payment/qris.png",
  BNI: "public/payment/bni.png",
  BCA: "public/payment/bca.png",
  Gopay: "public/payment/gopay.png",
};

myModal.addEventListener("hidden.bs.modal", () => {
  if (!payment) return;

  const paymentMethod = document.getElementById("paymentMethod");
  const method = paymentMethod.querySelector(".payment-method");
  const select = paymentMethod.querySelector(".select-method");
  const methodText = method.querySelector("p");
  const methodImg = method.querySelector(".img-method");

  paymentMethod.classList.remove("text-danger");
  paymentMethod.classList.add("text-dark");
  method.classList.remove("d-none");
  select.classList.add("d-none");
  methodText.innerText = payment;
  methodImg.src = paymentImages[payment];
});

document
  .getElementById("checkoutForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(this).entries());

    const tableNumber = document.getElementById("tableNumber");
    const outletCode = document.getElementById("outletCode");
    const alertMethod = document.getElementById("alert-payment");

    const inputs = [
      { element: tableNumber, value: formData.table_number },
      { element: outletCode, value: formData.outlet_code },
    ];

    let hasError = false;

    inputs.forEach((input) => {
      if (!input.value) {
        input.element.classList.add("is-invalid");
        hasError = true;
      } else {
        input.element.classList.remove("is-invalid");
      }
    });

    if (!payment) {
      if (!payment) {
        alertMethod.classList.remove("d-none");
        alertMethod.classList.add("d-flex");
        hasError = true;

        setTimeout(() => {
          alertMethod.classList.remove("d-flex");
          alertMethod.classList.add("d-none");
        }, 3000);
      }
    } else {
      alertMethod.classList.remove("d-flex");
      alertMethod.classList.add("d-none");
    }

    if (hasError) return;

    const data = {
      ...formData,
      payment_method: payment,
      cart: JSON.parse(localStorage.getItem("cart")) || [],
    };

    fetch("payment.php", {
      method: "POST",
      body: JSON.stringify(data),
    });
  });
