export interface Repository<
  T extends Record<string, any>,
  TKey extends keyof T = "id",
> {
  list(filter?: (record: T) => boolean): Promise<T[]>;
  create(data: Omit<T, "id">): Promise<T>;
  read(key: T[TKey]): Promise<T>;
  update(key: T[TKey], data: Omit<T, TKey>): Promise<T>;
  delete(key: T[TKey]): Promise<void>;
}
