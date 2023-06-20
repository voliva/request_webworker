console.log("worker init!");

self.addEventListener("message", () => {
  console.log("worker received message");

  self.postMessage("I'm alive!");
});
