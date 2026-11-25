/** The seven four-block shapes, each named after the letter it looks like. */
export type PieceKind = "I" | "O" | "T" | "S" | "Z" | "J" | "L";

/** One square of the board: empty (null), or filled by a locked piece of that kind (which decides its color). */
export type Cell = PieceKind | null;

/** The falling piece: which shape, how it's turned (0–3, quarter turns clockwise) and where its top-left corner is on the board. */
export interface Piece {
    kind: PieceKind;
    rotation: number;
    row: number;
    col: number;
}

/** A square's position as [row, col]: on the board, or inside a shape's box. Row 0 is the top. */
export type Square = [row: number, col: number];

/** A shape in its starting position: its filled squares inside a size×size box. Turning the piece turns the whole box. */
export interface Shape {
    size: number;
    squares: Square[];
}

/** One game, from the first piece to game over. OK after game over starts a new one. */
export interface Round {
    board: Cell[][];
    /** The falling piece. */
    piece: Piece;
    /** The piece after it, shown in the "Next" box. */
    next: PieceKind;
    score: number;
    lines: number;
    /** True once a new piece no longer fits at the top. */
    over: boolean;
}
