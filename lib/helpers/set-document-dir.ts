export function setDocumentDirection(direction: "rtl" | "ltr") {
  document.documentElement.setAttribute("dir", direction);
}
