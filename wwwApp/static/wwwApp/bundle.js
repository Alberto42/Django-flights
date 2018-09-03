(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
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

},{}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var utils_1 = require("./utils");
var fetch_flight_1 = require("./fetch_flight");
var Proxy = /** @class */ (function () {
    function Proxy() {
        this.requests = [];
        this.last_red_buttons = [];
        this.busy = false;
    }
    Proxy.prototype.add_request = function (data) {
        this.requests.push(data);
    };
    Proxy.prototype.check_if_not_busy = function () {
        if (this.busy) {
            utils_1.show_alert("alert-warning", "Aktualnie wykonywana jest synchronizacja, spróbuj później", 2000);
            return false;
        }
        return true;
    };
    Proxy.prototype.hide_red_buttons = function () {
        $.each(this.last_red_buttons, function (index, element) {
            document.getElementById(element["id"]).removeAttribute("style");
        });
    };
    return Proxy;
}());
exports.proxy = new Proxy();
function synchronize() {
    if (!exports.proxy.check_if_not_busy())
        return;
    exports.proxy.busy = true;
    var id_alert = utils_1.create_alert('alert-warning', 'Synchronizuje. Wszystkie operacje są zabronione');
    exports.proxy.hide_red_buttons();
    $.ajax({
        type: 'GET',
        url: '/synchronize_service/',
        dataType: 'json',
        data: { requests: exports.proxy.requests },
        success: function (data) {
            if (data.busy == 'busy') {
                utils_1.show_alert("alert-warning", "Aktualnie wykonywana jest synchronizacja, spróbuj później", 2000);
            }
            else if (data.length > 0) {
                utils_1.show_alert('alert-danger', 'Synchronizacja nie powidła się. ' +
                    'Przyczyną mogą być zmiany w danych na serwerze i/lub próba przypisania załogi do 2 różnych lotów odbywających się w tym samym czasie. ' +
                    'Zaznaczono loty powodujące problem.', 10000);
                $.each(data, function (index, element) {
                    document.getElementById(element["id"]).style.backgroundColor = 'red';
                });
                exports.proxy.last_red_buttons = data.slice();
            }
            else {
                utils_1.show_alert('alert-success', 'Synchronizaja przeprowadzona pomyślnie!', 2000);
                exports.proxy.requests = [];
                fetch_flight_1.fetchFlights();
            }
            utils_1.remove_alert(id_alert);
            exports.proxy.busy = false;
        },
        error: function () {
            utils_1.remove_alert(id_alert);
            utils_1.show_alert('alert-danger', "Błąd połączenia z serwerem", 2000);
            exports.proxy.busy = false;
        }
    });
}
exports.synchronize = synchronize;
window.synchronize = synchronize;

},{"./fetch_flight":1,"./utils":4}],3:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var proxy_1 = require("./proxy");
var utils_1 = require("./utils");
var fetch_flight_1 = require("./fetch_flight");
var selected_flight = undefined, selected_crew = undefined;
function add_relation() {
    if (!proxy_1.proxy.check_if_not_busy())
        return;
    proxy_1.proxy.hide_red_buttons();
    selected_flight.removeAttribute("style");
    selected_crew.removeAttribute("style");
    proxy_1.proxy.add_request({
        crew_id: selected_crew.getAttribute("id"),
        flight_id: selected_flight.getAttribute("id")
    });
    utils_1.set_crew(selected_crew, selected_flight);
    utils_1.show_alert("alert-info", "Dodano lokalnie załogę do lotu. Kliknij \"synchronizuj\" aby zsynchronizować zmiany z serwerem.", 2000);
    selected_flight = undefined;
    selected_crew = undefined;
    change_buttons_status();
}
exports.add_relation = add_relation;
window.add_relation = add_relation;
function remove_crew() {
    if (!proxy_1.proxy.check_if_not_busy())
        return;
    proxy_1.proxy.hide_red_buttons();
    selected_flight.removeAttribute("style");
    document.getElementById("remove_crew").setAttribute("disabled", "");
    proxy_1.proxy.add_request({
        crew_id: "remove",
        flight_id: selected_flight.getAttribute("id")
    });
    utils_1.show_alert("alert-info", "Usunięto lokalnie przypisanie załogi do lotu. Kliknij \"synchronizuj\" aby zsynchronizować zmiany z serwerem.", 2000);
    utils_1.unset_crew(selected_flight);
    selected_flight = undefined;
    change_buttons_status();
}
exports.remove_crew = remove_crew;
window.remove_crew = remove_crew;
function change_buttons_status() {
    if (selected_flight != undefined) {
        document.getElementById("remove_crew").removeAttribute("disabled");
    }
    else {
        document.getElementById("remove_crew").setAttribute("disabled", "true");
    }
    if (selected_flight != undefined && selected_crew != undefined) {
        document.getElementById("add_relation").removeAttribute("disabled");
    }
    else {
        document.getElementById("add_relation").setAttribute("disabled", "true");
    }
}
function select_flight(node) {
    if (selected_flight == node) {
        selected_flight.removeAttribute("style");
        selected_flight = undefined;
        change_buttons_status();
        return;
    }
    if (selected_flight != undefined) {
        selected_flight.removeAttribute("style");
    }
    selected_flight = node;
    node.style.backgroundColor = "darkgrey";
    change_buttons_status();
}
exports.select_flight = select_flight;
window.select_flight = select_flight;
function select_crew(node) {
    if (selected_crew == node) {
        selected_crew.removeAttribute("style");
        selected_crew = undefined;
        change_buttons_status();
        return;
    }
    if (selected_crew != undefined) {
        selected_crew.removeAttribute("style");
    }
    selected_crew = node;
    node.style.backgroundColor = "darkgrey";
    change_buttons_status();
}
exports.select_crew = select_crew;
window.select_crew = select_crew;
$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: '/crews_service/',
        dataType: 'json',
        success: function (data) {
            $.each(data, function (index, element) {
                var node = $.parseHTML("<tr id=\"crew\" class=\"clickable-row\" onclick=\"select_crew(this)\">" +
                    "<td></td>" +
                    "</tr>");
                var captain = document.createTextNode(element.captain_name + " " + element.captain_surname);
                node[0].firstChild.appendChild(captain);
                node[0].setAttribute("id", element.id);
                document.getElementById("crew_table_body").appendChild(node[0]);
            });
        }
    });
    $(function () {
        var $j = jQuery.noConflict();
        var datapicker = $j("#datepicker");
        datapicker.datepicker({
            onSelect: function (dateText) {
                fetch_flight_1.setDate(dateText);
                fetch_flight_1.fetchFlights();
            },
            dateFormat: "yy-mm-dd"
        });
    });
});

},{"./fetch_flight":1,"./proxy":2,"./utils":4}],4:[function(require,module,exports){
"use strict";
exports.__esModule = true;
function set_crew(selected_crew, selected_flight) {
    var crew = selected_flight.childNodes[4];
    var captain_name = selected_crew.childNodes[0].innerText;
    var textnode = document.createTextNode(captain_name);
    crew.innerText = captain_name;
}
exports.set_crew = set_crew;
function unset_crew(selected_flight) {
    var crew = selected_flight.childNodes[4];
    crew.innerText = '';
}
exports.unset_crew = unset_crew;
function remove_alert(id) {
    var alertDiv = document.getElementById("alert");
    var alert = document.getElementById(id);
    $("#" + id).slideUp(500);
    alert.removeChild(alert.lastChild);
    alertDiv.removeChild(alert);
}
exports.remove_alert = remove_alert;
function create_alert(type, text) {
    var alertDiv = document.getElementById("alert");
    var alert = document.createElement("div");
    var id = "alert " + next_alert;
    alertDiv.appendChild(alert);
    alert.setAttribute("class", "alert " + type);
    alert.setAttribute("style", "margin-bottom: 0px");
    alert.setAttribute("id", id);
    next_alert++;
    alert.innerHTML = '';
    alert.appendChild(document.createTextNode(text));
    return id;
}
exports.create_alert = create_alert;
var next_alert = 0;
function show_alert(type, text, length) {
    var id = create_alert(type, text);
    $("#" + id).show(); // use slide down for animation
    setTimeout(function () {
        remove_alert(id);
    }, length);
}
exports.show_alert = show_alert;

},{}]},{},[3,2,4,1]);
