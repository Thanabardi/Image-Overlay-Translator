var select
document.onmouseover = function (event) {
  var element = event.target;

  if (select != element) {
    if (select != null) {
      select.classList.remove("hovered");
    }

    select = element;
    element.classList.add("hovered");
  }
};
document.addEventListener("click", (event) => {
  console.log(event.target);
});
