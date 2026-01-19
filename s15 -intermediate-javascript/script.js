const readline = require("readline");

const guestList = ["Angela", "Jack", "Pam", "James", "Lara", "Jason"];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("What is your name? ", (name) => {
  if (guestList.includes(name)) {
    console.log("Welcome!");
  } else {
    console.log("Sorry, maybe next time.");
  }
  rl.close();
});
