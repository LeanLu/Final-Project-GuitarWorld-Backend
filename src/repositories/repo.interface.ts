export interface Repo<T> {
  read(): Promise<T[]>;
  readId(id: string): Promise<T>;
  create(info: Partial<T>): Promise<T>;
  update(info: Partial<T>): Promise<T>;
  erase(id: string): Promise<void>;
  search(query: { key: string; value: unknown }): Promise<T[]>;
}
