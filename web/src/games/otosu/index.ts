import "./otosu.css";

import { onAction } from "../../shared/input/input";
import { clearLines, createBoard, dropped, fits, lock, spawn, turned } from "./board";
import { drawBoard, drawNext, prepareCanvas } from "./draw";
import { createDealer, LARGEST } from "./pieces";
import { COLUMNS, FALL, HARD_DROP_POINTS, LINE_SCORES, LINES_PER_LEVEL, ROWS, SOFT_DROP_POINTS } from "./tuning";

import type { Game } from "../types";
import type { Piece, PieceKind, Round } from "./types";

/**
 * Otosu (落とす, "to drop"): the falling-blocks game.
 * Left/right move, up turns, down drops faster (soft drop), OK drops straight to the bottom (hard drop), Back returns to the hub.
 */
const otosu: Game = {
    title: "Otosu",
    mount(container, exit) {
        const boardCanvas = element("canvas", "otosu-board");
        const nextCanvas = element("canvas", "otosu-next");
        const scoreValue = element("div", "otosu-value");
        const levelValue = element("div", "otosu-value");
        const linesValue = element("div", "otosu-value");

        const side = element("div", "otosu-side");
        side.append(stat("Next", nextCanvas), stat("Score", scoreValue), stat("Level", levelValue), stat("Lines", linesValue));

        const overScore = element("div", "otosu-over-hint");
        const over = element("div", "otosu-over");
        over.append(element("div", "otosu-over-title", "Game over"), overScore, element("div", "otosu-over-hint", "OK: play again · Back: hub"));
        over.hidden = true;

        const root = element("div", "otosu");
        root.append(boardCanvas, side, over);
        container.append(root);
        prepareCanvas(boardCanvas, COLUMNS, ROWS);
        prepareCanvas(nextCanvas, LARGEST, LARGEST);

        const deal: () => PieceKind = createDealer();
        const newRound = (): Round => ({ board: createBoard(), piece: spawn(deal()), next: deal(), score: 0, lines: 0, over: false });
        let round: Round = newRound();
        let timer: number | undefined;

        /** The level: 1 at the start, one more every LINES_PER_LEVEL cleared lines. */
        const level = (): number => 1 + Math.floor(round.lines / LINES_PER_LEVEL);

        /** Redraws everything: the board with the ghost and the falling piece, the "Next" box and the numbers. */
        const render = (): void => {
            const piece: Piece | undefined = round.over ? undefined : round.piece;
            drawBoard(boardCanvas, round.board, piece, piece && dropped(round.board, piece));
            drawNext(nextCanvas, round.next);
            scoreValue.textContent = String(round.score);
            levelValue.textContent = String(level());
            linesValue.textContent = String(round.lines);
        };

        /** (Re)starts gravity: one row down after the current level's wait. Moving down by hand restarts it, so the piece never drops twice in a row. */
        const fall = (): void => {
            clearTimeout(timer);
            if (round.over) return;
            const waitMs: number = Math.max(FALL.minMs, FALL.startMs * FALL.speedUp ** (level() - 1));
            timer = window.setTimeout(() => down(0), waitMs);
        };

        /** The piece locks where it is: full lines clear and score, the next piece comes in; if it doesn't fit, the game is over. */
        const land = (): void => {
            lock(round.board, round.piece);
            const cleared: number = clearLines(round.board);
            round.score += (LINE_SCORES[cleared] ?? 0) * level();
            round.lines += cleared;
            round.piece = spawn(round.next);
            round.next = deal();
            if (!fits(round.board, round.piece)) {
                round.over = true;
                overScore.textContent = `Score ${round.score}`;
                over.hidden = false;
            }
        };

        /** One row down, worth `points` (0 for gravity); if the piece can't go further, it lands. */
        const down = (points: number): void => {
            const below: Piece = { ...round.piece, row: round.piece.row + 1 };
            if (fits(round.board, below)) {
                round.piece = below;
                round.score += points;
            } else {
                land();
            }
            fall();
            render();
        };

        /** Straight to the bottom (where the ghost is), HARD_DROP_POINTS per row, and lands right away. */
        const hardDrop = (): void => {
            const landed: Piece = dropped(round.board, round.piece);
            round.score += (landed.row - round.piece.row) * HARD_DROP_POINTS;
            round.piece = landed;
            land();
            fall();
            render();
        };

        /** One square left (-1) or right (1), if there's room. */
        const shift = (by: number): void => {
            const moved: Piece = { ...round.piece, col: round.piece.col + by };
            if (fits(round.board, moved)) round.piece = moved;
            render();
        };

        /** A quarter turn clockwise, nudged off walls if needed; stays as it is if it can't turn here. */
        const turn = (): void => {
            round.piece = turned(round.board, round.piece) ?? round.piece;
            render();
        };

        const stop = onAction((action) => {
            if (action === "back") {
                exit();
                return;
            }
            if (round.over) {
                if (action === "select") {
                    round = newRound();
                    over.hidden = true;
                    fall();
                    render();
                }
                return;
            }
            switch (action) {
                case "left":
                    shift(-1);
                    break;
                case "right":
                    shift(1);
                    break;
                case "up":
                    turn();
                    break;
                case "down":
                    down(SOFT_DROP_POINTS);
                    break;
                case "select":
                    hardDrop();
                    break;
            }
        });

        fall();
        render();

        return () => {
            stop();
            clearTimeout(timer);
        };
    },
};

export default otosu;

/** A new `tag` element with `className` and, optionally, its text. */
function element<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, text?: string): HTMLElementTagNameMap[K] {
    const created: HTMLElementTagNameMap[K] = document.createElement(tag);
    created.className = className;
    if (text !== undefined) created.textContent = text;
    return created;
}

/** One block of the side panel: a small label ("Score") above its content (a number or the "Next" box). */
function stat(label: string, content: HTMLElement): HTMLElement {
    const block = element("div", "otosu-stat");
    block.append(element("div", "otosu-label", label), content);
    return block;
}
