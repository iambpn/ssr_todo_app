function showToast(type, message) {
  const time = Date.now();
  document.getElementById("toast").innerHTML = `
  <div class="toast align-items-center text-bg-${type} border-0 show" role="alert" aria-live="assertive" aria-atomic="true">
  <div class="d-flex">
    <div class="toast-body">
      ${message}
    </div>
    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
  </div>
</div>
  `;
}

function parseToIsoDate(date) {
  const dateObject = new Date(date ? date : new Date().toString());

  const year = dateObject.getFullYear();
  // Months starts with 0, so need to add 1
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getDate()).padStart(2, "0");
  const hours = String(dateObject.getHours()).padStart(2, "0");
  const minutes = String(dateObject.getMinutes()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
  return formattedDate;
}
