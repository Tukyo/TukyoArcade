import { onAction } from "../../shared/input/input";

import type { Game } from "../types";

/** Otosu (落とす, "to drop"): the falling-blocks game. */
const otosu: Game = {
    title: "Otosu",
    mount(container, exit) {
        const canvas = document.createElement("canvas");
        container.append(canvas);

        const stop = onAction((action) => {
            if (action === "back") exit();
        });

        return stop;
    },
};

export default otosu;