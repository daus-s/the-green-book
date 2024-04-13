import clientPromise from "../../functions/MongoDBClient";

export default async function handler(req, res) {
    let client;
    try {
        client = await clientPromise.connect();
        const db = client.db("golf");
        const golfers = await db
                                .collection("masters")
                                .find({})
                                .toArray();
        res.status(200).json(golfers);
    } catch (mongoError) {
        console.error(mongoError);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        if (client) {
            try {
                await client.close();
            } catch (closeError) {
                console.error(closeError);
            }
        }
    }
}