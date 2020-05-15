import swal from "sweetalert2";

export async function $confirm(title = "Are you sure?", text = "You won't be able to revert this!") {
  try {
    let config = {
      title,
      text,
      showCancelButton: true,
      confirmButtonText: "Yes, do it!",
      cancelButtonText: "No, cancel!",
      focusCancel: true,
      reverseButtons: true
    };
    let result = await swal.fire(config);
    return result.value;
  } catch (e) {
    return false;
  }
}

export function $connectionMonitor(
  onConnect = (elem) => { },
  onDisconnect = (elem) => { }
) {
  try {
    let monitorElem = document.createElement("div");
    monitorElem.className = "connection-monitor initialized";
    document.body.appendChild(monitorElem);

    window.ononline = () => {
      monitorElem.classList.add("connected");
      monitorElem.innerText = "Connection Established";
      onConnect(monitorElem);
    };
    window.onoffline = () => {
      monitorElem.classList.remove("connected");
      monitorElem.classList.add("disconnected");
      monitorElem.innerText = "Connection Lost";
      onDisconnect(monitorElem);
    };
  } catch (e) {
    console.error("SOMETHING FAILED IN $connectionMonitor", e);
  }
}
