import clientPromise from "../../functions/MongoDBClient";
import { validateFields } from "../../functions/ParseSchema";

export default async function handler(req, res) {
    let query = {};
    // console.log("RESPONSE QUERY:", req.query);
    const ok = validateFields(req.query);
    if (!ok) {
        res.status(418).json({ error: "Malformed request." });
        return;
    } else {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Cheatsheet
        if (ok === 1) {
            query.year = { $eq: parseInt(req.query.year) };
            query.tournament = { $eq: req.query.tournament };
        } else if (ok === 2) {
            query = {};
        }
    }

    let client;
    try {
        client = await clientPromise.connect();
        const db = client.db("golf");
        const golfers = await db.collection("masters").find(query).toArray();
        golfers.sort((a, b) => a.total - b.total);
        res.status(200).json(golfers);
    } catch (mongoError) {
        // try {
        //     await client.close();
        // } catch (closeError) {
        //     console.error(closeError);
        // }
        console.error(mongoError);
        res.status(500).json({ error: "Internal Server Error", mongoError: mongoError });
    } //dont add a finally block here because it is executed before the try is finished even with await???
    /* 
    OLD FIX: https://stackoverflow.com/questions/59942238/mongoerror-topology-is-closed-please-connect-despite-established-database-conn
    NEW FIX: literally dont close it because dont close it.
     * 
     */
}
