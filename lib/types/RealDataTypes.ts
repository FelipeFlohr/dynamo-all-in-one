/* eslint-disable @typescript-eslint/no-explicit-any */
export type NumberDataType = number;

export type StringDataType = string;

export type BooleanDataType = boolean;

export type NullDataType = null | undefined;

export type ListDataType = any[];

export type MapDataType = { [key: string]: any };

export type NumberSetDataType = Set<number>;

export type StringSetDataType = Set<string>;

export type RealAttributeTypes = NumberDataType | StringDataType;

export type DynamoRealTypes =
	| NumberDataType
	| StringDataType
	| BooleanDataType
	| NullDataType
	| ListDataType
	| MapDataType
	| NumberSetDataType
	| StringSetDataType;
