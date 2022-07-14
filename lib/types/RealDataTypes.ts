import DynamoBinary from "../models/DynamoBinary";

export type NumberDataType = number;

export type StringDataType = string;

export type BooleanDataType = boolean;

export type NullDataType = null | undefined;

export type BinaryDataType = DynamoBinary;

export type ListDataType = any[];

export type MapDataType = { [key: string]: any };

export type NumberSetDataType = Set<number>;

export type StringSetDataType = Set<string>;

export type BinarySetDataType = Set<DynamoBinary>;

export type RealAttributeTypes =
	| NumberDataType
	| StringDataType
	| BinaryDataType;

export type DynamoRealTypes =
	| NumberDataType
	| StringDataType
	| BooleanDataType
	| NullDataType
	| BinaryDataType
	| ListDataType
	| MapDataType
	| NumberSetDataType
	| StringSetDataType
	| BinarySetDataType;
