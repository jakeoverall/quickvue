import swal from "sweetalert2";

export async function $confirm(title = "Are you sure?", text = "You won't be able to revert this!") {
  try {
    let config = {
      title,
      text,
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, do it!",
      cancelButtonText: "No, cancel!",
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
    document.appendChild(monitorElem);

    window.addEventListener('online', () => {
      monitorElem.classList.add("connected");
      monitorElem.innerText = "Connection Established";
      onConnect(monitorElem);
    });
    window.addEventListener('offline', () => {
      monitorElem.classList.remove("connected");
      monitorElem.classList.add("disconnected");
      monitorElem.innerText = "Connection Lost";
      onDisconnect(monitorElem);
    });
  } catch (e) {

  }
}