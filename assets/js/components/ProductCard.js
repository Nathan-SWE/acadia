import { escapeHTML } from "../utils/sanitize.js";
import { formatPrice } from "../utils/format.js";

export function renderCard(product) {
  const title = escapeHTML(product.title);
  const description = escapeHTML(product.description);
  const price = formatPrice(product.price);
  const image = escapeHTML(product.image);
  const inCart = product.inCart;

  return `
    <article
      class="card ${inCart ? "card--added" : ""}"
      data-product-id="${product.id}"
      role="listitem"
    >
      <div class="card__image-wrapper">
        <img
          class="card__image"
          src="${image}"
          alt="${title}"
          loading="lazy"
        >
      </div>
      <div class="card__body">
        <h2 class="card__title">${title}</h2>
        <p class="card__description">${description}</p>
      </div>
      <div class="card__footer">
        <span class="card__price">${price}</span>
        <button
          type="button"
          class="card__btn ${inCart ? "card__btn--added" : ""}"
          data-action="toggle-cart"
          data-product-id="${product.id}"
          aria-label="${inCart ? `Remove ${title} from cart` : `Add ${title} to cart`}"
        >
          ${inCart ? "Added" : "Add to Cart"}
        </button>
      </div>
    </article>
  `;
}
