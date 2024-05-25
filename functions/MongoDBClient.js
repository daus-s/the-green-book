import { MongoClient, ServerApiVersion } from "mongodb";
const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}
const options = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
};

const clientPromise = new MongoClient(uri, options);
export default clientPromise;
