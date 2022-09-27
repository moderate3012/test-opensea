export interface IResponseInterface<T> {
  readonly message?: string;
  readonly status?: number;
  readonly data?: T;
}
