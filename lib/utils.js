import swal from "sweetalert2";

export async function $confirm(text = "You won't be able to revert this!") {
  try {
    let config = {
      title: "Are you sure?",
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
