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
        // try {
        //     await client.close();
        // } catch (closeError) {
        //     console.error(closeError);
        // } 
        console.error(mongoError);
        res.status(500).json({ error: "Internal Server Error" });
    } //dont add a finally block here because it is executed before the try is finished even with await???
    /* 
    https://stackoverflow.com/questions/59942238/mongoerror-topology-is-closed-please-connect-despite-established-database-conn

     * I've found the solution to the problem, but I'm not sure I understand the reasoning. 
     * The client.close() in the finally block of the validateUniqueUser function. 
     * It was closing the connection before the connection in the createPracticeProfile function was finished inserting the user.
     * When that line is taken out, the function works. 
     * 
     * 
     * dont even fucking close this fuckign bullshit what the fuck
     */
}