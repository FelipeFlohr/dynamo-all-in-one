import DynamoBinary from "../lib/models/DynamoBinary";

// eslint-disable-next-line no-undef
test("Name is being converted to Base64", () => {
	const name = "John Doe";
	const encrypted = DynamoBinary.encodeValue(name);
	expect(encrypted).toBe("Sm9obiBEb2U=");
});

test("Name is being decoded from Base64", () => {
	const encoded = "Sm9obiBEb2U=";
	const decrypted = DynamoBinary.decodeValue(encoded);
	expect(decrypted).toBe("John Doe");
});
