import DynamoDB from "aws-sdk/clients/dynamodb";
import {
	DynamoAttributeTypes,
	DynamoDataTypes,
} from "../types/DynamoDataTypes";
import {
	DynamoConditions,
	DynamoRealItem,
	DynamoItemsRealTypes,
} from "../types/Item";
import { DynamoRealTypes, RealAttributeTypes } from "../types/RealDataTypes";
import InvalidDataTypeError from "../errors/InvalidDataTypeError";

export function realAttributesToDynamo(
	val: RealAttributeTypes
): DynamoAttributeTypes {
	if (typeof val === "string") {
		return "S";
	}
	return "N";
}

export function realToDynamo(val: DynamoRealTypes): DynamoDataTypes {
	if (val === null || val === undefined) {
		return "NULL";
	}

	if (val instanceof Set) {
		if ([...val].every((v) => typeof v === "number")) {
			return "NS";
		} else if ([...val].every((v) => typeof v === "string")) {
			return "SS";
		} else {
			return "NULL";
		}
	}
	if (Array.isArray(val)) {
		return "L";
	}

	switch (typeof val) {
		case "boolean":
			return "BOOL";
		case "number":
			return "N";
		case "string":
			return "S";
		case "object":
			return "M";
		default:
			throw new InvalidDataTypeError(val);
	}
}

export function handleValueToDynamo(
	val: DynamoRealTypes
): DynamoItemsRealTypes {
	if (val === undefined || val === null) {
		return true;
	}

	if (Array.isArray(val)) {
		return val.map((v) => {
			return {
				[realToDynamo(v)]: handleValueToDynamo(v),
			};
		});
	}

	if (val instanceof Set) {
		const valArray = [...val];
		return valArray;
	}

	if (typeof val === "object") {
		return objectToDynamo(val);
	} else if (typeof val === "number") {
		return val.toString();
	}

	return val;
}

export function objectToDynamo(obj: DynamoRealItem) {
	return DynamoDB.Converter.marshall(obj, { convertEmptyValues: true });
}

export function toDynamoCondition(cond: DynamoConditions) {
	switch (cond) {
		case "==":
			return "=";
		case "!=":
			return "NOT";
		case "<=":
			return "<=";
		case "<":
			return "<";
		case ">=":
			return ">=";
		case ">":
			return ">";
		case "BETWEEN":
			return "BETWEEN";
		case "STARTSWITH":
			return "begins_with";
	}
}
