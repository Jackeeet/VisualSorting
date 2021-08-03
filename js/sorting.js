import * as SortItem from "./sortItem.js";

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
                    SortItem.setPairColour(item1, item2, SortItem.defaultColour, addRecolorDelay);
                    resolve();
                }, SortItem.delayMilliseconds);
            }); 
    }); 
}

export async function bubbleSort(itemArray) {
    for (let i = 0; i < itemArray.length; i++) {
        for (let j = 0; j < itemArray.length - i - 1; j++) {
            let [item1, item2] = await SortItem.selectPairByIndex(itemArray, j, j + 1);

            if (SortItem.getValue(item1) > SortItem.getValue(item2)) {
                await swap(itemArray, j, j + 1);
            }

            if (item1.style.backgroundColor !== SortItem.defaultColour) {
                SortItem.setPairColour(item1, item2, SortItem.defaultColour);
                await SortItem.setPairColour(item1, item2, SortItem.defaultColour, false);
            }
        }
    }
}

export async function insertionSort(itemArray) {
    for (let i = 1; i < itemArray.length; i++) {
        for (let current = i; current > 0; current--) {
            let [currentItem, previousItem] = await SortItem.selectPairByIndex(itemArray, current, current - 1);

            if (SortItem.getValue(currentItem) >= SortItem.getValue(previousItem)) {
                await SortItem.setPairColour(currentItem, previousItem, SortItem.defaultColour, false);
                break;
            }

            await swap(itemArray, current, current - 1);
        }
    }
}

export async function selectionSort(itemArray) {
    for (let current = 0; current < itemArray.length - 1; current++) {
        let minIndex = current;
        let minItem, nextItem, currentItem;

        for (let next = current + 1; next < itemArray.length; next++) {
            [minItem, nextItem] = await SortItem.selectPairByIndex(itemArray, minIndex, next);

            if (SortItem.getValue(nextItem) < SortItem.getValue(minItem)) {
                minIndex = next;
            }
            await SortItem.setPairColour(minItem, nextItem, SortItem.defaultColour, false);
        }

        [currentItem, minItem] = await SortItem.selectPairByIndex(itemArray, current, minIndex);
        await swap(itemArray, minIndex, current, true);
    }
}

async function sinkElement(itemArray, index, arraySize) {
    let current = index;
    let placed = false;
    let maxChild = 2 * current + 1;

    while (!placed && maxChild < arraySize) {
        if (maxChild < arraySize - 1 && SortItem.getValue(itemArray[maxChild]) < SortItem.getValue(itemArray[maxChild + 1])) {
            maxChild++;
        } 

        let [currentItem, maxItem] = await SortItem.selectPairByIndex(itemArray, current, maxChild);
        if (SortItem.getValue(currentItem) < SortItem.getValue(maxItem)) {
            await swap(itemArray, current, maxChild, false);
        }
        else {
            placed = true;
            SortItem.setPairColour(currentItem, maxItem, SortItem.defaultColour);
        }

        current = maxChild;
        maxChild = 2 * current + 1;
    }
}

export async function heapSort(itemArray) {
    let count = itemArray.length;

    for (let i = Math.floor((count - 1) / 2); i > -1; i--) {
        await sinkElement(itemArray, i, count);        
    }

    while (count > 0) {
        let [maxItem, lastItem] = await SortItem.selectPairByIndex(itemArray, 0, count - 1);
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

    let [pivotItem, endItem] = await SortItem.selectPairByIndex(itemArray, pivot, end);
    await swap(itemArray, pivot, end, false);
    pivotItem.style.backgroundColor = SortItem.markerColour;

    let [leftItem, leftIndex] = SortItem.selectNext(itemArray, start - 1);

    for (let current = start; current < end; current++) {
        let currentItem = itemArray[current];
        currentItem.style.backgroundColor = SortItem.selectedColour;

        if (SortItem.getValue(currentItem) < SortItem.getValue(pivotItem)) {
            await swap(itemArray, current, leftIndex, false);
            [leftItem, leftIndex] = SortItem.selectNext(itemArray, leftIndex);
        }

        if (leftItem !== currentItem) {
            currentItem.style.backgroundColor = SortItem.defaultColour;
        }
    }

    await swap(itemArray, leftIndex, end, false);   
    return leftIndex;
}

export async function quickSort(itemArray, start = 0, end = itemArray.length - 1) {
    if (start >= end) {
        return;
    }

    let pivot = await partition(itemArray, start, end);
    await quickSort(itemArray, start, pivot - 1);
    await quickSort(itemArray, pivot + 1, end);
}