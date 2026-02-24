import { renderCard } from "../components/ProductCard.js";
import { showToast } from "../utils/toast.js";

const grid = document.getElementById("product-grid");
const cartCountEl = document.getElementById("cart-count");
const emptyState = document.getElementById("empty-state");

export function setupGrid(store) {
  grid.addEventListener("click", (e) => {
    const btn = e.target.closest('[data-action="toggle-cart"]');
    if (!btn) return;

    const productId = Number(btn.dataset.productId);
    const product = store.toggleCart(productId);

    if (product) {
      updateCard(store, productId);
      const message = product.inCart
        ? `${product.title} added to cart`
        : `${product.title} removed from cart`;
      showToast(message);
    }
  });
}

export function renderGrid(store, searchQuery = "") {
  const products = store.getProducts();
  grid.innerHTML = products.map(renderCard).join("");
  updateCartCount(store);
  applySearchFilter(searchQuery);
}

export function updateCartCount(store) {
  const count = store.getCartCount();
  cartCountEl.textContent = count;
}

function updateCard(store, productId) {
  const product = store.getProducts().find((p) => p.id === productId);
  if (!product) return;

  const existing = grid.querySelector(`[data-product-id="${productId}"]`);
  if (!existing) return;

  const temp = document.createElement("div");
  temp.innerHTML = renderCard(product);
  const newCard = temp.firstElementChild;

  existing.replaceWith(newCard);
  updateCartCount(store);
}

export function applySearchFilter(query) {
  query = query.trim().toLowerCase();
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

export function appendToGrid(product) {
  const temp = document.createElement("div");
  temp.innerHTML = renderCard(product);
  const newCard = temp.firstElementChild;
  newCard.classList.add("animate-in");

  grid.appendChild(newCard);
  newCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
