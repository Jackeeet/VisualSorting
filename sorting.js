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

function generateArray() {
    let size = document.getElementById("arrSize").value;
    size = parseInt(size);
    arr = Array.from({length: size}, () => Math.floor(Math.random() * 50) + 1);
    document.getElementById("startArray").innerHTML = arr;
    document.getElementById("resultArray").innerHTML = "";
}

function runSorting(sortFunction, array) {
    arr = sortFunction(array);
    document.getElementById("resultArray").innerHTML = arr;
}

let arr = [];
generateArray();
document.getElementById("generateArray").onclick = generateArray;
document.getElementById("bubblesort").onclick = function() { runSorting(bubbleSort, arr) };
document.getElementById("shellsort").onclick = function() { runSorting(shellSort, arr) };
document.getElementById("mergesort").onclick = function() { runSorting(mergeSort, arr) };
document.getElementById("quicksort").onclick = function() { runSorting(quickSort, arr) };
