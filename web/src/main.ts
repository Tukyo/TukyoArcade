import { renderHub } from "./hub/hub";

const root = document.getElementById("app");
if (!root) throw new Error("#app is missing from index.html");

renderHub(root);