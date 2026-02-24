import { createStore } from "./state.js";
import {
  setupGrid,
  renderGrid,
  applySearchFilter,
  appendToGrid,
  updateCartCount,
} from "./ui/grid.js";
import { setupModal, openModal, closeModal } from "./ui/modal.js";
import {
  setupImageHandler,
  getCurrentImage,
  resetImageHandler,
} from "./ui/imageHandler.js";
import { showToast } from "./utils/toast.js";

const store = createStore();

document.addEventListener("DOMContentLoaded", () => {
  setupGrid(store);
  setupImageHandler();
  setupModal({ onSubmit: handleProductSubmit });

  renderGrid(store);

  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", (e) =>
    applySearchFilter(e.target.value),
  );

  const addProductBtn = document.getElementById("add-product-btn");
  addProductBtn.addEventListener("click", openModal);
});

function handleProductSubmit(formData) {
  const imageData = getCurrentImage();

  if (!imageData) {
    document.getElementById("error-image").classList.remove("hidden");
    return;
  }

  const newProduct = store.addCustomProduct({
    ...formData,
    image: imageData,
  });

  appendToGrid(newProduct);
  applySearchFilter(document.getElementById("search-input").value);
  updateCartCount(store);

  closeModal();
  resetImageHandler();
  showToast(`${newProduct.title} added to catalog`);
}
