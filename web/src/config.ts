import arcadeConfig from "../../arcade.config.json";

import type { Action } from "./shared/input/types";

/**
 * The web's view of arcade.config.json, the one file every Tukyo Arcade value lives in.
 * No values here, only names, types and what each one means.
 */

/**
 * Which key means which action (input.keys). The arrows and Enter are what the TV remote sends the page (OK = Enter).
 * PC-only: Escape stands in for the remote's Back while there's no Kotlin shell; on the TV, Back never reaches the page.
 */
export const KEY_ACTIONS: Record<string, Action> = arcadeConfig.input.keys as Record<string, Action>;

/** How many game tiles fit in one row of the hub grid (hub.columns). Up/down jump by this many tiles; CSS will read it too. */
export const HUB_COLUMNS: number = arcadeConfig.hub.columns;