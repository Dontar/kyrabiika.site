import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "./session";

export type Handler<T> = (req: NextApiRequest, res: NextApiResponse<T>, next?: (result?: unknown | Error) => unknown) => void | Promise<void>;

export default function rest() {
  const handlers = new Map<string, Handler<any>>();
  const middleware = new Set<Handler<any>>();

  const mainHandler =
    async (req: NextApiRequest, res: NextApiResponse<any>) => {
      try {

        for (const handler of middleware) {
          await handler(req, res);
        }

        if (!res.writableEnded) {
          if (handlers.has(req.method!)) {
            const handler = handlers.get(req.method!)!;
            await handler(req, res);
          } else {
            res.setHeader("Allow", [...handlers.keys()]);
            res.status(405).end(`Method ${req.method} Not Allowed`);
          }
        }

      } catch (e) {
        console.error(e);
        if (!res.writableEnded) {
          res.status(500).end(e instanceof Error ? e.message : e as string);
        }
      }
    };

  const api = {
    use(handler: Handler<any>) {
      middleware.add((req, res) => {
        return new Promise((resolve, reject) => {
          const autoResolve = setTimeout(() => resolve(), 30000);
          handler(req, res, result => {
            clearTimeout(autoResolve);
            if (result instanceof Error) {
              return reject(result);
            }
            return resolve();
          });
        });
      });
      return this;
    },
    get<T>(handler: Handler<T>) {
      handlers.set("GET", handler);
      return this;
    },
    post<T>(handler: Handler<T>) {
      handlers.set("POST", handler);
      return this;
    },
    put<T>(handler: Handler<T>) {
      handlers.set("PUT", handler);
      return this;
    },
    patch<T>(handler: Handler<T>) {
      handlers.set("PATCH", handler);
      return this;
    },
    del<T>(handler: Handler<T>) {
      handlers.set("DELETE", handler);
      return this;
    }

  };

  const withSessionApi = {
    get<T>(handler: Handler<T>) {
      handlers.set("GET", withIronSessionApiRoute(handler, sessionOptions));
      return this;
    },
    post<T>(handler: Handler<T>) {
      handlers.set("POST", withIronSessionApiRoute(handler, sessionOptions));
      return this;
    },
    put<T>(handler: Handler<T>) {
      handlers.set("PUT", withIronSessionApiRoute(handler, sessionOptions));
      return this;
    },
    patch<T>(handler: Handler<T>) {
      handlers.set("PATCH", withIronSessionApiRoute(handler, sessionOptions));
      return this;
    },
    del<T>(handler: Handler<T>) {
      handlers.set("DELETE", withIronSessionApiRoute(handler, sessionOptions));
      return this;
    }
  };

  return Object.assign(
    mainHandler,
    api,
    { withSession: withSessionApi }
  );
}
