import DynamoBinary from '../models/DynamoBinary'
import { DynamoAttributeTypes, DynamoDataTypes } from '../types/DynamoDataTypes'
import { DynamoRealTypes, RealAttributeTypes } from '../types/RealDataTypes'

export function realAttributesToDynamo (val: RealAttributeTypes): DynamoAttributeTypes {
  if (typeof (val) === 'string') {
    return 'S'
  }
  if (typeof (val) === 'number') {
    return 'N'
  }
  return 'B'
}

export function realToDynamo (val: DynamoRealTypes): DynamoDataTypes {
  if (val === null || val === undefined) {
    return 'NULL'
  }
  if (val instanceof Set) {
    if ([...val].every(v => typeof (v) === 'number')) {
      return 'NS'
    } else if ([...val].every(v => typeof (v) === 'string')) {
      return 'SS'
    } else if ([...val].every(v => v instanceof DynamoBinary)) {
      return 'BS'
    } else {
      return 'NULL'
    }
  }
  if (Array.isArray(val)) {
    return 'L'
  }

  switch (typeof (val)) {
    case 'boolean':
      return 'B'
    case 'number':
      return 'N'
    case 'string':
      return 'S'
    case 'object':
      return 'M'
  }
}
