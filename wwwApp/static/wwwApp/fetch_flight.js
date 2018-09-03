"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.date = undefined;
function fetchFlights() {
    var config = {
        type: 'GET',
        url: '/flights_service/',
        dataType: 'json',
        success: function (data) {
            var flight_table_body = document.getElementById("flight_table_body");
            flight_table_body.innerHTML = '';
            $.each(data, function (index, element) {
                var node = jQuery.parseHTML("<tr id=\"flight\" class=\"clickable-row\" onclick=\"select_flight(this)\">" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "</tr>");
                var properties = ["starting_airport_name", "starting_time_formatted", "destination_airport_name",
                    "destination_time_formatted", "crew_name"];
                for (var i = 0; i < properties.length; i++) {
                    node[0].childNodes[i].appendChild(document.createTextNode(element[properties[i]]));
                }
                node[0].setAttribute("id", element.id);
                flight_table_body.appendChild(node[0]);
            });
        }
    };
    var s;
    if (exports.date != undefined)
        config.data = { date: exports.date };
    $.ajax(config);
}
exports.fetchFlights = fetchFlights;
function setDate(date_new) {
    exports.date = date_new;
}
exports.setDate = setDate;
