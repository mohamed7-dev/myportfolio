export type DeepPartial<T> = {
  [P in keyof T]?:
    | null
    | (T[P] extends Array<infer U>
        ? Array<DeepPartial<U>>
        : T[P] extends ReadonlyArray<infer U>
          ? ReadonlyArray<DeepPartial<U>>
          : DeepPartial<T[P]>);
};

export interface Orderable {
  position: number;
}

// biome-ignore lint/complexity/noBannedTypes: (() => void) can't be extended by interface
export interface ClassType<T> extends Function {
  new (...args: any[]): T;
}

export type NextCtx = { params: Promise<Record<string, unknown>> };

type JSONValue =
  | string
  | number
  | boolean
  | null
  | Array<JSONValue>
  | {
      [key: string]: JSONValue;
    };

export type JSONCompatible<T> = {
  [Key in keyof T]: T[Key] extends JSONValue
    ? T[Key]
    : Pick<T, Key> extends Required<Pick<T, Key>>
      ? never
      : JSONCompatible<T[Key]>;
};
