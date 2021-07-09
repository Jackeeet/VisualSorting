function bubbleSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
}

function shellSort(arr){
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


let arr = [7, 3, 4, 1, 5, 2];
document.getElementById("startArray").innerHTML = arr;

// shellSort(arr);
arr = mergeSort(arr);
document.getElementById("resultArray").innerHTML = arr;
