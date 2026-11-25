import { LARGEST, SHAPES, squaresOf } from "./pieces";
import { ROWS } from "./tuning";

import type { Cell, Piece, PieceKind } from "./types";

/**
 * Gives `canvas` the shape of a `columns` × `rows` grid and a pixel size that matches how big it shows on screen, so
 * squares stay sharp on the TV. Its CSS sets the height; the width follows from the shape. Call it once the canvas is on the page.
 */
export function prepareCanvas(canvas: HTMLCanvasElement, columns: number, rows: number): void {
    canvas.style.aspectRatio = `${columns} / ${rows}`;
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;
}

/**
 * Paints the board, then where the piece will land (the ghost, faint), then the falling piece itself.
 * Without a piece (game over), just the board. Colors come from otosu.css.
 */
export function drawBoard(canvas: HTMLCanvasElement, board: Cell[][], piece: Piece | undefined, ghost: Piece | undefined): void {
    const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (!context) return;

    const style: CSSStyleDeclaration = getComputedStyle(canvas);
    const size: number = canvas.height / ROWS;

    context.clearRect(0, 0, canvas.width, canvas.height);
    board.forEach((line, row) => line.forEach((cell, col) => paint(context, style, size, row, col, cell)));

    if (ghost) {
        context.globalAlpha = Number(style.getPropertyValue("--otosu-ghost"));
        for (const [row, col] of squaresOf(ghost)) paint(context, style, size, row, col, ghost.kind);
        context.globalAlpha = 1;
    }
    if (piece) {
        for (const [row, col] of squaresOf(piece)) paint(context, style, size, row, col, piece.kind);
    }
}

/** Paints `kind` centered in the "Next" box (LARGEST × LARGEST squares, so every shape fits). */
export function drawNext(canvas: HTMLCanvasElement, kind: PieceKind): void {
    const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (!context) return;

    const style: CSSStyleDeclaration = getComputedStyle(canvas);
    const size: number = canvas.height / LARGEST;
    const squares = SHAPES[kind].squares;
    const rows: number[] = squares.map(([row]) => row);
    const cols: number[] = squares.map(([, col]) => col);
    const top: number = (LARGEST - (Math.max(...rows) - Math.min(...rows) + 1)) / 2 - Math.min(...rows);
    const left: number = (LARGEST - (Math.max(...cols) - Math.min(...cols) + 1)) / 2 - Math.min(...cols);

    context.clearRect(0, 0, canvas.width, canvas.height);
    for (const [row, col] of squares) paint(context, style, size, row + top, col + left, kind);
}

/** One square at (row, col), `size` pixels per square minus the gap, in the cell's color (or the empty color). */
function paint(context: CanvasRenderingContext2D, style: CSSStyleDeclaration, size: number, row: number, col: number, cell: Cell): void {
    const gap: number = size * Number(style.getPropertyValue("--otosu-gap"));
    context.fillStyle = style.getPropertyValue(cell ? `--otosu-${cell}` : "--otosu-empty").trim();
    context.fillRect(col * size + gap / 2, row * size + gap / 2, size - gap, size - gap);
}
