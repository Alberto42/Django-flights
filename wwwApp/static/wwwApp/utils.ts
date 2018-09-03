
export function set_crew(selected_crew: any, selected_flight: any) {
    var crew = selected_flight.childNodes[4];
    var captain_name = selected_crew.childNodes[0].innerText;
    var textnode = document.createTextNode(captain_name);
    crew.innerText = captain_name;
}
export function unset_crew(selected_flight: any) {
    var crew = selected_flight.childNodes[4];
    crew.innerText = '';
}

export function remove_alert(id : string) {
    let alertDiv = document.getElementById("alert");
    let alert = document.getElementById(id);
    $("#" + id).slideUp(500);
    alert.removeChild(alert.lastChild);
    alertDiv.removeChild(alert);
}

export function create_alert(type : string,text : string) {
    let alertDiv = document.getElementById("alert");
    let alert = document.createElement("div");
    let id = "alert " + next_alert;
    alertDiv.appendChild(alert);
    alert.setAttribute("class", "alert " + type);
    alert.setAttribute("style","margin-bottom: 0px");
    alert.setAttribute("id",id);
    next_alert++;
    alert.innerHTML = ''
    alert.appendChild(document.createTextNode(text));
    return id;
}

let next_alert : number = 0;
export function show_alert(type : string, text : string, length : number) {
    let id = create_alert(type,text);

    $("#" + id).show(); // use slide down for animation
      setTimeout(function () {
          remove_alert(id);
      }, length);
}