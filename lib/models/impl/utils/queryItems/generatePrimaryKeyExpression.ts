import {
	DynamoQueryPartitionKey,
	DynamoQuerySortKey,
} from "../../../../types/Item";

export default function generatePrimaryKeyExpression(
	pk: DynamoQueryPartitionKey,
	sk?: DynamoQuerySortKey
): string {
	let exp = `${pk.keyName} = :pk`;
	if (sk?.value) {
		exp = exp + ` AND ${sk.keyName} = :sk`;
	}

	return exp;
}
