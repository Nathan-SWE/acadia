const escapeMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
};

export function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, (char) => escapeMap[char]);
}
