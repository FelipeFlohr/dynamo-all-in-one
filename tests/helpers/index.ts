import DynamoAllInOne from "../../lib/models/impl/DynamoAllInOne";

export function createConnection(): DynamoAllInOne {
    return new DynamoAllInOne({
        accessKeyId: "test",
        region: "test",
        secretKeyId: "test",
        endpoint: "http://localhost:8000"
    });
}