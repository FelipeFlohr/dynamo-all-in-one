export default class extends Error {
	public constructor(val: unknown) {
		super(`Type ${typeof val} is invalid in DynamoDB`);
	}
}
