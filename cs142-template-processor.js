// could not use the ES6 constructor format, so this is based off the ES5 approach
function Cs142TemplateProcessor(template){
    this.template = template;
}
// declaraction of the fillIn method
// start off with the template, find all the parameters in curly braces,
// which is stored in param. Loop through these params, strip curly braces
// to get the property, create a new regex for ea. property including curly braces and 
// then replace each match with the corresponding property value from the dictionary.
Cs142TemplateProcessor.prototype.fillIn = function fillIn(dictionary){
    let result = this.template;
    
    var re = /{{[A-Za-z0-9_]*}}/g;
    
    var param = result.match(re);

    for (let i = 0; i < param.length; i++){
        var property = param[i].replace(/[{}]/g,"");
        var regex = new RegExp(param[i]);
        if (dictionary[property]){
            result = result.replace(regex, dictionary[property]);
        } else {
            result = result.replace(regex, "");
        }
    }
      
    return result;
};
