import { HUB_COLUMNS } from "../config";

import { GAMES } from "../games/games";
import { onAction } from "../shared/input/input";

import type { Game } from "../games/types";
import type { Action } from "../shared/input/types";

/** The hub: the Tukyo Arcade title and a grid of game tiles. Arrows move, OK starts the focused game. Safe to call again to re-render. */
export function renderHub(root: HTMLElement): void {
    const title = document.createElement("h1");
    title.className = "hub-title";
    title.textContent = document.title;

    const grid = document.createElement("div");
    grid.className = "grid";

    const tiles: HTMLButtonElement[] = [];
    for (const game of GAMES) {
        const tile = document.createElement("button");
        tile.className = "tile";
        tile.textContent = game.title;
        tiles.push(tile);
        grid.append(tile);
    }

    root.replaceChildren(title, grid);

    let focused = 0;
    tiles[focused]?.focus();

    const stop = onAction((action) => {
        const game: Game | undefined = GAMES[focused];
        if (action === "select" && game) {
            stop();
            play(root, game);
            return;
        }
        focused = move(focused, action, tiles.length);
        tiles[focused]?.focus();
    });
}

/**
 * Where focus goes from tile `from` on an arrow, in a grid of `count` tiles that's HUB_COLUMNS wide. Stays put at the
 * edges (no wrapping). Down into a shorter last row lands on its last tile, so down always reaches the last row.
 */
function move(from: number, action: Action, count: number): number {
    const column: number = from % HUB_COLUMNS;
    const row: number = Math.floor(from / HUB_COLUMNS);
    const lastRow: number = Math.floor((count - 1) / HUB_COLUMNS);

    if (action === "left" && column > 0) return from - 1;
    if (action === "right" && column < HUB_COLUMNS - 1 && from + 1 < count) return from + 1;
    if (action === "up" && row > 0) return from - HUB_COLUMNS;
    if (action === "down" && row < lastRow) return Math.min(from + HUB_COLUMNS, count - 1);
    return from;
}

/** Hands the screen to `game`. When the game exits, it cleans up and the hub comes back. */
function play(root: HTMLElement, game: Game): void {
    root.replaceChildren();
    const cleanup = game.mount(root, () => {
        cleanup();
        renderHub(root);
    });
}