const app = document.getElementById("app");

const createButtons = () => {
  fetch("./navigation.json")
    .then((response) => response.json())
    .then((json) => {
      json.cities.map((x) => {
        const link = document.createElement("div");
        link.id = x.section;
        link.classList.add("nav-link");
        link.innerHTML = x.label;
        link.addEventListener("click", (e) => {
          getSelection(e);
        });
        app.appendChild(link);
      });
    });
};

const getSelection = (e) => {
  console.log(e.target);
};

createButtons();
