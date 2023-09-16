export function parseToIsoDate(dateStr?: string) {
  const dateObject = new Date(dateStr ?? new Date().toString());

  const year = dateObject.getFullYear();
  // Months starts with 0, so need to add 1
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getDate()).padStart(2, "0");
  const hours = String(dateObject.getHours()).padStart(2, "0");
  const minutes = String(dateObject.getMinutes()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
  return formattedDate;
}

export function parseToReadableDate(dateStr?: string) {
  return new Date(dateStr ?? new Date().toString()).toString().split(" GMT").at(0);
}
