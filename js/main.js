import "core-js/stable";
import "regenerator-runtime/runtime";

import * as SortAlgorithms from "./sorting.js";
import * as FT from "./functionTimer.js";
import { create as createSortItem, resizeAll as resizeItems } from "./sortItem.js";

function updateTimerMessage(message) {
    let messageSpan = document.getElementById("timerMessage");
    messageSpan.innerHTML = message;
}

function generateItemArray(arraySize) {
    let values = Array.from(
        { length: arraySize }, 
        () => Math.floor(Math.random() * maxItemValue) + 1);

    for (let i = 0; i < arraySize; i++) {
        let sortItem = createSortItem(i, getItemWidth(arraySize), getItemHeightFactor(), values[i]);
        field.appendChild(sortItem);
    }

    return Array.from(document.querySelectorAll(".sortItem"));
}

function getItemHeightFactor() {
    return Math.floor(field.clientHeight / maxItemValue);    
}

function getItemWidth(arraySize) {
    return window.innerWidth / arraySize;
}

function getArraySize() {
    let arraySize = document.getElementById("arrSize").value;
    let size = parseInt(arraySize);
    if (size >= minArraySize && size <= maxArraySize){
        return size;
    }

    alert(`Please enter a number between ${minArraySize} and ${maxArraySize}.`);
    return false;
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
    clearField();
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

function clearField() {
    while(field.firstChild) {
        field.removeChild(field.lastChild);
    }
}

function getFieldHeight() {
    let infoHeight = document.getElementById("info").offsetHeight;
    return window.innerHeight - infoHeight;
}

function resizeField() {
    field.style.height = `${getFieldHeight()}px`;
    field.style.width = `${window.innerWidth}px`;
    resizeItems(itemArray, getItemWidth(itemArray.length), getItemHeightFactor());
}

const defaultArraySize = 50;
const minArraySize = 2;
const maxArraySize = 200;
const maxItemValue = 200;
const defaultTimerMessage = document.getElementById("timerMessage").innerHTML;
const timer = new FT.FunctionTimer();


let field = document.getElementById("animationField");
field.style.height = `${getFieldHeight()}px`;
field.style.width = `${window.innerWidth}px`;
window.onresize = resizeField;

let itemArray = generateItemArray(defaultArraySize);
document.getElementById("arrayGenerator").onclick = () => {
    let arraySize = getArraySize();
    if (!arraySize) {
        return;
    }

    resetWindowState(defaultTimerMessage);
    itemArray = generateItemArray(arraySize);
};

document.getElementById("bubblesort").onclick = () => 
    runSorting(SortAlgorithms.bubbleSort, "Bubble Sort");
document.getElementById("insertionsort").onclick = () => 
    runSorting(SortAlgorithms.insertionSort, "Insertion Sort");
document.getElementById("selectionsort").onclick = () =>
    runSorting(SortAlgorithms.selectionSort, "Selection Sort");
document.getElementById("heapsort").onclick = () =>
    runSorting(SortAlgorithms.heapSort, "Heapsort");
document.getElementById("quicksort").onclick = () =>
    runSorting(SortAlgorithms.quickSort, "Quick Sort");
