import type { Piece, PieceKind, Shape, Square } from "./types";

/** Every shape in its starting position, lying flat the way it appears at the top of the board. */
export const SHAPES: Record<PieceKind, Shape> = {
    I: { size: 4, squares: [[1, 0], [1, 1], [1, 2], [1, 3]] },
    O: { size: 2, squares: [[0, 0], [0, 1], [1, 0], [1, 1]] },
    T: { size: 3, squares: [[0, 1], [1, 0], [1, 1], [1, 2]] },
    S: { size: 3, squares: [[0, 1], [0, 2], [1, 0], [1, 1]] },
    Z: { size: 3, squares: [[0, 0], [0, 1], [1, 1], [1, 2]] },
    J: { size: 3, squares: [[0, 0], [1, 0], [1, 1], [1, 2]] },
    L: { size: 3, squares: [[0, 2], [1, 0], [1, 1], [1, 2]] },
};

/** The biggest shape box (the I's 4×4), so the "Next" box fits every shape. */
export const LARGEST: number = Math.max(...Object.values(SHAPES).map((shape) => shape.size));

/**
 * The board squares `piece` covers right now: its shape, turned `rotation` quarter turns clockwise inside its box,
 * then moved to the piece's position on the board.
 */
export function squaresOf(piece: Piece): Square[] {
    const { size, squares } = SHAPES[piece.kind];
    return squares.map(([row, col]): Square => {
        let r = row;
        let c = col;
        for (let turn = 0; turn < piece.rotation % 4; turn++) {
            [r, c] = [c, size - 1 - r];
        }
        return [piece.row + r, piece.col + c];
    });
}

/**
 * Returns a function that hands out the next piece kind. Pieces come from a shuffled "bag" of all seven shapes; when it's
 * empty, a new bag is shuffled. So every shape comes once per seven pieces: no endless wait for the long I.
 */
export function createDealer(): () => PieceKind {
    let bag: PieceKind[] = [];
    return () => {
        let kind: PieceKind | undefined = bag.pop();
        while (!kind) {
            bag = shuffledBag();
            kind = bag.pop();
        }
        return kind;
    };
}

/** All seven shapes in a random order (each picked at random from the ones left, so every order is equally likely). */
function shuffledBag(): PieceKind[] {
    const left: PieceKind[] = Object.keys(SHAPES) as PieceKind[];
    const bag: PieceKind[] = [];
    while (left.length > 0) {
        bag.push(...left.splice(Math.floor(Math.random() * left.length), 1));
    }
    return bag;
}
