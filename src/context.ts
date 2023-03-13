import { v4 } from 'uuid';
import { AsyncLocalStorage } from 'async_hooks';

export const DEFAULT_REQUEST_ID_HEADER = 'X-Request-ID';
export interface ExecuteReturn<R> {
  readonly with: (args: Record<string, any>) => R;
}

export class TracingContext {
  private asyncLocalStorage: AsyncLocalStorage<Record<string, any>>;
  private requestIdHeader: string = DEFAULT_REQUEST_ID_HEADER;

  constructor() {
    this.asyncLocalStorage = new AsyncLocalStorage();
  }
  
  private executeWith = <R>(callback: () => R, args: Record<string, any>): R => {
    const context = {
      ...args,
      [this.requestIdHeader]: args[this.requestIdHeader] || v4(),
    };

    return this.asyncLocalStorage.run(context, () => callback());
  };
  
  execute = <R>(callback: () => R): ExecuteReturn<R> => {
    return {
      with: (args) => this.executeWith(callback, args),
    };
  };

  get = (key: string): string => {
    const store = this.asyncLocalStorage.getStore();
    return store && store[key];
  };

  getRequestId = (): string => this.get(this.requestIdHeader);
}

const { get, execute, getRequestId } = new TracingContext();

export default { get, execute, getRequestId };
