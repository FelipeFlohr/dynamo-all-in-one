import InvalidBetweenFilterError from "../../../../errors/InvalidBetweenFilterError";
import {
	DynamoGeneratedValues,
	DynamoPrimaryKey,
	DynamoQueryAttribute,
} from "../../../../types/Item";
import {
	handleValueToDynamo,
	realToDynamo,
} from "../../../../utils/realToDynamoTypes";

export default function generateValues(
	pk: DynamoPrimaryKey,
	filters?: DynamoQueryAttribute[]
): DynamoGeneratedValues {
	const pkObj = {
		":pk": {
			[realToDynamo(pk.partitionKey.value)]: handleValueToDynamo(
				pk.partitionKey.value
			),
		},
	};
	const skObj =
		pk.sortKey !== undefined
			? {
					sk: {
						[realToDynamo(pk.sortKey.value)]: handleValueToDynamo(
							pk.sortKey.value
						),
					},
			  }
			: undefined;

	const filtersMappedList = filters?.map((f, i) => {
		if (f.operation === "BETWEEN") {
			if (f.values === undefined || f.values.length < 2) {
				throw new InvalidBetweenFilterError();
			}

			return {
				[`:${i}B1`]: {
					[realToDynamo(f.values[0])]: handleValueToDynamo(f.values[0]),
				},
				[`:${i}B2`]: {
					[realToDynamo(f.values[1])]: handleValueToDynamo(f.values[1]),
				},
			};
		}

		return {
			[`:${i}`]: {
				[realToDynamo(f.value)]: handleValueToDynamo(f.value),
			},
		};
	});
	const filtersMapped = filtersMappedList?.reduce((prev, curr) => {
		return {
			...prev,
			...curr,
		};
	});

	const result = [pkObj, skObj, filtersMapped]
		.filter((v) => v !== undefined)
		.reduce((prev, curr) => {
			return {
				...prev,
				...curr,
			};
		});
	return result as DynamoGeneratedValues;
}
