// ------- SORTING ALGORITHMS -------

function swap(arr, index1, index2) {
    return new Promise(resolve => {
        let item1 = arr[index1];
        let item2 = arr[index2];

        let tf1 = getComputedStyle(item1).getPropertyValue("transform");
        let tf2 = getComputedStyle(item2).getPropertyValue("transform");

        item1.style.transform = tf2;
        item2.style.transform = tf1;

        requestAnimationFrame(
            function() {
                setTimeout(() => {
                    [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
                    resolve();
                }, delayMilliseconds);
            }); 
    }); 
}

async function bubbleSort(itemArray) {
    for (let i = 0; i < itemArray.length; i++) {
        for (let j = 0; j < itemArray.length - i - 1; j++) {
            let item1 = itemArray[j];
            let item2 = itemArray[j + 1]; 

            await setItemPairColour(item1, item2, selectedItemColour);
            if (getValue(item1) > getValue(item2)) {
                await swap(itemArray, j, j + 1);
            }
            await setItemPairColour(item1, item2, defaultItemColour, false);
        }
    }
}

async function insertionSort(itemArray) {
    for (let i = 1; i < itemArray.length; i++) {
        for (let j = i; j > 0; j--) {
            let item1 = itemArray[j];
            let item2 = itemArray[j - 1];

            await setItemPairColour(item1, item2, selectedItemColour);
            if (getValue(item1) >= getValue(item2)) {
                await setItemPairColour(item1, item2, defaultItemColour, false);
                break;
            }
            await swap(itemArray, j, j - 1);
            await setItemPairColour(item1, item2, defaultItemColour, false);
        }
    }
}

// ye this doesn't work 
async function shellSort(itemArray) {
    for (let gap = ~~(itemArray.length / 2); gap > 0; gap = ~~(gap / 2)) {
        for (let i = gap, j; i < itemArray.length; i++) {

            let temp = itemArray[i];
            temp.style.backgroundColor = markerItemColour;

            for (j = i; j >= gap; j -= gap) {
                let item1 = itemArray[j];
                let item2 = itemArray[j - gap];
                
                await setItemPairColour(item1, item2, selectedItemColour);
                if (getValue(item2) > getValue(temp)) {
                    // itemArray[j] = itemArray[j - gap];
                    await swap(item1, item2);
                }

                await setItemPairColour(item1, item2, defaultItemColour, false);
            }
            await swap(temp, itemArray[j]);
            temp.style.backgroundColor = defaultItemColour;
            // itemArray[j] = temp;
        }
    }
}

async function selectionSort(itemArray) {
    for (let i = 0; i < itemArray.length - 1; i++) {
        let minValueIndex = i;
        let minItem, nextItem;

        for (let j = i + 1; j < itemArray.length; j++) {
            minItem = itemArray[minValueIndex];
            nextItem = itemArray[j];

            await setItemPairColour(minItem, nextItem, selectedItemColour);

            if (getValue(nextItem) < getValue(minItem)) {
                minValueIndex = j;
            }
            await setItemPairColour(minItem, nextItem, defaultItemColour, false);
        }
        
        let currentItem = itemArray[i];
        await setItemPairColour(minItem, currentItem, selectedItemColour);

        await swap(itemArray, minValueIndex, i);
        await setItemPairColour(minItem, currentItem, defaultItemColour);
    }
}

async function heapSort(itemArray) {
}

async function quickSort(itemArray) {
}
// -------------


// ------- SORT ITEM LOGIC -------

async function setItemPairColour(item1, item2, colour, addDelay = true) {
    item1.style.backgroundColor = colour;
    item2.style.backgroundColor = colour;
    if (addDelay) {
        await new Promise(resolve => setTimeout(() => { resolve(); }, delayMilliseconds));
    }
}

function createSortItem(index, width, height, value) {
    let item = document.createElement("div");
    item.style.width = `${width}px`
    item.style.height = `${height}px`;
    item.style.transform = `translateX(${index * width}px)`;
    item.classList.add("sortItem");

    let label = createValueLabel(value);
    item.appendChild(label);
    return item;
}

function createValueLabel(value) {
    let label = document.createElement("div");
    label.innerHTML = value;
    label.classList.add("sortItemLabel");
    return label;
}   

function getValue(sortItem) {
    return parseInt(sortItem.childNodes[0].innerHTML);
}
// -------------


// ------- TIMER LOGIC -------
// -------------


// ------- WINDOW UTILITY FUNCTIONS -------

function resetWindowState() {
    removeChildren(field);
    disableSortButtons(false);
    updateTimerMessage("", true);
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
}

function getItemHeightModifier() {
    // let fh = field.clientHeight;
    // let temp = fh / maxItemValue;
    // let res = Math.floor(temp) - 1;

    // return Math.floor(field.height / maxItemValue) - 1;

    return 10;
}

function getArraySize() {
    let arraySize = document.getElementById("arrSize").value;
    let size = parseInt(arraySize);
    if (size >= 2 && size <= 50){
        return size;
    }
    alert("Please enter a number between 2 and 50");
}

function updateTimerMessage(sortName, resetting = false) {
    let messageSpan = document.getElementById("timerMessage");
    messageSpan.innerHTML = resetting ? 
    "Choose a sorting algorithm to begin" : `Sorting using ${sortName}:`;

    // todo figure out what to put instead of 00:00
    let timerSpan = document.getElementById("timer");
    timerSpan.innerHTML = resetting ? "" : "00:00"
}

function disableSortButtons(disable) {
    let buttons = document.querySelectorAll(".sortButton");
    for (let button of buttons) {
        button.disabled = disable;
    }
}

function runSorting(sortFunction, sortName) {
    disableSortButtons(true);
    updateTimerMessage(sortName);

    let itemArray = Array.from(document.querySelectorAll(".sortItem"));
    sortFunction(itemArray);
}
// -------------


// ------- SCRIPT EXECUTION -------

const fieldHeight = 500;
const fieldWidthModifier = 0.75;
const defaultArraySize = 20;
const maxItemValue = 50;
const defaultItemColour = "#384EC7";
const selectedItemColour = "#38C7B1";
const markerItemColour = "#FFFFFF";
const delayMilliseconds = 500;

var field;
var seconds;

window.onload = function() {
    field = document.getElementById("animationField");
    field.setAttribute("width", `${window.innerWidth * fieldWidthModifier}px`);
    field.setAttribute("height", `${fieldHeight}px`);

    generateItemArray(defaultArraySize);
    document.getElementById("arrayGenerator").onclick = function() {
        let arraySize = getArraySize();
        generateItemArray(arraySize);
    };

    document.getElementById("bubblesort").onclick = function () {
        runSorting(bubbleSort, "Bubble Sort");
    };
    document.getElementById("insertionsort").onclick = function () {
        runSorting(insertionSort, "Insertion Sort");
    };
    document.getElementById("shellsort").onclick = function () {
        runSorting(shellSort, "Shell Sort");
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
