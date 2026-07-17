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
