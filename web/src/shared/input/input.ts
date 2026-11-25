import { KEY_ACTIONS } from "../../config";

import type { Action } from "./types";

/**
 * Calls `handler` for every action until the returned function is called. The hub listens while it's on screen and
 * stops when a game starts; the game listens until it ends. Held arrows repeat (the TV and the PC both auto-repeat a
 * held key), so a game gets "left, left, left" while left is held. Held OK and Back don't repeat, so one press is one
 * select (no double start of a game) and one back.
 */
export function onAction(handler: (action: Action) => void): () => void {
    const listener = (event: KeyboardEvent): void => {
        const action: Action | undefined = KEY_ACTIONS[event.key];
        if (!action) return;
        event.preventDefault();
        if (event.repeat && (action === "select" || action === "back")) return;
        handler(action);
    };
    
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
}