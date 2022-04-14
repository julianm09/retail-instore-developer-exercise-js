const app = document.getElementById("app");
const nav = document.getElementById("nav");
const select = document.getElementById("select");

const clock = document.getElementById("clock");

let selected = null;

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
        link.addEventListener("mouseenter", (e) => {
          handleMouseEnter(e);
        });
        link.addEventListener("mouseout", (e) => {
          handleMouseOut(e);
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
  e.target.style.color = "black";
  console.log(selected);
};

//on hover
const handleMouseEnter = (e) => {
  if (selected == null || selected.id !== e.target.id) {
    e.target.style.color = "#3071AA";
  }
};

//on hover
const handleMouseOut = (e) => {
  e.target.style.color = "black";
};

window.addEventListener('resize', () => {
    select.style.left = `${selected.offsetLeft}px`;
    select.style.width = `${selected.offsetWidth}px`;
});



function updateClock() {
    let today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    clock.innerHTML = time
  }
  setInterval(updateClock, 1000);



createLinks();
