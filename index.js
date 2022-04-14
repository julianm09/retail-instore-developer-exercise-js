const app = document.getElementById("app");
const nav = document.getElementById("nav");
const select = document.getElementById("select");

let selected;

//get all cities and create links
const createLinks = () => {
  fetch("./navigation.json")
    .then((response) => response.json())
    .then((json) => {
      json.cities.map((x) => {
        const link = document.createElement("div");
        link.id = x.section;
        link.classList.add("nav-link");
        link.innerHTML = x.label;
        link.addEventListener("click", (e) => {
          selectLink(e);
        });
        nav.appendChild(link);
      });
    });
};

//on click
const selectLink = (e) => {
  select.style.left = `${e.target.offsetLeft}px`;
  select.style.width = `${e.target.offsetWidth}px`;
  selected = e.target;
  console.log(selected);
};

createLinks();
