/** What every game's index.ts exports as default: the hub shows its title on a tile and starts it with mount(). */
export interface Game {
    /** Shown on the game's hub tile. */
    title: string;
    
    /**
     * Starts the game inside `container` (the whole screen). The game calls `exit` to return to the hub (e.g. on Back).
     * Returns a function that stops the game and cleans up (timers, key listeners).
     */
    mount(container: HTMLElement, exit: () => void): () => void;
}