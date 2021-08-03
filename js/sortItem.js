export const defaultColour = "#384EC7";
export const selectedColour = "#38C7B1";
export const markerColour = "#FFFFFF";
export const delayMilliseconds = 0;

const minWidthForLabel = 17.5;

export async function selectPairByIndex(arr, index1, index2) {
    let item1 = arr[index1];
    let item2 = arr[index2];
    await setPairColour(item1, item2, selectedColour);
    let result = [item1, item2];
    return result;
}

export function selectNext(arr, index) {
    let nextIndex = index + 1;
    let nextItem = arr[nextIndex];
    nextItem.style.backgroundColor = selectedColour;
    return [nextItem, nextIndex];
}

export async function setPairColour(item1, item2, colour, addDelay = true) {
    item1.style.backgroundColor = colour;
    item2.style.backgroundColor = colour;
    if (addDelay) {
        await new Promise(resolve => setTimeout(() => { resolve(); }, delayMilliseconds));
    }
}

export function create(index, width, height, value, transformDuration) {
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

export function getValue(sortItem) {
    return parseInt(sortItem.childNodes[0].innerHTML);
}