async function getGolfers() {
    try {
        const response = await fetch('/api/golfers');

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
