import { DynamoDB } from "aws-sdk";
import { DynamoItem, DynamoRealItem } from "../../../../types/Item";

export default function convertToRealType(
	item?: DynamoItem
): DynamoRealItem | undefined {
	if (!item) return;

	const res = DynamoDB.Converter.unmarshall(item as DynamoDB.AttributeMap, {
		convertEmptyValues: true,
	});

	return res as DynamoRealItem;
}
