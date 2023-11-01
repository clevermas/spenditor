import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const handlers = [
  http.get("/api/account", () => {
    return HttpResponse.json({});
  }),
];

const server = setupServer(...handlers);

export { server };
