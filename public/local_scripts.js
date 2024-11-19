const player = document.querySelector(".control");
export function PlayerOverflowHandling() {
    console.log("hello")
    if (player.style.position < 0) {
        console.log("felul van")
    }
    if (player.style.position > 100) {
        console.log("alul van");
        
    }
};

export function add(a, b) {
    return a + b;
  }