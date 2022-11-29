import { Db, MongoClient } from "mongodb";

var mongoClient: MongoClient;

export const mongoConfig = {
    connectToCluster: async (): Promise<MongoClient> => {
        console.log("Connecting to your URLTag Analytics cluster...");
        try {
            mongoClient = new MongoClient(process.env.MONGODB_URI!, {
                monitorCommands: true,
            });

            console.log("🗸 Connected to Mongo cluster \n");
            const db: Db = mongoClient.db("test");

            if ((await db.collections()).length < 1) {
                console.log('Creating collection test["batches"]...');
                await db.createCollection("batches");
            }

            return mongoClient;
        } catch (e) {
            console.log(
                "✗ Connection to Mongo cluster failed: Exiting... " + e + "\n"
            );
            process.exit(1);
        }
    },
    getMongoClient: () => mongoClient,
};
