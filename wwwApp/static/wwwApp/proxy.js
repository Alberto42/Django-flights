"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
