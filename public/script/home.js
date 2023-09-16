const completedTodos = document.getElementsByClassName("todo-completed-toggle");

const deleteTodosBtn = document.getElementsByClassName("remove-todo-btn");

Array.from(completedTodos).forEach((ele) => {
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
      window.location.reload()
    } catch (error) {
      console.log(error);
      showToast("danger", error.message);
    }
  });
});

Array.from(deleteTodosBtn).forEach((ele) => {
  ele.addEventListener("click", async () => {
    try {
      const id = ele.dataset["id"];
      const res = await fetch(`/delete/${id}`, {
        method: "delete",
      });
      const json = await res.json();

      if (!res.ok) {
        return showToast("danger", json.error);
      }

      window.location.reload()
    } catch (error) {
      console.log(error);
      showToast("danger", error.message);
    }
  });
});

