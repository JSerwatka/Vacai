type NotNill<T> = T extends null | undefined ? never : T;

// eslint-disable-next-line @typescript-eslint/ban-types
type Primitive = Function | boolean | number | string | null | undefined;

export type DeepRequired<T> = T extends Primitive
    ? NotNill<T>
    : {
          [P in keyof T]-?: T[P] extends (infer U)[]
              ? DeepRequired<U>[]
              : T[P] extends readonly (infer U2)[]
              ? DeepRequired<U2>
              : DeepRequired<T[P]>;
      };
