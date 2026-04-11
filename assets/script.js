const setPrice = (type, namaProduct, e) => {
  const products = [
    {
      nama: "Crispy Chicken Burger",
      price: 25000,
    },
    {
      nama: "Double Cheese Burger",
      price: 32000,
    },
    {
      nama: "Mushroom Burger",
      price: 23000,
    },
  ];

  const card = e.closest(".menu-card");
  const price = card.querySelector(".price");
  const btnSmall = card.querySelector(".btn-small");
  const btnLarge = card.querySelector(".btn-large");

  const selectedProduct = products.find((p) => p.nama === namaProduct);

  if (selectedProduct) {
    let finalPrice = selectedProduct.price;

    if (type === "large") {
      finalPrice += 10000;
      btnSmall.classList.remove("btn-active");
      btnSmall.classList.add("btn-unactive");
      btnLarge.classList.remove("btn-unactive");
      btnLarge.classList.add("btn-active");
    } else {
      btnLarge.classList.remove("btn-active");
      btnLarge.classList.add("btn-unactive");
      btnSmall.classList.remove("btn-unactive");
      btnSmall.classList.add("btn-active");
    }

    price.innerText = `Rp. ${finalPrice.toLocaleString()}`;
  }
};

const sendMail = () => {
  event.preventDefault();

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const message = document.getElementById("message");

  [name, email, message].forEach((input) => {
    if (!input.value) {
      input.classList.add("is-invalid");
    } else {
      input.classList.remove("is-invalid");
    }
  });

  if (!name.value || !email.value || !message.value) {
    [name, email, message].forEach((input) => {
      if (!input.value) {
        input.classList.add("is-invalid");
      } else {
        input.classList.remove("is-invalid");
      }
    });
    return;
  }

  if (!email.value.includes("@")) {
    email.classList.add("is-invalid");
    document.getElementById("validateEmail").innerHTML =
      "Please add @ on your mail";
    return;
  }

  [name, email, message].forEach((input) => {
    input.classList.remove("is-invalid");
  });

  name.value = "";
  email.value = "";
  message.value = "";

  const alertMail = document.getElementById("alert-mail");

  alertMail.classList.remove("d-none");
  alertMail.classList.add("d-flex");

  setTimeout(() => {
    alertMail.classList.remove("d-flex");
    alertMail.classList.add("d-none");
  }, 5000);
};
