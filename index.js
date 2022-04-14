const app = document.getElementById("app");
const nav = document.getElementById("nav");
const indicator = document.getElementById("indicator");
const clock = document.getElementById("clock");

//starting state
let selected;

window.onload = () => {
    createLinks();
}

//get all cities and create links
const createLinks = async () => {
  await fetch("./navigation.json")
    .then((response) => response.json())
    .then((json) => {
      json.cities.map((x, i) => {
        //create navigation links with id of city and class of nav-link
        const link = document.createElement("div");
        link.id = x.section;
        link.classList.add("nav-link");
        link.innerHTML = x.label;
        link.addEventListener("click", (e) => selectLink(e));
        link.addEventListener("mouseenter", (e) => handleMouseEnter(e));
        link.addEventListener("mouseout", (e) => handleMouseOut(e));
        nav.appendChild(link);

        //initialize styling for selected link
        if (i == 0) {
          selected = document.getElementById(x.section);
          selected.style.color = "black";
          indicator.style.left = `${selected.offsetLeft}px`;
          indicator.style.width = `${selected.offsetWidth}px`;
          getLocation();
          setInterval(updateClock, 1000);
        }
      });
    });
};

//on click
const selectLink = (e) => {
  //move indicator on click
  indicator.style.left = `${e.target.offsetLeft}px`;
  indicator.style.width = `${e.target.offsetWidth}px`;
  selected = e.target;
  document
    .querySelectorAll(".nav-link")
    .forEach((x) => (x.style.color = "#8D8D8D"));
  e.target.style.color = "black";

  getLocation();
  setInterval(updateClock, 1000);
};

//on mouse enter
const handleMouseEnter = (e) => {
  if (selected == null || selected.id !== e.target.id) {
    e.target.style.color = "#3071AA";
  }
};

//on mouse out
const handleMouseOut = (e) => {
  if (selected.id == e.target.id) {
    e.target.style.color = "black";
  } else {
    e.target.style.color = "#8D8D8D";
  }
};

window.addEventListener("resize", () => {
  indicator.style.left = `${selected.offsetLeft}px`;
  indicator.style.width = `${selected.offsetWidth}px`;
});



let timeZone;

const getLocation = async () => {
  await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${selected.id}&key=AIzaSyBou40yZkrRqVImOAMfhmu-NkPX4sV1jBk`
  )
    .then((response) => response.json())
    .then((json) => {
      const location = json.results[0].geometry.location;
      getTime(location);
    });
};

const getTime = async (location) => {
  await fetch(
    `https://maps.googleapis.com/maps/api/timezone/json?location=${location.lat}%2C${location.lng}&timestamp=1331161200&key=AIzaSyBou40yZkrRqVImOAMfhmu-NkPX4sV1jBk`
  )
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      timeZone = json.timeZoneId;
    });
};

function updateClock() {
  let time = new Date().toLocaleTimeString("en-US", {
    timeZone: timeZone,
    timestyle: "full",
    hourCycle: "h24",
  });
  clock.innerHTML = time;
}

