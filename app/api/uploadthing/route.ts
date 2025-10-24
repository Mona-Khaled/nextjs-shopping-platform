import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Export routes for Next App Router
// uploadthing is a remote server, so to use it, we need to add the URL to the images obj in the config (next.config.ts)
/**
 * We are exporting the GET and POST routes for the
 * uploadthing library. This works similar to how we
 * created the routes for the next auth library.
 * So the route /api/uploadthing will be used to
 * upload images.
 */

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
