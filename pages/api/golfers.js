import clientPromise from "../../functions/MongoDBClient";

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db("golf");
        const golfers = await db
                                .collection("masters")
                                .find({})
                                .toArray();
        console.log(golfers);
        res.json(golfers);
    } catch (e) {
        console.error(e);
    }
}