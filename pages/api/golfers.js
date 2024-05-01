import clientPromise from "../../functions/MongoDBClient";
import { validateFields } from "../../functions/ParseSchema";

export default async function handler(req, res) {
    let query = {}

    console.log(req)
    if (!validateFields(req.query)) {
        console.log(req.query)
        res.status(418).json({error: 'Malformed request.'})
        return;
    } else {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Cheatsheet
        query._id =  {"$regex": `${req.query.year}_[0-9]{1,3}_${req.query.tournament}`};
    }

    let client;
    console.log(query);
    try {
        client = await clientPromise.connect();
        const db = client.db("golf");
        const golfers = await db
                                .collection("masters")
                                .find(query)
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
    OLD FIX: https://stackoverflow.com/questions/59942238/mongoerror-topology-is-closed-please-connect-despite-established-database-conn
    NEW FIX: literally dont close it because dont close it.
     * 
     */
}