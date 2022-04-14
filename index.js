const app = document.getElementById("app");
const nav = document.getElementById("nav");
const indicator = document.getElementById("indicator");
const clock = document.getElementById("clock");

const colors = {
  linkColor: "#8d8d8d",
  activeColor: "#000000",
  highlightColor: "#0066CC",
  borderColor: "#dddddd",
};

// create navigation on load
window.onload = () => {
  createLinks();
};

//starting states
let selected;
let timeZone;

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
        link.href = `#${x.section}`;

        //add event listeners
        link.addEventListener("click", (e) => handleSelectLink(e.target));
        link.addEventListener("mouseenter", (e) => handleMouseEnter(e.target));
        link.addEventListener("mouseout", (e) => handleMouseOut(e.target));
        link.addEventListener(
          "keypress",
          (e) => e.key === "Enter" && handleSelectLink(e.target)
        );

        //create link
        nav.appendChild(link);

        //initialize styling for selected link
        if (i == 0) {
          selected = document.getElementById(x.section);
          selected.style.color = colors.activeColor;
          moveIndicator(selected);
          getLocation();
        }
      });
    });
};

//move indicator based on left and width offset
const moveIndicator = (e) => {
  const indicatorStyle = indicator.style;
  indicatorStyle.left = `${e.offsetLeft}px`;
  indicatorStyle.width = `${e.offsetWidth}px`;
};

//move indicator and set selected value on click
const handleSelectLink = (e) => {
  moveIndicator(e);
  selected = e;

  //reset color to grey
  document
    .querySelectorAll(".nav-link")
    .forEach((x) => (x.style.color = colors.linkColor));
  e.style.color = colors.activeColor;

  //get new location and time
  getLocation();
};

//change color on hover
const handleMouseEnter = (e) => {
  if (selected == null || selected.id !== e.id) {
    e.style.color = colors.highlightColor;
  }
};

//change color on hover off
const handleMouseOut = (e) => {
  const indicatorStyle = e.style;
  if (selected.id == e.id) {
    indicatorStyle.color = colors.activeColor;
  } else {
    indicatorStyle.color = colors.linkColor;
  }
};

//get location coordinates based on selected location
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

//get time based on slected location coordinates
const getTime = async (location) => {
  await fetch(
    `https://maps.googleapis.com/maps/api/timezone/json?location=${location.lat}%2C${location.lng}&timestamp=1331161200&key=AIzaSyBou40yZkrRqVImOAMfhmu-NkPX4sV1jBk`
  )
    .then((response) => response.json())
    .then((json) => {
      timeZone = json.timeZoneId;

      //restart clock
      setInterval(updateClock, 1000);
    });
};

//update clock based on selected time zone
function updateClock() {
  let time = new Date().toLocaleTimeString("en-US", {
    timeZone: timeZone,
    timestyle: "full",
    hourCycle: "h24",
  });

  clock.innerHTML = `It is \u00A0 <span class="highlight">${time}</span> \u00A0 in ${selected.innerHTML}`;
}