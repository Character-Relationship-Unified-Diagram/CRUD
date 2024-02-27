import { createRoot } from "react-dom/client";
import { App } from "./App";

const root = createRoot(document.getElementById("root") as HTMLElement);
if (root !== null) {
  root.render(<App />);
}