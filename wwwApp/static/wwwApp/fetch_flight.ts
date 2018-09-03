import AjaxSettings = JQuery.AjaxSettings;

export let date: any = undefined;

export function fetchFlights() {
    let config : AjaxSettings<any> = {
        type: 'GET',
        url: '/flights_service/',
        dataType: 'json',
        success: function (data: any) {
            var flight_table_body = document.getElementById("flight_table_body");
            flight_table_body.innerHTML = '';
            $.each(data, function (index, element) {
                let node:any = jQuery.parseHTML(
                    "<tr id=\"flight\" class=\"clickable-row\" onclick=\"select_flight(this)\">" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "</tr>"
                );
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
    let s : string;
    if (date != undefined)
        config.data= {date:date};
    $.ajax(config);
}

export function setDate(date_new : any) {
    date = date_new;
}