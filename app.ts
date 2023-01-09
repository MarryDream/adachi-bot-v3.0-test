import Adachi from "./src/modules/bot";
import { fileURLToPath } from "url";
import path from "path";
const __dirname = path.dirname( fileURLToPath( import.meta.url ) );

export default new Adachi( __dirname ).run();
