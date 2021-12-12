import { NextApiRequest, NextApiResponse } from "next";

type Handler<T> = (req: NextApiRequest, res: NextApiResponse<T>, next?: (result: unknown | Error) => unknown) => unknown | PromiseLike<T>;

export default function rest<T>() {
  const handlers = new Map<string, Handler<any>>();
  const middleware = new Set<Handler<any>>();

  return Object.assign(
    async (req: NextApiRequest, res: NextApiResponse<T>) => {
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
          res.statusCode = 500;
          res.statusMessage = e instanceof Error ? e.message : e as string;
          res.end();
        }
      }
    },
    {
      use(handler: Handler<any>) {
        middleware.add((req, res) => {
          return new Promise((resolve, reject) => {
            handler(req, res, result => {
              if (result instanceof Error) {
                return reject(result)
              }
              return resolve(result);
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
    }
  );
}
