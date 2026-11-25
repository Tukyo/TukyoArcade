import { SHAPES, squaresOf } from "./pieces";
import { COLUMNS, KICKS, ROWS } from "./tuning";

import type { Cell, Piece, PieceKind } from "./types";

/** A new, empty board: ROWS rows of COLUMNS empty cells. Row 0 is the top. */
export function createBoard(): Cell[][] {
    return Array.from({ length: ROWS }, () => emptyRow());
}

/** A new piece of `kind` at the top of the board, centered, not turned. */
export function spawn(kind: PieceKind): Piece {
    return { kind, rotation: 0, row: 0, col: Math.floor((COLUMNS - SHAPES[kind].size) / 2) };
}

/** Whether `piece` fits where it is: every square inside the board and on an empty cell. */
export function fits(board: Cell[][], piece: Piece): boolean {
    return squaresOf(piece).every(([row, col]) => board[row]?.[col] === null);
}

/**
 * `piece` turned a quarter clockwise. If that hits a wall or blocks, it tries the sideways nudges in KICKS (so a piece
 * against a wall can still turn). Undefined if no nudge fits: the piece can't turn here.
 */
export function turned(board: Cell[][], piece: Piece): Piece | undefined {
    for (const kick of KICKS) {
        const moved: Piece = { ...piece, rotation: (piece.rotation + 1) % 4, col: piece.col + kick };
        if (fits(board, moved)) return moved;
    }
    return undefined;
}

/** Where `piece` would land if it fell straight down: the lowest row it still fits. Used for the hard drop and the ghost. */
export function dropped(board: Cell[][], piece: Piece): Piece {
    let landed: Piece = piece;
    while (fits(board, { ...landed, row: landed.row + 1 })) {
        landed = { ...landed, row: landed.row + 1 };
    }
    return landed;
}

/** Locks `piece` into the board where it is: its squares become filled with its kind (which decides their color). */
export function lock(board: Cell[][], piece: Piece): void {
    for (const [row, col] of squaresOf(piece)) {
        const line: Cell[] | undefined = board[row];
        if (line) line[col] = piece.kind;
    }
}

/** Removes every full row; everything above drops down and empty rows come in at the top. Returns how many rows were cleared. */
export function clearLines(board: Cell[][]): number {
    const kept: Cell[][] = board.filter((line) => line.includes(null));
    const cleared: number = board.length - kept.length;
    const fresh: Cell[][] = Array.from({ length: cleared }, () => emptyRow());
    board.splice(0, board.length, ...fresh, ...kept);
    return cleared;
}

/** One row of empty cells. */
function emptyRow(): Cell[] {
    return Array<Cell>(COLUMNS).fill(null);
}
