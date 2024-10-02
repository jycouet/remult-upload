import { remultSveltekit } from "remult/remult-sveltekit";
import { Task } from "../demo/todo/Task";

import { media } from "$modules/media/server";
import type { ClassType } from "remult";

export const api = remultSveltekit({
  admin: true,
  // from remult?
  // modules: [media],
  entities: [Task, ...media.entities],
  initApi: async () => {
    media.initApi();
  },
});

// From remult?
export type Module = {
  entities: ClassType<unknown>[];
  initApi: () => void;
};
