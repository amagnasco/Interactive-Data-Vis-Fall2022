console.log('testing that the console works');

// identify the buttons & counters on the page
const poofButton = document.getElementById('poofButton');
const oopsButton = document.getElementById('oopsButton');
const poofCounter = document.getElementById('poofCounter');
const oopsCounter = document.getElementById('oopsCounter');

// generate the cloud
const cloud = document.getElementById('cloud');
cloud.hidden = true;

// create initial values for the counters
let poofCount = 0;
let oopsCount = 0;

// populate the counters
poofCounter.innerText = poofCount;
oopsCounter.innerText = oopsCount;

// update counters on click
function Poof() {
    // increments counters
    ++poofCount;
    ++oopsCount;
    // update html
    poofCounter.innerText = poofCount;
    oopsCounter.innerText = oopsCount;

    cloud.hidden = false;
    // vanishes after 2 seconds
    setTimeout(()=>{
        cloud.hidden = true;
    }, 2000);
};
function Oops() {
    oopsCount = 0;
    oopsCounter.innerText = oopsCount;
};