const path = require("path");
const osu = require("node-os-utils");
const cpu = osu.cpu;
const mem = osu.mem;
const os = osu.os;

let cpuOverload = 80;
let alertFrequency = 5;

const cpuUsage = document.getElementById("cpu-usage");
const cpuFree = document.getElementById("cpu-free");
const sysUptime = document.getElementById("sys-uptime");
const progressBar = document.getElementById("cpu-progress");

// Show Loading... before CPU usage is listed - init progress bar at 0
cpuUsage.innerText = "Loading...";
cpuFree.innerText = "Loading...";
progressBar.style.width = 0 + "%";

// Check CPU usage every 2 seconds
setInterval(() => {
  // CPU usage
  cpu.usage().then((info) => {
    cpuUsage.innerText = info.toFixed(2) + "%";

    progressBar.style.width = info + "%";

    // Make progress bar red if overload
    if (info >= cpuOverload) {
      progressBar.style.background = "red";
    } else {
      progressBar.style.background = "#30c88b";
    }

    //  Check overload
    if (info >= cpuOverload && runNotify(alertFrequency)) {
      notifyUser({
        title: "SysTop Detected a CPU Overload",
        body: `CPU is over ${cpuOverload}%`,
        icon: path.join(__dirname, "img", "icon.png"),
      });

      localStorage.setItem("lastNotify", +new Date());
    }
  });
  // CPU free
  cpu.free().then((info) => {
    cpuFree.innerText = info.toFixed(2) + "%";
  });
}, 2000);

// Check system uptime every second
setInterval(() => {
  sysUptime.innerText = secondsToDhms(os.uptime());
}, 1000);

// Check if Windows/Mac/Linux
const getOsType = (osType) => {
  let type;
  if (osType[0] === "w") {
    type = "Windows";
  } else if (osType[0] === "d") {
    type = "Mac";
  } else {
    type = "Linux";
  }
  return type;
};

// Set model
document.getElementById("cpu-model").innerText = cpu.model();

// Computer Name
document.getElementById("comp-name").innerText = os.hostname();

// OS
document.getElementById("os").innerText = `${getOsType(
  os.platform()
)} ${os.arch()}`;

// Total Mem
mem.info().then((info) => {
  document.getElementById("mem-total").innerText = info.totalMemMb;
});

// Show days, hours, mins, sec
function secondsToDhms(seconds) {
  seconds = +seconds;
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d, ${h}h, ${m}m, ${s}s`;
}

// Send notification
function notifyUser(options) {
  new Notification(options.title, options);
}

// Check how much time has passed since notification
function runNotify(frequency) {
  if (localStorage.getItem("lastNotify") === null) {
    // Store timestamp
    localStorage.setItem("lastNotify", +new Date());
    return true;
  }
  const notifyTime = new Date(parseInt(localStorage.getItem("lastNotify")));
  const now = new Date();
  const diffTime = Math.abs(now - notifyTime);
  const minutesPassed = Math.ceil(diffTime / (1000 * 60));

  if (minutesPassed > frequency) {
    return true;
  } else {
    return false;
  }
}
