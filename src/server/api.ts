import { remultSveltekit } from "remult/remult-sveltekit";
import { Task } from "../demo/todo/Task";

import { media } from "$modules/media/server";
import type { ClassType } from "remult";

export const api = remultSveltekit({
  admin: true,
  // from remult?
  // modules: [media],

  entities: [...media.entities, Task],
  initApi: async () => {
    media.initApi?.();
  },
});

// From remult?
export type Module = {
  /** @default 0 */
  priority: number;
  key: string;
  caption: string;
  entities: ClassType<unknown>[];
  initApi: () => void;
};
