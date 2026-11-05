import { createPlatform } from "../platform/web/core/boot.js";
import { adapter } from "./adapter.js";

createPlatform(adapter);
