import { DynamoDB } from "aws-sdk";
import { DynamoProvisionedThroughput } from "../../../../types/Table";

export default function generateProvisionedThroughput(
	prov?: DynamoProvisionedThroughput
): DynamoDB.ProvisionedThroughput | undefined {
	if (!prov) return;
	return {
		ReadCapacityUnits: prov.readUnits,
		WriteCapacityUnits: prov.writeUnits,
	};
}
