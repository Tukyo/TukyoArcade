import otosuConfig from "./otosu.config.json";

/**
 * Otosu's view of otosu.config.json, the one file every Otosu number lives in.
 * No values here, only names, types and what each one means.
 */

/** How many squares wide the board is (board.columns). */
export const COLUMNS: number = otosuConfig.board.columns;
/** How many squares tall the board is (board.rows). */
export const ROWS: number = otosuConfig.board.rows;

/**
 * Gravity: how long the piece waits before dropping one row.
 * - startMs: at level 1.
 * - speedUp: each level multiplies the wait by this (0.85 = 15% faster per level).
 * - minMs: never faster than this, however high the level.
 */
export const FALL: Readonly<typeof otosuConfig.fall> = otosuConfig.fall;

/** Sideways nudges tried in order when a turn would hit a wall or blocks (0 = turn in place, -1 = one square left, …). */
export const KICKS: readonly number[] = otosuConfig.turn.kicks;

/** Points for clearing 0, 1, 2, 3 or 4 lines with one piece, times the level. */
export const LINE_SCORES: readonly number[] = otosuConfig.score.lines;
/** Points per row the piece moves while down is held (soft drop). */
export const SOFT_DROP_POINTS: number = otosuConfig.score.softDropRow;
/** Points per row the piece falls on OK (hard drop: straight to the bottom). */
export const HARD_DROP_POINTS: number = otosuConfig.score.hardDropRow;

/** How many cleared lines it takes to go up one level. */
export const LINES_PER_LEVEL: number = otosuConfig.level.lines;
