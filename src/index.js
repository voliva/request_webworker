// const worker = new Worker("src/server.worker.js");

const logElement = document.getElementById("log");
const amount = document.getElementById("amount");

function log(message) {
  logElement.innerText = message;
}

let ws = null;

const ECHO_MSG = "SOME DATA";
document.getElementById("btn").addEventListener("click", () => {
  if (ws) {
    ws.close();
  }

  const amountValue = amount.valueAsNumber;

  log("connecting");
  ws = new WebSocket("ws://localhost:8080");
  ws.addEventListener("open", () => {
    log("sending messages");
    for (let i = 0; i < amountValue; i++) {
      ws.send(ECHO_MSG);
    }
  });

  ws.addEventListener("error", (error) => {
    console.error(error);
    log("connection error");
  });

  let received = 0;
  ws.addEventListener("message", (evt) => {
    if (received === 0) {
      log("receiving messages");
    }
    received++;
    if (received === amountValue) {
      loadWebWorker();
      // Workaround: closing the ws connection at this point would fix the issue
      // ws.close();
    }
  });
});

function loadWebWorker() {
  log("spawning worker - If it gets stuck here, the worker won't be loaded.");
  const worker = new Worker("./some.worker.js");
  worker.postMessage("hi!");
  worker.addEventListener("message", (msg) => {
    log("Success!! got message from worker!");
  });
}
