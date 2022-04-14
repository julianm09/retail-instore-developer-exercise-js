const app = document.getElementById("app");
const nav = document.getElementById("nav");
const indicator = document.getElementById("indicator");
const clock = document.getElementById("clock");

//starting states
let selected;
let timeZone;

// create navigation on load
window.onload = () => {
  createLinks();
};

//handle resize
window.addEventListener("resize", () => {
    moveIndicator(selected);
});

//get all cities and create links
const createLinks = async () => {
  await fetch("./navigation.json")
    .then((response) => response.json())
    .then((json) => {
      json.cities.map((x, i) => {
        //create navigation links with id of city and class of nav-link
        const link = document.createElement("a");
        link.id = x.section;
        link.classList.add("nav-link");
        link.innerHTML = x.label;
        link.addEventListener("click", (e) => handleSelectLink(e));
        link.addEventListener("mouseenter", (e) => handleMouseEnter(e));
        link.addEventListener("mouseout", (e) => handleMouseOut(e));
        nav.appendChild(link);

        //initialize styling for selected link
        if (i == 0) {
          selected = document.getElementById(x.section);
          selected.style.color = "black";
          moveIndicator(selected);
          getLocation();
        }
      });
    });
};

//moveIndicator
const moveIndicator = (e) => {
  indicator.style.left = `${e.offsetLeft}px`;
  indicator.style.width = `${e.offsetWidth}px`;
};

//on link click
const handleSelectLink = (e) => {
  //move indicator on click
  moveIndicator(e.target);
  selected = e.target;

  //reset color to grey
  document
    .querySelectorAll(".nav-link")
    .forEach((x) => (x.style.color = "#8D8D8D"));
  e.target.style.color = "black";

  //get location and time
  getLocation();
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
      timeZone = json.timeZoneId;
      setInterval(updateClock, 1000);
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
