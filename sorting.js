function bubbleSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }

    return arr;
}

function shellSort(arr) {
    // there's a bug somewhere in here

    let gap = ~~(arr.length / 2);

    for (let gap = ~~(arr.length / 2); gap > 0; gap = ~~(gap / 2)){
        for (let i = gap; i < arr.length; i++){
            let temp = arr[i];

            var j;
            for (j = i; j >= gap && arr[j] < arr[j-gap]; j -= gap){
                arr[j] = arr[j-gap];
            }
            arr[j] = temp;
        }
    }

    return arr;
}

function mergeSort(arr){
    if (arr.length <= 1){
        return arr;
    }

    let middle = ~~(arr.length / 2);
    let left = arr.slice(0, middle);
    let right = arr.slice(middle, arr.length);

    left = mergeSort(left);
    right = mergeSort(right);

    return merge(left, right);
}

function merge(left, right){
    let l = 0;
    let r = 0;
    let result = [];

    while (l < left.length && r < right.length) {
        if (left[l] <= right[r]) {
            result.push(left[l]);
            l++;
        }
        else {
            result.push(right[r]);
            r++;
        }
    }

    if (l < left.length) {
        result.push(...left.slice(l, left.length));
    }
    else {
        result.push(...right.slice(r, right.length));
    }
    return result;
}

function quickSort(arr){
    // todo
}

class SortItem {
    constructor(value, width, id) {
        this.height = value * 9;
        this.width = width;
        this.id = id;
        this.value = value;
    }

    draw() {
        let itemStartX = this.id * this.width;
        let itemStartY = canvasHeight - this.height;
        context.fillStyle = "powderblue";
        context.fillRect(itemStartX, itemStartY, this.width, this.height);

        let valStartX = itemStartX + this.width / 2;
        let valStartY = 12;
        context.font = "12px serif";
        context.fillStyle = "black";
        context.fillText(this.value, valStartX, valStartY);
    }
}

function generateItemArray(arraySize) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    let itemWidth = canvas.width / arraySize;
    let vals = Array.from({length: arraySize}, () => Math.floor(Math.random() * 50) + 1);
    for (let i = 0; i < arraySize; i++) {
        let item = new SortItem(vals[i], itemWidth, i);
        arr.push(item);
        item.draw();
    }
}

function getArraySize(){
    let arraySize = document.getElementById("arrSize").value;
    return parseInt(arraySize);
}

// this is likely going to disappear soon
function runSorting(sortFunction, array) {
    arr = sortFunction(array);
}


var arr = [];
var canvas;
var context;
const canvasHeight = 500;
const canvasWidthModifier = 0.95;
const defaultArraySize = 20;

window.onload = function() {
    canvas = document.getElementById("canvas");
    canvas.setAttribute('width', window.innerWidth * canvasWidthModifier);
    canvas.setAttribute('height', canvasHeight);
    context = canvas.getContext("2d");

    generateItemArray(defaultArraySize);
    document.getElementById("generateItemArray").onclick = function() {
        let arraySize = getArraySize();
        generateItemArray(arraySize);
    }
    document.getElementById("bubblesort").onclick = function() { runSorting(bubbleSort, arr) };
    document.getElementById("shellsort").onclick = function() { runSorting(shellSort, arr) };
    document.getElementById("mergesort").onclick = function() { runSorting(mergeSort, arr) };
    document.getElementById("quicksort").onclick = function() { runSorting(quickSort, arr) };
}
