const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

var mongoClient: typeof MongoClient;

module.exports = {
    connectToCluster: () => {
        console.log('Connecting to your URLTag Analytics cluster...');
        try {
            mongoClient = new MongoClient(
                process.env.MONGODB_URI, 
                { 
                    useNewUrlParser: true, 
                    useUnifiedTopology: true, 
                    serverApi: ServerApiVersion.v1
                }
            );
            console.log('🗸 Connected to Mongo cluster \n');
            return mongoClient;
        } catch (e) {
            console.log('✗ Connection to Mongo cluster failed: Exiting... ' + e + '\n');
            process.exit(1);
        }
    },
    getMongoClient: () => mongoClient
};