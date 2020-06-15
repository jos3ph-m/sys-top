const path = require("path");
const osu = require("node-os-utils");
const cpu = osu.cpu;
const mem = osu.mem;
const os = osu.os;

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
