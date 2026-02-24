const imageFileInput = document.getElementById("product-image-file");
const imageUrlInput = document.getElementById("product-image-url");
const imageTabFile = document.getElementById("image-tab-file");
const imageTabUrl = document.getElementById("image-tab-url");
const imagePreviewWrapper = document.getElementById("image-preview-wrapper");
const imagePreview = document.getElementById("image-preview");
const removePreviewBtn = document.getElementById("remove-preview");
const fileLabelText = document.getElementById("file-label-text");
const fileDropZone = document.getElementById("file-drop-zone");
const errorImage = document.getElementById("error-image");

let currentImageData = null;
let activeImageTab = "file";

export function setupImageHandler() {
  document.querySelectorAll(".form-field__tab").forEach((tab) => {
    tab.addEventListener("click", () => switchImageTab(tab.dataset.tab));
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

  removePreviewBtn.addEventListener("click", resetImageHandler);
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

export function getCurrentImage() {
  if (activeImageTab === "url" && imageUrlInput.value.trim()) {
    return imageUrlInput.value.trim();
  }
  return currentImageData;
}

export function resetImageHandler() {
  currentImageData = null;
  hidePreview();
  imageFileInput.value = "";
  imageUrlInput.value = "";
  fileLabelText.textContent = "Choose a file or drag it here";
  switchImageTab("file");
  errorImage.classList.add("hidden");
}
