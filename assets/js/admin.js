import productURL from "./baseURL.js";
import { deleteById, getDatas, postData, patchById } from "./request.js";

let products = await getDatas(productURL);

const createTable = async () => {
  let tbody = document.querySelector("tbody");
  products.forEach((product) => {
    let tableRow = document.createElement("tr");

    let tdId = document.createElement("td");
    tdId.classList.add("product-id");

    let tdImage = document.createElement("td");
    let img = document.createElement("img");
    img.classList.add("product-image");
    tdImage.appendChild(img);

    let tdTitle = document.createElement("td");
    tdTitle.classList.add("product-title");

    let tdCategory = document.createElement("td");
    tdCategory.classList.add("product-category");

    let tdPrice = document.createElement("td");
    tdPrice.classList.add("product-price");

    let actions = document.createElement("td");

    let editButton = document.createElement("button");
    editButton.classList.add("edit-button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
      openEditModal(product);
    });

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", async () => {
      await deleteProduct(product.id);
      products = await getDatas(productURL);
      createTable();
    });

   

    tdId.textContent = product.id;
    img.src = product.image;
    tdTitle.textContent = product.title;
    tdCategory.textContent = product.category;
    tdPrice.textContent = ` ${product.price}`;

    actions.append(editButton, deleteButton);
    tableRow.append(tdId, tdImage, tdTitle, tdCategory, tdPrice, actions);

    tbody.appendChild(tableRow);
  });
};

const addProduct = async (e) => {
  e.preventDefault();
  let image = document.querySelector("#image").value.trim();
  let title = document.querySelector("#title").value.trim();
  let category = document.querySelector("#category").value.trim();
  let price = document.querySelector("#price").value.trim();

  let newProduct = {
    id: uuidv4(),
    image,
    title,
    category,
    price,
  };

  await postData(productURL, newProduct);
  products = await getDatas(productURL);
  createTable();
  closeModal();
};

let form = document.querySelector(".form");
form.addEventListener("submit", addProduct);

const deleteProduct = async (productId) => {
  await deleteById(productURL, productId);
};

const openModal = () => {
  let modal = document.querySelector(".row");
  modal.style.display = "flex";
};

let addButton = document.querySelector(".add-btn");
addButton.addEventListener("click", openModal);

const closeModal = () => {
  let modal = document.querySelector(".row");
  modal.style.display = "none";
};

let closeBtn = document.querySelector(".close");
closeBtn.addEventListener("click", closeModal);

const openEditModal = (product) => {
  openModal();

  document.querySelector("#image").value = product.image;
  document.querySelector("#title").value = product.title;
  document.querySelector("#category").value = product.category;
  document.querySelector("#price").value = product.price;

  form.removeEventListener("submit", addProduct);
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let updatedProduct = {
      image: document.querySelector("#image").value.trim(),
      title: document.querySelector("#title").value.trim(),
      category: document.querySelector("#category").value.trim(),
       price : document.querySelector("#price").value.trim(),
    };

    await patchById(productURL, product.id, updatedProduct);
    products = await getDatas(productURL);
    createTable();
    closeModal();
  });
};

function toast(text) {
  Toastify({
    text: text,
    duration: 1000,
    gravity: "top",
    position: "right",
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();
}

createTable();

