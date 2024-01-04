function getComplementary(odds) {
    return -odds;
}

function american2imp(x) {
    //assumes x is in the +100 scale and the initial wager is 100
    //this function could be generalized but it will not be used for other applications
    /**
     * Proof:
     *      american winnings:
     *          W - winnings
     *          p - probability
     *          positive: 
     *              W= (100+x)/100 = 1+(x/100)
     * 
     *              W*p=w
     * 
     *              p=w/W
     * 
     *              p = w/(1+x/100)
     * 
     *              p =  w                
     *                  _____________ 
     * 
     *                    1  +  x/100 
     * 
     *              p =  100                        
     *                  ______
     *                   100+x                       |w=100
     * 
     *              p = 100/100+x
     */
    if (x==0){
        throw new Error("Certainty Exception. The implied probability for the american odds +0/-0 is a mathematical certainty.");
    }
    return x>0?100/(100+x):1/(1-(100/x)); 
}

function imp2american(p) {
    /**
     * Proof:
     *      american winnings:
     *          W - winnings
     *          p - probability
     *          positive: 
     *              "as before"
     *              p = 100/100+x
     *              p(100+x) =
     * 
     */
    if (!(p>0&&p<1)) {
        throw new Error("Probability Exception. Probability of event is eiher too low (less than 0) or too high (greatter than one)")
    }
    return p>.5?-100/((1/p)-1):100*((1/p)-1);
}