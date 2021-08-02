// ------- SORTING -------

function swapTransforms(item1, item2) {
    let transform1 = getComputedStyle(item1).getPropertyValue("transform");
    let transform2 = getComputedStyle(item2).getPropertyValue("transform");
    item1.style.transform = transform2;
    item2.style.transform = transform1;
}

function swap(arr, index1, index2, addRecolorDelay = false) {
    return new Promise(resolve => {
        let item1 = arr[index1];
        let item2 = arr[index2];
        swapTransforms(item1, item2);

        requestAnimationFrame(
            function() {
                setTimeout(() => {
                    [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
                    setItemPairColour(item1, item2, defaultItemColour, addRecolorDelay);
                    resolve();
                }, delayMilliseconds);
            }); 
    }); 
}

async function bubbleSort(itemArray) {
    for (let i = 0; i < itemArray.length; i++) {
        for (let j = 0; j < itemArray.length - i - 1; j++) {
            [item1, item2] = await selectItemsByIndex(itemArray, j, j + 1);

            if (getValue(item1) > getValue(item2)) {
                await swap(itemArray, j, j + 1);
            }

            if (item1.style.backgroundColor !== defaultItemColour) {
                await setItemPairColour(item1, item2, defaultItemColour, false);
            }
        }
    }
}

async function insertionSort(itemArray) {
    for (let i = 1; i < itemArray.length; i++) {
        for (let current = i; current > 0; current--) {
            [currentItem, previousItem] = await selectItemsByIndex(itemArray, current, current - 1);

            if (getValue(currentItem) >= getValue(previousItem)) {
                await setItemPairColour(currentItem, previousItem, defaultItemColour, false);
                break;
            }

            await swap(itemArray, current, current - 1);
        }
    }
}

async function selectionSort(itemArray) {
    for (let current = 0; current < itemArray.length - 1; current++) {
        let minIndex = current;
        let minItem, nextItem;

        for (let next = current + 1; next < itemArray.length; next++) {
            [minItem, nextItem] = await selectItemsByIndex(itemArray, minIndex, next);

            if (getValue(nextItem) < getValue(minItem)) {
                minIndex = next;
            }
            await setItemPairColour(minItem, nextItem, defaultItemColour, false);
        }

        [currentItem, minItem] = await selectItemsByIndex(itemArray, current, minIndex);
        await swap(itemArray, minIndex, current, true);
    }
}

async function sinkElement(itemArray, index, arraySize) {
    let current = index;
    let placed = false;
    let maxChild = 2 * current + 1;

    while (!placed && maxChild < arraySize) {
        if (maxChild < arraySize - 1 && getValue(itemArray[maxChild]) < getValue(itemArray[maxChild + 1])) {
            maxChild++;
        } 

        [currentItem, maxItem] = await selectItemsByIndex(itemArray, current, maxChild);

        if (getValue(currentItem) < getValue(maxItem)) {
            await swap(itemArray, current, maxChild, false);
        }
        else {
            placed = true;
            setItemPairColour(currentItem, maxItem, defaultItemColour);
        }

        current = maxChild;
        maxChild = 2 * current + 1;
    }
}

async function heapSort(itemArray) {
    let count = itemArray.length;

    for (let i = Math.floor((count - 1) / 2); i > -1; i--) {
        await sinkElement(itemArray, i, count);        
    }

    while (count > 0) {
        [maxItem, lastItem] = await selectItemsByIndex(itemArray, 0, count - 1);
        await swap(itemArray, 0, count - 1, false);
        count--;
        await sinkElement(itemArray, 0, count);
    }
}

function pickPivotIndex(start, end) {
    let min = start;
    let max = end + 1;
    return Math.floor(Math.random() * (max - min) + min); 
}

async function partition(itemArray, start, end) {
    let pivot = pickPivotIndex(start, end);
    
    [pivotItem, endItem] = await selectItemsByIndex(itemArray, pivot, end);
    await swap(itemArray, pivot, end, false);
    pivotItem.style.backgroundColor = markerItemColour;

    [leftItem, leftIndex] = selectNextItem(itemArray, start - 1);

    for (let current = start; current < end; current++) {
        let currentItem = itemArray[current];
        currentItem.style.backgroundColor = selectedItemColour;
        
        if (getValue(currentItem) < getValue(pivotItem)) {
            await swap(itemArray, current, leftIndex, false);
            [leftItem, leftIndex] = selectNextItem(itemArray, leftIndex);
        }

        if (leftItem !== currentItem) {
            currentItem.style.backgroundColor = defaultItemColour;
        }
    }

    await swap(itemArray, leftIndex, end, false);   
    return leftIndex;
}

async function quickSort(itemArray, start = 0, end = itemArray.length - 1) {
    if (start >= end) {
        return;
    }

    pivot = await partition(itemArray, start, end);
    await quickSort(itemArray, start, pivot - 1);
    await quickSort(itemArray, pivot + 1, end);
}
// -------------


// ------- SORT ITEM LOGIC -------

async function selectItemsByIndex(arr, index1, index2) {
    let item1 = arr[index1];
    let item2 = arr[index2];
    await setItemPairColour(item1, item2, selectedItemColour);
    return [item1, item2];
}

function selectNextItem(arr, index) {
    let nextIndex = index + 1;
    let nextItem = arr[nextIndex];
    nextItem.style.backgroundColor = selectedItemColour;
    return [nextItem, nextIndex];
}

async function setItemPairColour(item1, item2, colour, addDelay = true) {
    item1.style.backgroundColor = colour;
    item2.style.backgroundColor = colour;
    if (addDelay) {
        await new Promise(resolve => setTimeout(() => { resolve(); }, delayMilliseconds));
    }
}

function createSortItem(index, width, height, value) {
    let item = document.createElement("div");
    item.style.width = `${width}px`;
    item.style.height = `${height}px`;
    item.style.transform = `translateX(${index * width}px)`;
    item.style.transition = `transform ${delayMilliseconds}ms`;
    item.classList.add("sortItem");

    let label = createValueLabel(value, width);
    item.appendChild(label);
    return item;
}

function createValueLabel(value, width) {
    let label = document.createElement("div");
    label.innerHTML = value;
    label.classList.add("sortItemLabel");
    if (width <= minWidthForLabel) {
        label.style.visibility = "hidden";
    }

    return label;
}   

function getValue(sortItem) {
    return parseInt(sortItem.childNodes[0].innerHTML);
}
// -------------


// ------- WINDOW UTILITY FUNCTIONS -------

function resetWindowState() {
    // todo find a way to cancel a sort function if one is already running
    itemArray = [];
    removeChildren(field);
    setSortButtonsState(true);
    updateTimerMessage(defaultTimerMessage);
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
    resetWindowState();

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
// -------------


// ------- SCRIPT EXECUTION -------

const fieldHeight = 500;
const fieldWidthModifier = 0.75;
const defaultArraySize = 50;
const maxArraySize = 200;
const maxItemValue = 50;
const minWidthForLabel = 17.5;
const defaultItemColour = "#384EC7";
const selectedItemColour = "#38C7B1";
const markerItemColour = "#FFFFFF";
const delayMilliseconds = 0;
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
        runSorting(bubbleSort, "Bubble Sort");
    };
    document.getElementById("insertionsort").onclick = function () {
        runSorting(insertionSort, "Insertion Sort");
    };
    document.getElementById("selectionsort").onclick = function () {
        runSorting(selectionSort, "Selection Sort");
    };
    document.getElementById("heapsort").onclick = function () {
        runSorting(heapSort, "Heapsort");
    };
    document.getElementById("quicksort").onclick = function () {
        runSorting(quickSort, "Quick Sort");
    };
}
