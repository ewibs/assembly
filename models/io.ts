export type IOType = 'string' | 'number' | 'boolean';

export type IOTypeValue<Type extends IOType> = (
  Type extends 'string' ?
    string : Type extends 'number' ?
      number : boolean
);

export type IODelegationSelection = [] | [...number[], string]

export type IOInput<Type extends IOType = IOType> = Type extends IOType ? {
  type: Type,
  delegation: IODelegationSelection,
  default?: IOTypeValue<Type>,
} : never;

export type InputMap = {
  [key: string]: IOInput<IOType>
};

// export type IOValue<Type extends IOType = IOType> = Type extends IOType ? {
//   selector?: IODelegationSelection,
//   value?: IOTypeValue<Type>,
// } : never;

export type IORefValueMap = {
  inputs: {
    [key: string]: IOTypeValue<IOType>;
  };
};

export type IO = {
  inputs?: InputMap;
}