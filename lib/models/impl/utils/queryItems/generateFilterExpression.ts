import { DynamoQueryAttribute } from "../../../../types/Item";
import { toDynamoCondition } from "../../../../utils/realToDynamoTypes";

export default function generateFilterExpression(
	filters?: DynamoQueryAttribute[]
): string | undefined {
	if (!filters) return;

	const resultList = filters.map((f, i) => {
		if (f.operation === "BETWEEN") {
			return `${f.keyName} BETWEEN :${i}B1 AND :${i}B2`;
		} else if (f.operation === "STARTSWITH") {
			return `begins_with (${f.keyName}, :${i})`;
		} else {
			return `${f.keyName} ${toDynamoCondition(f.operation)} :${i}`;
		}
	});
	const resultExpression = resultList.reduce((prev, curr) => {
		return prev + ` AND ${curr}`;
	});
	return resultExpression;
}
