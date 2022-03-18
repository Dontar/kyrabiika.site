export type HTTPMethod = "get" | "post" | "put" | "patch" | "delete";
const HTTPMethods: HTTPMethod[] = ["get", "post", "put", "patch", "delete"];

export class FetchError extends Error {
  constructor(message: string, public response: Response, public data?: { message: string }) {
    super(message);
    this.name = "FetchError";
  }
}

function parseResult(res: Response) {
  const type = res.headers.get("Content-Type")!;
  switch (true) {
    case /json/.test(type): return res.json();
    case /text/.test(type): return res.text();
    default: return res.blob();
  }
}

type RestClientAPI = Record<HTTPMethod, <T = any>(url: string, data?: unknown) => Promise<T>>;

const rest = {} as RestClientAPI;

HTTPMethods.forEach(method => {
  rest[method] = async (url: string, data?: unknown) => {
    const res = await fetch(url, {
      method,
      headers: data ? {
        "Content-Type": "application/json"
      } : undefined,
      body: data ? JSON.stringify(data) : undefined
    });
    if (res.ok) {
      return await parseResult(res);
    }
    throw new FetchError(res.statusText, res, await res.json());
  };
});

export default rest;
