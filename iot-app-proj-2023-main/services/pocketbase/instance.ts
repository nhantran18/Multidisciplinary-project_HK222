import Pocketbase from "pocketbase";
import { POCKETBASE_URL } from "@env";

const pb = new Pocketbase(POCKETBASE_URL);

pb.beforeSend = function (url, options) {
  options.headers = Object.assign({}, options.headers, {
    "ngrok-skip-browser-warning": "any",
  });

  return { url, options };
};

pb.autoCancellation(false);

export default pb;
