import type { Game } from "./types";

/** Every game: each src/games/<id>/index.ts, found at build time (a new folder = a new game, no list to edit). */
const found: Record<string, Game> = import.meta.glob<Game>("./*/index.ts", { eager: true, import: "default" });

/** All games, sorted by title, in the order the hub shows them. */
export const GAMES: Game[] = Object.values(found).sort((a, b) => a.title.localeCompare(b.title));