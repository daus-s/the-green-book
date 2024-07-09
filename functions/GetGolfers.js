async function getGolfers(tournament) {
    /* //SHIFT-ALT-A
    console.log('tournament :', tournament)
    console.log(tournament.mongodb_endpoint)
    let a, b, c, d = false;
    a = tournament?true:false;
    console.log('object:', a );
    b = tournament?.mongodb_endpoint?true:false;
    console.log('mongo cnx:', b );
    c = tournament?.mongodb_endpoint?.year?true:false;
    console.log('year:', c );
    d = tournament?.mongodb_endpoint?.tournament?true:false;
    console.log('tournament:', d ); 
    */
    if (!tournament || !tournament?.mongodb_endpoint || !tournament.mongodb_endpoint?.year || !tournament.mongodb_endpoint?.tournament) {
        return {
            data: undefined,
            error:
                "Malformed tournament object:\n" +
                JSON.stringify(tournament) +
                `\nhighly_verbose:\n  • mongodb_endpoint: ${tournament?.mongodb_endpoint}\n  • tournament: ${tournament?.mongodb_endpoint?.year}\n  • tournament: ${tournament?.mongodb_endpoint?.tournament}`,
        };
    }
    const query = `?year=${tournament.mongodb_endpoint.year}&tournament=${tournament.mongodb_endpoint.tournament}`;
    try {
        const response = await fetch("/api/golfers" + query);

        if (!response.ok) {
            throw new Error(`HTTP error\nStatus: ${response.status}`);
        }

        const data = await response.json();
        return { data: data, error: undefined };
    } catch (error) {
        return { data: undefined, error: error.message };
    }
}

module.exports = { getGolfers };
