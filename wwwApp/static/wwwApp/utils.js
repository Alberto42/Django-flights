"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
