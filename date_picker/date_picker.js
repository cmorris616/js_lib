var date_picker = function (params) {

    var current_date;
    var current_month;
    var previous_month = -1;
    var current_year;
    var previous_year = -1;
    var selected_day_cell;

    var MONTH_ARRAY = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    DAYS_IN_MONTH_ARRAY = [
        31,
        28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31
    ];

    DAYS_ARRAY = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];

    var week_row_array = [];
    var day_cell_array = [];

    var calendar = document.createElement("table");
    var header_row = document.createElement("tr");
    var days_row = document.createElement("tr")
    var previous_cell = document.createElement("td");
    var next_cell = document.createElement("td");
    var header_cell = document.createElement("td");

    header_cell.colSpan = 5;
    header_cell.className = "date_picker_header";
    previous_cell.className = "date_picker_nav_buttons";
    next_cell.className = "date_picker_nav_buttons";

    previous_cell.onclick = previousMonth;
    next_cell.onclick = nextMonth;

    calendar.className = "date_picker";

    previous_cell.innerHTML = "&laquo;";
    next_cell.innerHTML = "&raquo;";

    header_row.appendChild(previous_cell);
    header_row.appendChild(header_cell);
    header_row.appendChild(next_cell);
    calendar.appendChild(header_row);

    var day_cell;

    for (var i = 0; i < DAYS_ARRAY.length; i++) {
        day_cell = document.createElement("td");
        day_cell.innerText = DAYS_ARRAY[i].substring(0, 3);
        day_cell.className = "date_picker_day_header";
        days_row.appendChild(day_cell);
    }

    calendar.appendChild(days_row);

    addWeeks();
    setDate(new Date());

    document.getElementsByTagName("body")[0].appendChild(calendar);

    function addWeeks() {
        for (var week = 0; week < 7; week++) {
            var week_row = document.createElement("tr");
            var day_cell;

            for (var i = 0; i < 7; i++) {
                day_cell = document.createElement("td");
                day_cell.className = "date_picker_day_cell";
                week_row.appendChild(day_cell);
                day_cell_array.push(day_cell);
            }

            calendar.appendChild(week_row);
            week_row_array.push(week_row);
        }
    }

    function getDate() {
        return current_date;
    }

    function getDaysInMonth(month) {
        var days_in_month = DAYS_IN_MONTH_ARRAY[month];

        if(month == 1 && isLeapYear(current_year)) {
            days_in_month = 29;
        }

        return days_in_month;
    }

    function isLeapYear(year) {
        return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
    }

    function nextMonth() {
        var month = current_date.getMonth();
        var day_of_month = current_date.getDate();
        
        if(month == 11) {
            month = 0
        } else {
            month += 1
        }
        
        var days_in_month = getDaysInMonth(month)

        if (days_in_month < day_of_month) {
            current_date.setDate(days_in_month);
        }

        current_date.setMonth(current_date.getMonth() + 1);
        setDate(current_date);
    }

    function populate_days() {
        var first_day = (new Date(current_year, current_month, current_date.getDate(), 0, 0, 0)).getDay();
        week_index = 0;
        day_number = 1;

        days_in_month = getDaysInMonth(current_month);

        if(current_month == 1 && isLeapYear(current_year)) {
            days_in_month = 29;
        }

        for (day_cell_index = 0; day_cell_index < day_cell_array.length; day_cell_index++) {
            if (week_index == 0 && day_cell_index < first_day) {
                day_cell_array[day_cell_index].innerText = "";
                day_cell_array[day_cell_index].className = "date_picker_day_cell_inactive";
                day_cell_array[day_cell_index].onclick = null;
                continue;
            }

            if (day_number > days_in_month) {
                day_cell_array[day_cell_index].innerText = "";
                day_cell_array[day_cell_index].className = "date_picker_day_cell_inactive";
                day_cell_array[day_cell_index].onclick = null;
            } else {
                day_cell_array[day_cell_index].innerText = day_number;

                if (day_number == current_date.getDate()) {
                    day_cell_array[day_cell_index].className = "date_picker_day_cell_selected";
                    selected_day_cell = day_cell_array[day_cell_index];
                    day_cell_array[day_cell_index].onclick = selectDay;
                } else {
                    day_cell_array[day_cell_index].className = "date_picker_day_cell";
                    day_cell_array[day_cell_index].onclick = selectDay;
                }
            }

            if ((day_cell_index + 1) % 7 == 0 && day_number < days_in_month) {
                week_index++;
                week_row_array[week_index].style.display = "table-row";
            }

            day_number++;
        }

        for (var i = ++week_index; i < week_row_array.length; i++) {
            week_row_array[i].style.display = "none";
        }
    }

    function previousMonth() {
        var month = current_date.getMonth();
        var day_of_month = current_date.getDate();

        if(month == 0) {
            month = 11;
        } else {
            month -= 1;
        }

        var days_in_month = DAYS_IN_MONTH_ARRAY[month];

        if (days_in_month < day_of_month) {
            current_date.setDate(days_in_month);
        }

        current_date.setMonth(current_date.getMonth() - 1);
        setDate(current_date);
    }

    function selectDay(event) {
        current_date.setDate(event.currentTarget.innerText);
        setDate(current_date);
        selected_day_cell.className = "date_picker_day_cell"
        selected_day_cell = event.currentTarget;
        selected_day_cell.className = "date_picker_day_cell_selected";
    }

    function setDate(newDate) {
        current_date = newDate;
        current_date.setSeconds(0);
        current_date.setMilliseconds(0);
        current_month = current_date.getMonth();
        current_year = current_date.getFullYear();

        if (previous_month != current_month ||
            previous_year != current_year) {

            previous_month = current_month;
            previous_year = current_year;

            header_cell.innerText = MONTH_ARRAY[current_month] + " - " + current_year;

            populate_days();
        }
    }

    return {
        getDate: getDate,
        setDate: setDate
    }
}