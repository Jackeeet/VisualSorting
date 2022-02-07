export const defaultColour = "#384EC7";
export const selectedColour = "#38C7B1";
export const markerColour = "#FFFFFF";
export const transitionDuration = 0;

const minLabelWidth = 28;

export async function selectPairByIndex(arr, index1, index2) {
    let item1 = arr[index1];
    let item2 = arr[index2];
    await setPairColour(item1, item2, selectedColour);
    return [item1, item2];
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
        await new Promise(resolve => setTimeout(() => { resolve(); }, transitionDuration));
    }
}

export function create(index, width, heightFactor, value, transformDuration) {
    let item = document.createElement("div");
    item.id = value;
    item.style.width = `${width}px`;
    item.style.height = `${value * heightFactor}px`;
    item.style.transform = `translateX(${index * width}px)`;
    item.style.transition = `transform ${transitionDuration}ms`;
    item.classList.add("sortItem");

    let label = createValueLabel(value, width);
    item.appendChild(label);
    return item;
}

export function resizeAll(width, heightFactor) {
    let items = Array.from(document.querySelectorAll(".sortItem"));
    for (let i = 0; i < items.length; i++) {
        items[i].style.width = `${width}px`;
        items[i].style.height = `${items[i].id * heightFactor}px`;
        items[i].style.transform = `translateX(${i * width}px)`;
    }
}

function createValueLabel(value, width) {
    let label = document.createElement("div");
    label.innerHTML = value;
    label.classList.add("sortItemLabel");
    if (width <= minLabelWidth) {
        label.style.visibility = "hidden";
    }

    return label;
}   

export function getValue(sortItem) {
    return parseInt(sortItem.id);
}