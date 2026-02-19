const initialProducts = [
  {
    id: 1,
    title: "Wireless Headphones",
    description:
      "Premium over-ear headphones with active noise cancellation and 30-hour battery life.",
    price: 249.99,
    image: "../public/images/product-1.webp",
    inCart: false,
  },
  {
    id: 2,
    title: "Smart Watch Pro",
    description:
      "Advanced fitness tracking, heart-rate monitoring, and seamless notifications on your wrist.",
    price: 399.0,
    image: "../public/images/product-2.webp",
    inCart: false,
  },
  {
    id: 3,
    title: "Portable Speaker",
    description:
      "Waterproof Bluetooth speaker with 360-degree sound and 12-hour playtime.",
    price: 129.95,
    image: "../public/images/product-3.webp",
    inCart: false,
  },
];

export function createStore() {
  let nextId = initialProducts.length + 1;
  const products = initialProducts.map((p) => ({ ...p }));
  const listeners = [];

  function notify() {
    listeners.forEach((fn) => fn(products));
  }

  return {
    subscribe(fn) {
      listeners.push(fn);
    },

    getProducts() {
      return products;
    },

    toggleCart(id) {
      const product = products.find((p) => p.id === id);
      if (product) {
        product.inCart = !product.inCart;
        notify();
      }
      return product;
    },

    getCartCount() {
      return products.filter((p) => p.inCart).length;
    },

    addSampleProduct() {
      const poolIndex =
        (nextId - initialProducts.length - 1) % samplePool.length;
      const sample = samplePool[poolIndex];
      const newProduct = {
        ...sample,
        id: nextId++,
        inCart: false,
      };
      products.push(newProduct);
      notify();
      return newProduct;
    },

    addCustomProduct({ title, description, price, image }) {
      const newProduct = {
        id: nextId++,
        title,
        description,
        price: parseFloat(price),
        image,
        inCart: false,
      };
      products.push(newProduct);
      notify();
      return newProduct;
    },
  };
}
