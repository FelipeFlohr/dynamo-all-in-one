export default class extends Error {
	public constructor() {
		super("BETWEEN operation must have at least two values");
	}
}
