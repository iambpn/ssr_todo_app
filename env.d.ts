import { ENV_VARIABLE } from "./src/env.type";

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Partial<ENV_VARIABLE> {}
  }
}
