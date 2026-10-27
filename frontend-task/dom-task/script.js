const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const message = document.getElementById("message");
const taskCount = document.getElementById("taskCount");

function updateTaskCount() {
    taskCount.textContent = taskList.children.length;
}

function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        message.textContent = "Please enter a task!";
        taskInput.focus();
        return;
    }

    const listItem = document.createElement("li");
    const taskName = document.createElement("span");
    const completeButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    taskName.textContent = taskText;

    completeButton.textContent = "Complete";
    deleteButton.textContent = "Delete";

    completeButton.addEventListener("click", function () {
        listItem.classList.toggle("completed");

        if (listItem.classList.contains("completed")) {
            completeButton.textContent = "Undo";
        } else {
            completeButton.textContent = "Complete";
        }
    });

    deleteButton.addEventListener("click", function () {
        listItem.remove();
        updateTaskCount();

        if (taskList.children.length === 0) {
            message.textContent = "No tasks yet. Add your first task!";
        }
    });

    listItem.append(taskName, completeButton, deleteButton);
    taskList.appendChild(listItem);

    message.textContent = "";
    taskInput.value = "";

    updateTaskCount();
    taskInput.focus();
}

addButton.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});
