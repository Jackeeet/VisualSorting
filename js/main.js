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
    let itemWidth = field.offsetWidth / arraySize;
    let itemHeightModifier = getItemHeightModifier();
    let values = Array.from({length: arraySize}, () => Math.floor(Math.random() * maxItemValue) + 1);

    for (let i = 0; i < arraySize; i++) {
        let sortItem = createSortItem(i, itemWidth, values[i] * itemHeightModifier, values[i]);
        field.appendChild(sortItem);
    }

    return Array.from(document.querySelectorAll(".sortItem"));
}

function getItemHeightModifier() {
    return Math.floor(field.clientHeight / maxItemValue);    
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

function getFieldHeight() {
    let maxHeight = document.body.offsetHeight;
    let infoBlockHeight = document.getElementById("info").offsetHeight;
    return maxHeight - infoBlockHeight;
}

const fieldWidthModifier = 0.75;
const defaultArraySize = 50;
const maxArraySize = 200;
const maxItemValue = 200;
const defaultTimerMessage = document.getElementById("timerMessage").innerHTML;

var itemArray;
var field;
var timer = new FT.FunctionTimer();

window.onload = function() {
    field = document.getElementById("animationField");
    let fieldHeight = getFieldHeight();
    document.getElementById("info").style.bottom = `${fieldHeight}px`;
    field.style.height = `${fieldHeight}px`;
    field.style.width = `${document.body.offsetWidth}px`;

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
