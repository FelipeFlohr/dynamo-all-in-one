/**
 * Represents a Dynamo-type binary. Converts a value
 * to Base64
 */
export default class DynamoBinary {
	private readonly _valueNonEncrypted: string;
	private readonly _valueEncrypted: string;

	public constructor(value: string) {
		this._valueNonEncrypted = value;
		this._valueEncrypted = DynamoBinary.encodeValue(value);
	}

	/**
	 * Returns the encrypted value (Base64).
	 */
	get value() {
		return this._valueEncrypted;
	}

	/**
	 * Encrypts a value to Base64
	 * @param val Value to encrypt
	 * @returns Encrypted Base64 value
	 */
	public static encodeValue(val: string) {
		const buff = Buffer.from(val, "utf-8");
		return buff.toString("base64");
	}

	/**
	 * Decrypts a Base64 value
	 * @param val Value to decrypt
	 * @returns Decrypted value
	 */
	public static decodeValue(val: string) {
		const buff = Buffer.from(val, "base64");
		return buff.toString("utf-8");
	}
}
