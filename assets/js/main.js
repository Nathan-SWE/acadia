import { createStore } from "./state.js";
import { renderCard } from "./components/ProductCard.js";
import { showToast } from "./utils/toast.js";

const store = createStore();

const grid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
const addProductBtn = document.getElementById("add-product-btn");
const cartCountEl = document.getElementById("cart-count");
const emptyState = document.getElementById("empty-state");

const modalOverlay = document.getElementById("modal-overlay");
const modalCloseBtn = document.getElementById("modal-close");
const modalCancelBtn = document.getElementById("modal-cancel");
const addProductForm = document.getElementById("add-product-form");
const titleInput = document.getElementById("product-title");
const descriptionInput = document.getElementById("product-description");
const priceInput = document.getElementById("product-price");
const imageFileInput = document.getElementById("product-image-file");
const imageUrlInput = document.getElementById("product-image-url");
const imageTabFile = document.getElementById("image-tab-file");
const imageTabUrl = document.getElementById("image-tab-url");
const imagePreviewWrapper = document.getElementById("image-preview-wrapper");
const imagePreview = document.getElementById("image-preview");
const removePreviewBtn = document.getElementById("remove-preview");
const fileLabelText = document.getElementById("file-label-text");
const fileDropZone = document.getElementById("file-drop-zone");

const errorTitle = document.getElementById("error-title");
const errorDescription = document.getElementById("error-description");
const errorPrice = document.getElementById("error-price");
const errorImage = document.getElementById("error-image");

let currentImageData = null;
let activeImageTab = "file";

function renderGrid() {
  const products = store.getProducts();
  grid.innerHTML = products.map(renderCard).join("");
  updateCartCount();
  applySearchFilter();
}

function updateCartCount() {
  const count = store.getCartCount();
  cartCountEl.textContent = count;
}

function updateCard(productId) {
  const product = store.getProducts().find((p) => p.id === productId);
  if (!product) return;

  const existing = grid.querySelector(`[data-product-id="${productId}"]`);
  if (!existing) return;

  const temp = document.createElement("div");
  temp.innerHTML = renderCard(product);
  const newCard = temp.firstElementChild;

  existing.replaceWith(newCard);
  updateCartCount();
}

function applySearchFilter() {
  const query = searchInput.value.trim().toLowerCase();
  const cards = grid.querySelectorAll(".card");
  let visibleCount = 0;

  cards.forEach((card) => {
    const title = card.querySelector(".card__title").textContent.toLowerCase();
    const isMatch = !query || title.includes(query);
    card.classList.toggle("hidden", !isMatch);
    if (isMatch) visibleCount++;
  });

  emptyState.classList.toggle("hidden", visibleCount > 0);
}

function openModal() {
  modalOverlay.classList.remove("hidden");
  modalOverlay.setAttribute("aria-hidden", "false");
  titleInput.focus();
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modalOverlay.classList.add("hidden");
  modalOverlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  resetForm();
}

function resetForm() {
  addProductForm.reset();
  currentImageData = null;
  hidePreview();
  clearAllErrors();
  fileLabelText.textContent = "Choose a file or drag it here";
  switchImageTab("file");
}

function showPreview(src) {
  imagePreview.src = src;
  imagePreviewWrapper.classList.remove("hidden");
}

function hidePreview() {
  imagePreview.src = "";
  imagePreviewWrapper.classList.add("hidden");
}

function switchImageTab(tab) {
  activeImageTab = tab;
  const tabs = document.querySelectorAll(".form-field__tab");
  tabs.forEach((t) => {
    t.classList.toggle("form-field__tab--active", t.dataset.tab === tab);
  });
  imageTabFile.classList.toggle("hidden", tab !== "file");
  imageTabUrl.classList.toggle("hidden", tab !== "url");
}

function showError(inputEl, errorEl) {
  inputEl.classList.add("form-field__input--error");
  errorEl.classList.remove("hidden");
}

function clearError(inputEl, errorEl) {
  inputEl.classList.remove("form-field__input--error");
  errorEl.classList.add("hidden");
}

function clearAllErrors() {
  clearError(titleInput, errorTitle);
  clearError(descriptionInput, errorDescription);
  clearError(priceInput, errorPrice);
  errorImage.classList.add("hidden");
}

function validateForm() {
  let isValid = true;
  clearAllErrors();

  if (!titleInput.value.trim()) {
    showError(titleInput, errorTitle);
    isValid = false;
  }

  if (!descriptionInput.value.trim()) {
    showError(descriptionInput, errorDescription);
    isValid = false;
  }

  const price = parseFloat(priceInput.value);
  if (!priceInput.value || isNaN(price) || price <= 0) {
    showError(priceInput, errorPrice);
    isValid = false;
  }

  if (activeImageTab === "url" && imageUrlInput.value.trim()) {
    currentImageData = imageUrlInput.value.trim();
  }

  if (!currentImageData) {
    errorImage.classList.remove("hidden");
    isValid = false;
  }

  return isValid;
}

function handleFileSelect(file) {
  if (!file || !file.type.startsWith("image/")) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    currentImageData = e.target.result;
    showPreview(currentImageData);
    fileLabelText.textContent = file.name;
    errorImage.classList.add("hidden");
  };
  reader.readAsDataURL(file);
}

grid.addEventListener("click", (e) => {
  const btn = e.target.closest('[data-action="toggle-cart"]');
  if (!btn) return;

  const productId = Number(btn.dataset.productId);
  const product = store.toggleCart(productId);

  if (product) {
    updateCard(productId);
    const message = product.inCart
      ? `${product.title} added to cart`
      : `${product.title} removed from cart`;
    showToast(message);
  }
});

searchInput.addEventListener("input", applySearchFilter);

addProductBtn.addEventListener("click", openModal);

modalCloseBtn.addEventListener("click", closeModal);
modalCancelBtn.addEventListener("click", closeModal);

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modalOverlay.classList.contains("hidden")) {
    closeModal();
  }
});

document.querySelectorAll(".form-field__tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    switchImageTab(tab.dataset.tab);
  });
});

imageFileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) handleFileSelect(file);
});

fileDropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  fileDropZone.classList.add("form-field__file-label--dragover");
});

fileDropZone.addEventListener("dragleave", () => {
  fileDropZone.classList.remove("form-field__file-label--dragover");
});

fileDropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  fileDropZone.classList.remove("form-field__file-label--dragover");
  const file = e.dataTransfer.files[0];
  if (file) handleFileSelect(file);
});

imageUrlInput.addEventListener("input", () => {
  const url = imageUrlInput.value.trim();
  if (url) {
    currentImageData = url;
    showPreview(url);
    errorImage.classList.add("hidden");
  } else {
    currentImageData = null;
    hidePreview();
  }
});

removePreviewBtn.addEventListener("click", () => {
  currentImageData = null;
  hidePreview();
  imageFileInput.value = "";
  imageUrlInput.value = "";
  fileLabelText.textContent = "Choose a file or drag it here";
});

titleInput.addEventListener("input", () => clearError(titleInput, errorTitle));
descriptionInput.addEventListener("input", () =>
  clearError(descriptionInput, errorDescription),
);
priceInput.addEventListener("input", () => clearError(priceInput, errorPrice));

addProductForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  const newProduct = store.addCustomProduct({
    title: titleInput.value.trim(),
    description: descriptionInput.value.trim(),
    price: parseFloat(priceInput.value),
    image: currentImageData,
  });

  const temp = document.createElement("div");
  temp.innerHTML = renderCard(newProduct);
  const newCard = temp.firstElementChild;
  newCard.classList.add("animate-in");

  grid.appendChild(newCard);
  updateCartCount();
  applySearchFilter();

  closeModal();
  showToast(`${newProduct.title} added to catalog`);

  newCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

renderGrid();
