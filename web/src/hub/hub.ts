/** The hub: the Tukyo Arcade title and the grid of games (filled once games exist). Safe to call again to re-render. */
export function renderHub(root: HTMLElement): void {
    const title = document.createElement("h1");
    title.className = "hub-title";
    title.textContent = document.title;

    const grid = document.createElement("div");
    grid.className = "grid";

    root.replaceChildren(title, grid);
}