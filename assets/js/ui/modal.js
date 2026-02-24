const modalOverlay = document.getElementById("modal-overlay");
const modalCloseBtn = document.getElementById("modal-close");
const modalCancelBtn = document.getElementById("modal-cancel");
const addProductForm = document.getElementById("add-product-form");

const titleInput = document.getElementById("product-title");
const descriptionInput = document.getElementById("product-description");
const priceInput = document.getElementById("product-price");

const errorTitle = document.getElementById("error-title");
const errorDescription = document.getElementById("error-description");
const errorPrice = document.getElementById("error-price");

let submitCallback = null;

export function setupModal({ onSubmit }) {
  submitCallback = onSubmit;

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

  titleInput.addEventListener("input", () =>
    clearError(titleInput, errorTitle),
  );
  descriptionInput.addEventListener("input", () =>
    clearError(descriptionInput, errorDescription),
  );
  priceInput.addEventListener("input", () =>
    clearError(priceInput, errorPrice),
  );

  addProductForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (submitCallback) {
      submitCallback({
        title: titleInput.value.trim(),
        description: descriptionInput.value.trim(),
        price: parseFloat(priceInput.value),
      });
    }
  });
}

export function openModal() {
  modalOverlay.classList.remove("hidden");
  modalOverlay.setAttribute("aria-hidden", "false");
  titleInput.focus();
  document.body.style.overflow = "hidden";
}

export function closeModal() {
  modalOverlay.classList.add("hidden");
  modalOverlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  addProductForm.reset();
  clearAllErrors();
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

  return isValid;
}
