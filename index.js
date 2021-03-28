#!/usr/bin/env node

const fs = require("fs");

const usage = `Usage :-
$ ./todo add "todo item"  # Add a new todo
$ ./todo ls               # Show remaining todos
$ ./todo del NUMBER       # Delete a todo
$ ./todo done NUMBER      # Complete a todo
$ ./todo help             # Show usage
$ ./todo report           # Statistics
`;

const currDir = process.cwd();
const todoFile = currDir + "/todo.txt";
const doneFile = currDir + "/done.txt";
const command = process.argv[2];
const argString = process.argv[3];

// Converting each line of a file into an array of elements
const fileLineToArray = (file) => {
  try {
    const tempArray = fs
      .readFileSync(file, "utf-8")
      .split("\n")
      .filter((el) => el !== "");
    if (tempArray.length === 0) return false;
    // Reversing it since we need recently added line(todo item) first
    return tempArray.reverse();
  } catch {
    // File does not exist
    return false;
  }
};

switch (command) {
  case "help":
    console.log(usage);
    break;

  case "add":
    if (argString) {
      fs.open(todoFile, "a", function (err, f) {
        if (err) {
          console.log(err);
        } else {
          fs.appendFile(todoFile, argString + "\n", () => {
            console.log(`Added todo: "${argString}"`);
          });
        }
      });
    } else {
      console.log("Error: Missing todo string. Nothing added!");
    }
    break;

  case "ls":
    const todoFileArray = fileLineToArray(todoFile);
    if (todoFileArray) {
      todoFileArray.forEach((item, idx) => {
        console.log(`[${todoFileArray.length - idx}] ${item}`);
      });
    } else {
      console.log("There are no pending todos!");
    }
    break;

  case "del":
    if (argString) {
      const todoIdx = parseInt(argString);
      const todoFileArray = fileLineToArray(todoFile);
      if (todoFileArray) {
        if (todoIdx <= 0 || todoIdx - 1 >= todoFileArray.length) {
          console.log(
            `Error: todo #${todoIdx} does not exist. Nothing deleted.`
          );
        } else {
          let newtodoFileArray = [...todoFileArray].reverse();
          newtodoFileArray.splice(todoIdx - 1, 1);
          let newData = newtodoFileArray.map((item) => item + "\n").join("");
          fs.writeFile(todoFile, newData, () => {
            console.log(`Deleted todo #${todoIdx}`);
          });
        }
      } else {
        console.log(`Error: todo #${todoIdx} does not exist. Nothing deleted.`);
      }
    } else {
      console.log("Error: Missing NUMBER for deleting todo.");
    }
    break;

  case "done":
    if (argString) {
      const todoNum = parseInt(argString);
      const todoDataArray = fileLineToArray(todoFile);
      if (todoDataArray) {
        if (0 >= todoNum || todoNum - 1 >= todoDataArray.length) {
          console.log(`Error: todo #${todoNum} does not exist.`);
        } else {
          const newTodoDataArray = [...todoDataArray.reverse()];
          let date = new Date().toISOString().slice(0, 10);
          newTodoDataArray.splice(todoNum - 1, 1);
          let newData = newTodoDataArray.map((item) => item + "\n").join("");
          fs.writeFile(todoFile, newData, () => {
            todoString = `x ${date} ${todoDataArray[todoNum - 1]}\n`;
            fs.open(doneFile, "a", function (err, f) {
              if (err) {
                console.log(err);
              } else {
                fs.appendFile(doneFile, todoString, () => {
                  console.log(`Marked todo #${todoNum} as done.`);
                });
              }
            });
          });
        }
      } else {
        console.log(`Error: todo #${todoNum} does not exist.`);
      }
    } else {
      console.log("Error: Missing NUMBER for marking todo as done.");
    }
    break;

  case "report":
    let date = new Date().toISOString().slice(0, 10);
    let [pendingTasks, completedTasks] = [
      fileLineToArray(todoFile),
      fileLineToArray(doneFile),
    ];
    let noPendingTasks = pendingTasks ? pendingTasks.length : 0;
    let noCompletedTasks = completedTasks ? completedTasks.length : 0;
    console.log(
      `${date} Pending : ${noPendingTasks} Completed : ${noCompletedTasks}`
    );
    break;

  default:
    console.log(usage);
    break;
}
