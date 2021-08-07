import * as SortAlgorithms from "./sorting.js";
import * as FT from "./functionTimer.js";
import { create as createSortItem } from "./sortItem.js";

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

    return 9.5;
}

function getArraySize() {
    let arraySize = document.getElementById("arrSize").value;
    let size = parseInt(arraySize);
    if (size >= 2 && size <= maxArraySize){
        return size;
    }

    alert(`Please enter a number between 2 and ${maxArraySize}.`);
}

function setButtonsState(enable) {
    let generatorButton = document.getElementById("arrayGenerator");
    generatorButton.disabled = !enable;

    let sortButtons = document.querySelectorAll(".sortButton");
    for (let button of sortButtons) {
        button.disabled = !enable;
    }
}

function resetWindowState(timerMessage) {
    itemArray = [];
    removeChildren(field);
    setButtonsState(true);
    timer.reset();
    updateTimerMessage(timerMessage);
}

async function runSorting(sortFunction, sortName) {
    setButtonsState(false);
    updateTimerMessage(`Sorting using ${sortName}...`);

    let timer = new FT.FunctionTimer(() => sortFunction(itemArray));
    await timer.run();

    let message = `Sorted ${itemArray.length} numbers in ${timer.formatElapsedTime()}!`;
    updateTimerMessage(message);

    setButtonsState(true);
}

const fieldHeight = 500;
const fieldWidthModifier = 0.75;
const defaultArraySize = 50;
const maxArraySize = 200;
const maxItemValue = 50;
const defaultTimerMessage = document.getElementById("timerMessage").innerHTML;

var itemArray;
var field;
var timer = new FT.FunctionTimer();

window.onload = function() {
    field = document.getElementById("animationField");
    field.setAttribute("width", `${window.innerWidth * fieldWidthModifier}px`);
    field.setAttribute("height", `${fieldHeight}px`);

    itemArray = generateItemArray(defaultArraySize);
    document.getElementById("arrayGenerator").onclick = function() {
        let arraySize = getArraySize();
        if (!arraySize) {
            return;
        }

        resetWindowState(defaultTimerMessage);
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
