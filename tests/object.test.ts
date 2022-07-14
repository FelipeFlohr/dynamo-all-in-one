/* eslint-disable no-undef */
import _ from "lodash";
import DynamoAllInOne from "../lib";
import DynamoBinary from "../lib/models/DynamoBinary";
import { QueryItemsConfig } from "../lib/types/Item";
import {
	objectToDynamo,
	realAttributesToDynamo,
} from "../lib/utils/realToDynamoTypes";
import { auth } from "./dynamoLocalAccess.json";

// eslint-disable-next-line no-unused-vars
const dynamo = new DynamoAllInOne({
	accessKeyId: auth.accessKey,
	region: auth.region,
	secretKeyId: auth.secretKey,
	endpoint: auth.endpoint,
});

// test("Object is being converted to the AWS API type", () => {
//   const obj = {
//     name: "John Doe",
//     age: 20,
//     bin: new DynamoBinary("John Doe"),
//     arr: [1, 2, 3, "Counting"],
//     obj: {
//       firstName: "John",
//       bin: new DynamoBinary("John Doe"),
//     },
//   };

//   const res1 = objectToDynamo(obj);
//   expect(res1).toStrictEqual({
//     name: {
//       S: "John Doe",
//     },
//     age: {
//       N: "20",
//     },
//     bin: {
//       B: DynamoBinary.encodeValue("John Doe"),
//     },
//     arr: {
//       L: [1, 2, 3, "Counting"],
//     },
//     obj: {
//       M: {
//         firstName: {
//           S: "John",
//         },
//         bin: {
//           B: DynamoBinary.encodeValue("John Doe"),
//         },
//       },
//     },
//   });
// });

test("Query filter is being generated", async () => {
	const generateKeyConditionExp = (configs: QueryItemsConfig) => {
		const pkValue = configs.primaryKey.partitionKey.value;
		const skValue = configs.primaryKey.sortKey?.value;

		let exp = `${configs.primaryKey.partitionKey.keyName} = :pk`;
		if (skValue) {
			exp = exp + ` AND ${configs.primaryKey.sortKey?.keyName} = :sk`;
		}

		const conds = {
			":pk": {
				[realAttributesToDynamo(pkValue)]:
					pkValue instanceof DynamoBinary ? pkValue.value : pkValue,
			},
		};

		if (skValue) {
			return {
				exp,
				keyFilters: _.merge(conds, {
					":sk": {
						[realAttributesToDynamo(skValue)]:
							skValue instanceof DynamoBinary ? skValue.value : skValue,
					},
				}),
			};
		} else {
			return {
				exp,
				keyFilters: conds,
			};
		}
	};

	const config: QueryItemsConfig = {
		primaryKey: {
			partitionKey: {
				keyName: "client",
				value: "database01",
			},
			sortKey: {
				keyName: "id",
				value: "12345",
			},
		},
		tableName: "integrations",
	};

	const res = generateKeyConditionExp(config);
	expect(res.keyFilters).toStrictEqual({
		":pk": {
			S: "database01",
		},
		":sk": {
			S: "12345",
		},
	});
});

test("Primary Key expression is being generated", () => {
	const res1 = dynamo.generatePrimaryKeyExpression({
		keyName: "client",
		value: "database01",
	});
	const res2 = dynamo.generatePrimaryKeyExpression(
		{
			keyName: "client",
			value: "database01",
		},
		{
			keyName: "id",
			value: "1234id",
		}
	);

	expect(res1).toBe("client = :pk");
	expect(res2).toBe("client = :pk AND id = :sk");
});

test("Filter is being generated", () => {
	const res1 = dynamo.generateFilterExpression([
		{
			keyName: "name",
			operation: "==",
			value: "Felipe",
		},
		{
			keyName: "age",
			operation: "STARTSWITH",
			value: 2,
		},
	]);
	const res1Values = dynamo.generateValues(
		{
			partitionKey: {
				keyName: "client",
				value: "database01",
			},
		},
		[
			{
				keyName: "name",
				operation: "==",
				value: "Felipe",
			},
			{
				keyName: "age",
				operation: "STARTSWITH",
				value: 2,
			},
		]
	);

	expect(res1).toBe("name = :0 AND begins_with (age, :1)");
	expect(res1Values).toStrictEqual({
		":pk": {
			S: "database01",
		},
		":0": {
			S: "Felipe",
		},
		":1": {
			N: "2",
		},
	});
});

test("Value of Map type is being converted to Dynamo type", () => {
	const val = {
		details: {
			name: "Felipe",
			age: 20,
		},
	};

	const res = objectToDynamo(val);
	expect(res).toStrictEqual({
		details: {
			M: {
				name: {
					S: "Felipe",
				},
				age: {
					N: "20",
				},
			},
		},
	});
});

test("List is being converted to correct type", () => {
	const list = {
		lista: [1, 2, { nome: "Felipe" }, "teste"],
	};

	console.log(JSON.stringify(objectToDynamo(list)));

	expect(objectToDynamo(list)).toStrictEqual({
		lista: {
			L: [
				{
					N: "1",
				},
				{
					N: "2",
				},
				{
					M: {
						nome: {
							S: "Felipe",
						},
					},
				},
				{
					S: "teste",
				},
			],
		},
	});
});
