import {create_alert, remove_alert, show_alert} from "./utils";
import {fetchFlights} from "./fetch_flight";

interface Request {
    crew_id: string;
    flight_id: string;
}

class Proxy {
    requests: Array<Request> = [];

    last_red_buttons: Array<Request> = [];

    busy: boolean = false;

    add_request(data: Request) {
        this.requests.push(data);
    }

    check_if_not_busy() {
        if (this.busy) {
            show_alert("alert-warning", "Aktualnie wykonywana jest synchronizacja, spróbuj później", 2000);
            return false;
        }
        return true;
    }

    hide_red_buttons() {
        $.each(this.last_red_buttons, function (index, element) {
            document.getElementById(element["id"]).removeAttribute("style");
        });
    }
}

export let proxy = new Proxy();

export function synchronize() {
    if (!proxy.check_if_not_busy())
        return;
    proxy.busy = true;
    let id_alert = create_alert('alert-warning', 'Synchronizuje. Wszystkie operacje są zabronione');
    proxy.hide_red_buttons()
    $.ajax({
        type: 'GET',
        url: '/synchronize_service/',
        dataType: 'json',
        data: {requests: proxy.requests},
        success: function (data) {
            if (data.busy == 'busy') {
                show_alert("alert-warning", "Aktualnie wykonywana jest synchronizacja, spróbuj później", 2000);
            } else if (data.length > 0) {
                show_alert('alert-danger', 'Synchronizacja nie powidła się. ' +
                    'Przyczyną mogą być zmiany w danych na serwerze i/lub próba przypisania załogi do 2 różnych lotów odbywających się w tym samym czasie. ' +
                    'Zaznaczono loty powodujące problem.', 10000);

                $.each(data, function (index, element) {
                    document.getElementById(element["id"]).style.backgroundColor = 'red';
                });
                proxy.last_red_buttons = data.slice();
            } else {
                show_alert('alert-success', 'Synchronizaja przeprowadzona pomyślnie!', 2000);
                proxy.requests = [];
                fetchFlights();
            }
            remove_alert(id_alert);
            proxy.busy = false;
        },
        error: function () {
            remove_alert(id_alert);
            show_alert('alert-danger',"Błąd połączenia z serwerem",2000);
            proxy.busy = false;
        }

    });
}

window.synchronize = synchronize;

