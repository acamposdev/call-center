const operators = {
    LT: { simbol: '<', literal: 'Menor que'},
    LE: { simbol: '<=', literal: 'Menor o igual que'},
    GT: { simbol: '>', literal: 'Mayor que'},
    GE: { simbol: '>=', literal: 'Mayor o igual que'},
    EQ: { simbol: '==', literal: 'Igual que'}
}

/**
 * Regla que va a ser evaluada
 */
class Rule {
    constructor(fact, operator, value) {
        this.fact = fact;
        this.operator = opeartor;
        this.value = value
    }
}

rules = [
    new Rule()
]



console.log(operators.LT);