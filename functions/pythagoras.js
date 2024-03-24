//helper file for all things circle, trig and geometry


/**
 * return the distance from the inscribed 
 * circle to the vertex of the bounding squarre
 * used to generate padding for "orbiting" elements
 * @param {number} width 
 * @returns {number}
 */
function padding(width) {
    return .414 * width;
}

/**
 * 
 * @param {set} gradians 
 * @param {number | string} radius 
 */
function carteFromAngle(gradians, radius) {
    let r = radius;
    let θ = Math.PI*(1/2 - 2 * gradians.num/gradians.den); //θ=(π/2)-arctan(α: gradient)
    if (typeof radius === 'number') {
        return {
            x: r*Math.cos(θ),
            y: r*Math.sin(θ)
        };
    }
}

/**
 * 
 * @param {number} deg 
 * @returns {number}
 */
function antiRotation(deg) {
    let degrees = -1 * deg;
    degrees %= 360;
    // degrees < 0 ? degrees+=360 : donothing ;
    //degrees = degrees + (degrees<0) * 360;
    return `${degrees}deg`;
}

module.exports = { antiRotation, padding, carteFromAngle}