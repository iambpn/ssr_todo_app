function validateLength(elementId, minLength, errMessage) {
  const element = document.getElementById(elementId);
  if (element.value.trim().length < minLength) {
    element.classList.add("is-invalid");
    element.nextElementSibling.textContent = errMessage ?? `Must contain at least ${minLength} character.`;
    return false;
  } else {
    element.classList.remove("is-invalid");
    element.nextElementSibling.textContent = "";
    return true;
  }
}

function validateEmpty(elementId, errMessage) {
  const element = document.getElementById(elementId);
  if (!element.value.trim()) {
    element.classList.add("is-invalid");
    element.nextElementSibling.textContent = errMessage ?? `This is required`;
    return false;
  } else {
    element.classList.remove("is-invalid");
    element.nextElementSibling.textContent = "";
    return true;
  }
}
