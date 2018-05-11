"use strict";
class TableTemplate{
    constructor(){
    }

    static fillIn(id, dict, columnName) {
        // process the first header row no matter what
        var queryStringHeader = "#" + id + " tr";
        var tableChildren = document.querySelector(queryStringHeader).children;
        // Array to keep track of the different column names and their indices
        var headers = [];

        for (let i = 0; i < tableChildren.length; i ++){
            // create a temp div that you can use to get the td's innerHTML
            var tmp = document.createElement('div');
            tmp.appendChild(tableChildren[i].lastChild);
            var template = tmp.innerHTML;
            // pass string to the processor from Project 2
            var processor = new Cs142TemplateProcessor(template);
            var resultTemplate = processor.fillIn(dict);
            // add this processed column name into the list for easy checking later
            headers.push(resultTemplate);
            // create a new text node with the processed template and then replace
            // the unproccessed template with dictionary match where it used to be
            var newTemplate = document.createTextNode(resultTemplate);
            tableChildren[i].insertBefore(newTemplate, tableChildren[i].lastChild);

        }
        // Check if column name is present see if the columnName is in headers, 
        // if it is not, return, if it is, process that column. If columnName is not
        // present then you want to process every td in every tr.
        if (columnName){
            if (!headers.includes(columnName)){
                // return without processing is there is no matching columnName
                return;
            } else {
                // For all rows, get the child td element that corresponds to the 
                // the column of the column name, demarked as columnIndex.
                // Then for each tr except the first, change process the
                // child td at columnIndex
                var tablesRows = document.querySelectorAll(queryStringHeader);
                for (let i = 1; i < tablesRows.length; i ++){
                    var tableRowChildren = tablesRows[i].children;
                    var columnIndex = headers.indexOf(columnName);

                    var temp = document.createElement('div');
                    temp.appendChild(tableRowChildren[columnIndex].firstChild);
        
                    var columnTemplate = temp.innerHTML;
    
                    var columnProcessor = new Cs142TemplateProcessor(columnTemplate);
                    var resultColumnTemplate = columnProcessor.fillIn(dict);

                    var newColumnTemplate = document.createTextNode(resultColumnTemplate);
                    tableRowChildren[columnIndex].insertBefore(newColumnTemplate, tableRowChildren[columnIndex].firstChild);
                }
            }
        } else {
            // For all rows except the first, you want to process all children tds
            // So that every entry ends up being processed.
            var tablesRowsAll = document.querySelectorAll(queryStringHeader);
            for (let i = 1; i < tablesRowsAll.length; i ++){
                var tableRowAllChildren = tablesRowsAll[i].children;

                for (let j = 0; j < tableRowAllChildren.length; j ++ ){

                    var temp1 = document.createElement('div');
                    temp1.appendChild(tableRowAllChildren[j].firstChild);
        
                    var allTemplate = temp1.innerHTML;
    
                    var allProcessor = new Cs142TemplateProcessor(allTemplate);
                    var resultAllTemplate = allProcessor.fillIn(dict);
    
                    var newAllTemplate = document.createTextNode(resultAllTemplate);
                    tableRowAllChildren[j].insertBefore(newAllTemplate, tableRowAllChildren[j].firstChild);
                }

            }
        }
        // make all the tables visible
        var queryStringTables = "#" + id;
        var tables = document.querySelectorAll(queryStringTables);
        for (let i = 0; i < tables.length; i++){
            tables[i].style.visibility = 'visible';
        }
    }
}