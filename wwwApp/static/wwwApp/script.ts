import {proxy} from "./proxy";
import {set_crew, show_alert, unset_crew} from "./utils";
import {fetchFlights, setDate} from "./fetch_flight";
import * as fetch_flights from "./fetch_flight";

var selected_flight : HTMLElement = undefined, selected_crew : HTMLElement = undefined;

export function add_relation() {
    if (!proxy.check_if_not_busy())
        return;
    proxy.hide_red_buttons()
    selected_flight.removeAttribute("style");
    selected_crew.removeAttribute("style");

    proxy.add_request({
        crew_id: selected_crew.getAttribute("id"),
        flight_id: selected_flight.getAttribute("id")
    });

    set_crew(selected_crew,selected_flight);
    show_alert("alert-info","Dodano lokalnie załogę do lotu. Kliknij \"synchronizuj\" aby zsynchronizować zmiany z serwerem.",2000);

    selected_flight = undefined;
    selected_crew = undefined;
    change_buttons_status();
}
window.add_relation = add_relation;

export function remove_crew() {
    if (!proxy.check_if_not_busy())
        return;
    proxy.hide_red_buttons()
    selected_flight.removeAttribute("style");
    document.getElementById("remove_crew").setAttribute("disabled", "");
    proxy.add_request({
        crew_id: "remove",
        flight_id: selected_flight.getAttribute("id")
    });
    show_alert("alert-info","Usunięto lokalnie przypisanie załogi do lotu. Kliknij \"synchronizuj\" aby zsynchronizować zmiany z serwerem.",2000);
    unset_crew(selected_flight);
    selected_flight = undefined;
    change_buttons_status();
}
window.remove_crew = remove_crew;

function change_buttons_status() {
    if (selected_flight != undefined) {
        document.getElementById("remove_crew").removeAttribute("disabled");
    } else {
        document.getElementById("remove_crew").setAttribute("disabled","true")
    }
    if (selected_flight != undefined && selected_crew != undefined) {
        document.getElementById("add_relation").removeAttribute("disabled");
    } else {
        document.getElementById("add_relation").setAttribute("disabled","true")
    }
}

export function select_flight(node : HTMLElement) {
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
window.select_flight = select_flight;

export function select_crew(node : HTMLElement) {
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
window.select_crew = select_crew;

$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: '/crews_service/',
        dataType: 'json',
        success: function (data) {
            $.each(data, function (index, element) {
                var node : any = $.parseHTML(
                    "<tr id=\"crew\" class=\"clickable-row\" onclick=\"select_crew(this)\">" +
                    "<td></td>" +
                    "</tr>"
                );
                var captain : Text = document.createTextNode(element.captain_name + " " + element.captain_surname);
                node[0].firstChild.appendChild(captain);
                node[0].setAttribute("id", element.id);
                document.getElementById("crew_table_body").appendChild(node[0]);
            });
        }
    });
    $(function () {
        var $j = jQuery.noConflict();
        let datapicker : any = $j("#datepicker")
        datapicker.datepicker({
            onSelect: function (dateText : any) {
                setDate(dateText);
                fetchFlights()
            },
            dateFormat: "yy-mm-dd"
        });
    });
});
