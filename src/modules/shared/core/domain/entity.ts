export type Entity<T> = {
  readonly [k in keyof T]: T[k];
};
