import { rest } from "msw";
import { environment } from "src/environments/environment";

export const handlers = [
  rest.get(`${environment.apiUrl}/login`, (req, res, ctx) => {
    ctx.json({ sessionToken: "abcd" });
  }),
];
