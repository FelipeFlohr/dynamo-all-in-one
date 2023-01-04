import DynamoAllInOne from "../lib/models/impl/DynamoAllInOne";
import { createConnection } from "./helpers";

describe("Tests the DynamoAllInOne implementation", () => {
    let dynamo: DynamoAllInOne;

    beforeAll(() => {
        dynamo = createConnection();
    });

    afterEach(async () => {
        const tables = await dynamo.getAllTables();
        for (const table of tables) {
            await dynamo.deleteTable(table);
        }
    });

    it("should create a table", async () => {
        await dynamo.createTable({
            tableName: "table1",
            tablePrimaryKey: {
                partitionKey: {
                    partitionKeyName: "pk",
                    partitionKeyType: "S"
                }
            },
            provisionedThroughput: {
                readUnits: 200,
                writeUnits: 200,
            }
        });
        const tables = await dynamo.getAllTables();
        expect(tables[0]).toBe("table1");
    });

    it("should delete a table", async () => {
        await dynamo.createTable({
            tableName: "table2",
            tablePrimaryKey: {
                partitionKey: {
                    partitionKeyName: "pk",
                    partitionKeyType: "S"
                }
            },
            provisionedThroughput: {
                readUnits: 200,
                writeUnits: 200,
            }
        });
        const tables = await dynamo.getAllTables();
        expect(tables[0]).toBe("table2");

        await dynamo.deleteTable(tables[0]);

        expect((await dynamo.getAllTables()).length).toBe(0);
    });

    it("should bring all the tables", async () => {
        await dynamo.createTable({
            tableName: "table1",
            tablePrimaryKey: {
                partitionKey: {
                    partitionKeyName: "pk",
                    partitionKeyType: "S"
                }
            },
            provisionedThroughput: {
                readUnits: 200,
                writeUnits: 200,
            }
        });
        await dynamo.createTable({
            tableName: "table2",
            tablePrimaryKey: {
                partitionKey: {
                    partitionKeyName: "pk",
                    partitionKeyType: "S"
                }
            },
            provisionedThroughput: {
                readUnits: 200,
                writeUnits: 200,
            }
        });
        await dynamo.createTable({
            tableName: "table3",
            tablePrimaryKey: {
                partitionKey: {
                    partitionKeyName: "pk",
                    partitionKeyType: "S"
                }
            },
            provisionedThroughput: {
                readUnits: 200,
                writeUnits: 200,
            }
        });

        expect((await dynamo.getAllTables()).length).toBe(3);
    });

    it("should return a boolean indicating if the table exists", async () => {
        await dynamo.createTable({
            tableName: "table1",
            tablePrimaryKey: {
                partitionKey: {
                    partitionKeyName: "pk",
                    partitionKeyType: "S"
                }
            },
            provisionedThroughput: {
                readUnits: 200,
                writeUnits: 200,
            }
        });

        expect(await dynamo.tableExists("table1")).toBe(true);
        expect(await dynamo.tableExists("table2")).toBe(false);
    });
});