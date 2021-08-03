import * as SortAlgorithms from "./sorting.js";
import { create as createSortItem } from "./sortItem.js";

function resetWindowState(timerMessage) {
    // todo find a way to cancel a sort function if one is already running
    itemArray = [];
    removeChildren(field);
    setSortButtonsState(true);
    updateTimerMessage(timerMessage);
}

function updateTimerMessage(message) {
    let messageSpan = document.getElementById("timerMessage");
    messageSpan.innerHTML = message;
}

function removeChildren(element) {
    while(element.firstChild) {
        element.removeChild(element.lastChild);
    }
}

function generateItemArray(arraySize) {
    resetWindowState(defaultTimerMessage);
    let itemWidth = field.clientWidth / arraySize;
    let itemHeightModifier = getItemHeightModifier();
    let values = Array.from({length: arraySize}, () => Math.floor(Math.random() * maxItemValue) + 1);

    for (let i = 0; i < arraySize; i++) {
        let sortItem = createSortItem(i, itemWidth, values[i] * itemHeightModifier, values[i]);
        field.appendChild(sortItem);
    }

    return Array.from(document.querySelectorAll(".sortItem"));
}

function getItemHeightModifier() {
    // todo figure this thing out

    // let fh = field.clientHeight;
    // let temp = fh / maxItemValue;
    // let res = Math.floor(temp) - 1;

    // return Math.floor(field.height / maxItemValue) - 1;

    return 10;
}

function getArraySize() {
    let arraySize = document.getElementById("arrSize").value;
    let size = parseInt(arraySize);
    if (size >= 2 && size <= maxArraySize){
        return size;
    }

    alert(`Please enter a number between 2 and ${maxArraySize}`);
}

function setSortButtonsState(enable) {
    let buttons = document.querySelectorAll(".sortButton");
    for (let button of buttons) {
        button.disabled = !enable;
    }
}

function formatElapsedTimeForDisplay(milliseconds) {
    let minutes = Math.floor(milliseconds / 60000);
    let seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    if (seconds === 60) {
        minutes++;
        seconds = 0;
    }
    
    let ms = milliseconds % 1000;
    return `${formatToTwoDigits(minutes)}:${formatToTwoDigits(seconds)}.${ms}`;
}

function formatToTwoDigits(time) {
    return time < 10 ?
    "0" + time : time;
}

function getSuccessMessage(elapsedTime) {
    let time = formatElapsedTimeForDisplay(elapsedTime);
    return `Sorted ${itemArray.length} numbers in ${time}!`;
}

async function runSorting(sortFunction, sortName) {
    setSortButtonsState(false);
    updateTimerMessage(`Sorting using ${sortName}...`);

    let startTime = Date.now();
    await sortFunction(itemArray);
    let endTime = Date.now();
    
    let message = getSuccessMessage(endTime - startTime);
    updateTimerMessage(message);
    
    setSortButtonsState(true);
}

const fieldHeight = 500;
const fieldWidthModifier = 0.75;
const defaultArraySize = 50;
const maxArraySize = 200;
const maxItemValue = 50;
const defaultTimerMessage = "Choose a sorting algorithm to begin";

var itemArray;
var field;

window.onload = function() {
    field = document.getElementById("animationField");
    field.setAttribute("width", `${window.innerWidth * fieldWidthModifier}px`);
    field.setAttribute("height", `${fieldHeight}px`);

    itemArray = generateItemArray(defaultArraySize);
    document.getElementById("arrayGenerator").onclick = function() {
        let arraySize = getArraySize();
        itemArray = generateItemArray(arraySize);
    };

    document.getElementById("bubblesort").onclick = function () {
        runSorting(SortAlgorithms.bubbleSort, "Bubble Sort");
    };
    document.getElementById("insertionsort").onclick = function () {
        runSorting(SortAlgorithms.insertionSort, "Insertion Sort");
    };
    document.getElementById("selectionsort").onclick = function () {
        runSorting(SortAlgorithms.selectionSort, "Selection Sort");
    };
    document.getElementById("heapsort").onclick = function () {
        runSorting(SortAlgorithms.heapSort, "Heapsort");
    };
    document.getElementById("quicksort").onclick = function () {
        runSorting(SortAlgorithms.quickSort, "Quick Sort");
    };
}
