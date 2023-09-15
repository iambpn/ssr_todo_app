const data = document.getElementsByClassName("todo-completed-toggle");
Array.from(data).forEach((ele) => {
  ele.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      const id = ele.dataset["id"];
      const res = await fetch("/toggleUpdate", {
        method: "put",
        body: JSON.stringify({
          id,
        }),
        headers: {
          "content-type": "application/json",
        },
      });
      const json = await res.json();

      if (!res.ok) {
        return showToast("danger", json.error);
      }

      ele.checked = !ele.checked;
    } catch (error) {
      console.log(error);
      showToast("danger", error.message);
    }
  });
});
