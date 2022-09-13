export enum FilterFieldTypes {
  BOOLEAN = 'boolean',
  ENUM = 'enum',
  TEXT = 'text',
  NUMBER = 'number',
}

export interface FilterFieldValue {
  value: string;
  name?: string;
}

// Field that can be used as filter (AKA FilterField)
export interface FilterField {
  field: string;
  type: string;
  translatable?: boolean;
  label?: string;
  values?: FilterFieldValue[];
}
