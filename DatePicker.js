"use strict";
class DatePicker {
    constructor(id, callback){
        this.id = id;
        this.callback = callback;
    }

    render(date){
        // Variable Declarations
        var monthNames = ["January","February","March","April","May","June","July","August","September","October","November", "December"];
        var dayNames = ["S", "M", "T", "W", "Th", "F", "S"];

        // Different query strings for different parts of DOM
        var datePickerID = this.id;
        var queryStringDisplay = "#" + datePickerID + " .month";
        var queryStringContainer = "#" + datePickerID + " .grid-container";
        var queryStringItems = "#" + datePickerID + " .grid-item";

        var month = date.getMonth(); // universal time 0-11
        var year = date.getYear();
        var day = date.getDay();

        // function for returning the number of days in the month for a given year
        function daysInMonth (month, year) {
            return new Date(year, month, 0).getDate();
        }

        // function for adding click event listeners for all the days in the grid,
        // calling the callback function upon event.
        var addDayListeners = function (){
            var inMonthDays = document.querySelectorAll(queryStringItems);
            for (let i =  0; i < inMonthDays.length; i++){
                if (!inMonthDays[i].classList.contains('notInMonth')){
                    inMonthDays[i].addEventListener('click', function(){
                        inMonthDays[i].classList.toggle('selected');
                        var fixedDate = {month: inMonthDays[i].month, day: inMonthDays[i].day, year: inMonthDays[i].year};
                        this.callback(this.id, fixedDate);
                    }.bind(this));
                }
            }
        }.bind(this);

        // function for generating the calendar days, of both last, this, and next
        // month to fit in the calendar page 
        function generateCalendarDays(grid, day, month, year){
            var numDays = daysInMonth(month + 1, year);
            var numDaysLastMonth = daysInMonth(month, year);

            var daysBefore = day;
            var daysBeforeArray = [];

            // for days of previous month
            for (let i = numDaysLastMonth; i > (numDaysLastMonth - daysBefore); i--){
                var lastMonthDay = document.createElement("div"); 
                lastMonthDay.className = 'grid-item';
                lastMonthDay.classList.add('notInMonth');
                lastMonthDay.innerHTML = i;
                daysBeforeArray.push(lastMonthDay);
            }
            while(daysBeforeArray.length > 0) {
                var daysBeforeNum = daysBeforeArray.pop();
                grid.appendChild(daysBeforeNum);
            }
            // for days current month
            var dayOfWeekPlaceholder = (day + (numDays % 7)) % 7;
            var lastDayOfMonth; 
            for (let i = 1; i < numDays + 1; i++){
                var dayElem = document.createElement("div"); 
                dayElem.className = 'grid-item';
                var dateObj = new Date(year, month, i);
                dayElem.day = i;
                dayElem.month = month + 1;
                dayElem.year = year + 1900;
                dayElem.innerHTML = dayElem.day;
                grid.appendChild(dayElem);
            }
            // for days of next month
            if (dayOfWeekPlaceholder !== 0){
                let startVal = 1;
                while (dayOfWeekPlaceholder < 7){
                    var nextMonthDay = document.createElement("div"); 
                    nextMonthDay.className = 'grid-item';
                    nextMonthDay.classList.add('notInMonth');
                    nextMonthDay.innerHTML = startVal;
                    grid.appendChild(nextMonthDay);
                    startVal++;
                    dayOfWeekPlaceholder++;
                }
            }
        }
        // Start creating, assigning classes to, and adding the HTML elements
        var element = document.getElementById(this.id);
        element.className = ('datepicker');

        // The grid container for the calendar dates
        var grid = document.createElement("div");
        grid.className = 'grid-container';

        // The previous navigation button
        var prev = document.createElement("grid-item");
        prev.innerHTML = "<";
        prev.className = 'prev';
        prev.id = this.id + ' prev';

        // The month display
        var nameOfMonth = document.createElement("grid-item");
        nameOfMonth.appendChild(document.createTextNode(monthNames[month]));
        nameOfMonth.className = 'month';

        // The next navigation button
        var next = document.createElement("grid-item");
        next.innerHTML = ">";
        next.className = 'next';
        next.id = this.id + ' next';

        element.appendChild(grid);
        grid.appendChild(prev);
        grid.appendChild(nameOfMonth);
        grid.appendChild(next);

        // Create and add the days of the week 
        for (let i = 0; i < dayNames.length; i++){
            var dayName = document.createElement("div"); 
            dayName.className = 'grid-item';
            dayName.classList.add('dayOfWeek');
            dayName.innerHTML = dayNames[i];
            grid.appendChild(dayName);
        }
        // generate days of week for calendar initially
        generateCalendarDays(grid, day, month, year);
        
        var prevButton = document.getElementById(this.id + " prev");
        var nextButton = document.getElementById(this.id + " next");

        // Add click event listener to previous button
        prevButton.addEventListener("click", function(){
            var monthDisplay = document.querySelector(queryStringDisplay);
            var month = monthNames.indexOf(monthDisplay.innerHTML);

            // Condition for allowing you to go back
            if (month - 1 >= 0){
                month = month - 1;

                // Change the month display to display previous month
                var prevMonth = document.createTextNode(monthNames[month]);
                monthDisplay.insertBefore(prevMonth, monthDisplay.lastChild);
                monthDisplay.removeChild(monthDisplay.lastChild);

                var gridContainer = document.querySelector(queryStringContainer);
                var gridItems = document.querySelectorAll(queryStringItems);

                // If the grid items are calendar days and not the days of week 
                // i.e. M, T, W, Th... then remove because 
                // we are going to populate with the new months days and
                // add those listeners.
                for (let i =  0; i < gridItems.length; i++){
                    if (!gridItems[i].classList.contains('dayOfWeek')){
                        gridContainer.removeChild(gridItems[i]);
                    }
                }

                var lastMonthStartDate = new Date(year, month, 1).getDay();
                generateCalendarDays(grid, lastMonthStartDate, month, year);
                addDayListeners();
            }
        });

        // Add click event listener to next button
        nextButton.addEventListener("click", function(){
            var monthDisplay = document.querySelector(queryStringDisplay);
            var month = monthNames.indexOf(monthDisplay.innerHTML);

            // Condition for allowing you to go forward
            if (month + 1 <= 11){
                month = month + 1;

                // Change the month display to display next month
                var nextMonth = document.createTextNode(monthNames[month]);
                monthDisplay.insertBefore(nextMonth, monthDisplay.lastChild);
                monthDisplay.removeChild(monthDisplay.lastChild);
                
                var gridContainer = document.querySelector(queryStringContainer);
                var gridItems = document.querySelectorAll(queryStringItems);

                // same as previous button's
                for (let i =  0; i < gridItems.length; i++){
                    if (!gridItems[i].classList.contains('dayOfWeek')){
                        gridContainer.removeChild(gridItems[i]);
                    }
                }

                var nextMonthStartDate = new Date(year, month, 1).getDay();
                generateCalendarDays(grid, nextMonthStartDate, month, year);
                addDayListeners();
            }

        });

        // Add event listeners for selecting a date in current month 
        // and returning the callback function.
        addDayListeners();

    }

}

