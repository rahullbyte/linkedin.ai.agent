declare module "node-localstorage" {
    export class LocalStorage {
      constructor(path: string);
      setItem(key: string, value: string): void;
      getItem(key: string): string | null;
      removeItem(key: string): void;
      clear(): void;
      key(index: number): string | null;
      readonly length: number;
    }
  }