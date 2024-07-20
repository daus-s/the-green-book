//functions and operatoprs for the Bet2 DataStructure

/* SCHEMA
 * ___________________________________________________________________________________________________________
 * | id PK, unq | content  | creator FK -> public_users.id | public | open | g FK -> groups.groupID | line   |
 * | int8, seq  | text     | int4                          | bool   | bool | int4                   | float4 | = 22+strlen(context)
 * -----------------------------------------------------------------------------------------------------------   SIZE
 */

function validate(bet) {
    //type assertion
    const {id, content, creator, public: pub, open, g: group, line } = bet;
    const type = bet && (typeof id === "bigint" || typeof id === "number") && typeof content === "string" && typeof creator === "number" && typeof open === "boolean" && typeof  pub === "boolean" && (typeof group === "number" || group === null) && (typeof line === "number" || line === null);
    if (!type) {
        return false;
    }

    // if a group isn't specified then the bet must be public 
    // if not then the bet is not valid
    if (group === null && !pub) {
        return false;
    }
    
    return true;
}

function mode(bet) {
    if (!validate(bet)) {
        return null;
    }
    const { line } = bet;

    if (line) {
        return "over_under";
    }
    else if (line === "null") {
        return "options"
    }
    
}


module.exports = { validate, mode };