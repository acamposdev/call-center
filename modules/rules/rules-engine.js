/**
 * @class
 * Rule object for 
 * 
 * @param {String} fact Parameter that will be evaluated
 * @param {String} operator Comparator ('<', '<=', '>', '>=' , '==')
 * @param {any} value Any value for evaluate
 * @param {Funcion} cb Callback function invoked if rules response true 
 */
function Rule(fact, operator, value, cb) {
    this.fact = fact;
    this.operator = operator;
    this.value = value;
    this.fn = cb;
}

/**
 * @class
 * Easy rules engine for common operators (great than, less than, great equals, less equals and strict equals)
 * @example
 * 
 * let Rule = require('rules-engine').Rule;
 * let RuleEngine = require('rules-engine').RulesEngine;
 * 
 * let rulesEngine = new RulesEngine();
 * 
 * // Rules definition
 * let rules = [];
 * rules.push(new Rule('person.name', '==', 'John Doe'));
 * rules.push(new Rule('person.card', '==', undefined));
 * 
 * // Load rules into engine
 * rulesEngine.load(rules);
 * 
 * // Definition a facs to evaluate. Need match with person.name or person.card
 * var fact = person.name = 'John Doe';
 * var match = rulesEngine.run(fact);
 * // output -> match it's an array that contain one entry for each rule matched
 */
function RulesEngine() {
    this.rules = [];
    
    /**
     * Method for load rules in memory
     * @method 
     * @example 
     * let rules = [];
     * rules.push(new Rule('person.name', '==', 'John Doe'));
     * rules.push(new Rule('person.card', '==', undefined));   
    * // Load rules into engine
     * rulesEngine.load(rules);
     * @param {Array<Rule>} rules Array of rules that will be evaluated
     */
    function load(rules) {
        this.rules = rules;

        rules.forEach(rule => {
            add(rule);            
        });
    }

    function add(rule) {
        if (typeof rule.value == 'number') {
            rule.expression = rule.fact + ' ' + rule.operator + ' ' + rule.value;
        } else if (rule.value == 'undefined') {
            rule.expression = rule.fact + ' ' + rule.operator + ' ' + rule.value;
        } else if (typeof rule.value == 'string') {
            rule.expression = rule.fact + ' ' + rule.operator + ' "' + rule.value + '"';
        } 
        
        var rules = [];
        //console.log(rules);
        rules.push({
            fact: rule.fact,
            operator: rule.operator,
            value: rule.value,
            expression: rule.expression,
            fn: rule.fn
        });
        this.rules = rules;
        //console.log(this.rules);
        
    }

    /**
     * Execute this method to evaluate fact with rules loaded before
     * @method
     * 
     * @example
     * // Definition a facs to evaluate. Need match with person.name or person.card
     * var fact = person.name = 'John Doe';
     * var match = rulesEngine.run(fact);
     * // output -> match it's an array that contain one entry for each rule matched
     * 
     * @param {JSON} fct 
     */
    function run(fct) {
        var fact = fct;
        var rulesMatch = [];

        this.rules.forEach((rule) => {

            var result;
            try {
                result = eval(rule.expression);
                if (result) {
                    //console.log('Regla cumplida => ' + rule.expression + ' Hecho ::> ' + JSON.stringify(fact));
                    rule.match = true;
                    rulesMatch.push(rule);
                } else {
                    //console.log('Regla no cumplida cumplida => ' + rule.expression + ' Hecho ::> ' + JSON.stringify(fact));
                    rule.match = false;
                }
            } catch(err) {
                //console.log('No se ha encontrado hecho para la regla \'' + rule.expression + '\'');
                result = false;
            }

            
        });

        return rulesMatch;
    }

    return {
        load,
        run,
        add
    }
}

module.exports.RulesEngine = RulesEngine;
module.exports.Rule = Rule;