export class Deferred<T> extends Promise<T> {

  public resolve: (value: T | PromiseLike<T>) => void = () => { };
  public reject: (reason?: any) => void = () => { }

  constructor() {
    super((r, j) => {
      this.resolve = r;
      this.reject = j;
    });
  }

  Promise() {
    return this;
  }
}

export function timeout<T>(promise: Promise<T | void>, ms: number = 30000) {
  return Promise.race([
    promise,
    new Promise<void>((r) => {
      setTimeout(() => r(), ms);
    })
  ]);
}

export default new Deferred();
