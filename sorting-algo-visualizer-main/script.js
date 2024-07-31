// Global variables
let array = [];
const arrayContainer = document.getElementById('arrayContainer');
const generateArrayBtn = document.getElementById('generateArray');
const mergeSortBtn = document.getElementById('mergeSort');
const quickSortBtn = document.getElementById('quickSort');
const insertionSortBtn = document.getElementById('insertionSort');



// Generate a random array and display it
function generateArray() {
    array = [];
    arrayContainer.innerHTML = '';
    const arraySize = Math.floor(Math.random() * 50) + 10; // Random size between 10 and 59
    for (let i = 0; i < arraySize; i++) {
        const value = Math.floor(Math.random() * 100) + 1;
        array.push(value);
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${value * 3}px`;
        arrayContainer.appendChild(bar);
    }
    updateInfo();
    document.getElementById('timeTaken').textContent = '-';
}


async function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        
        await updateVisualization(i, null, 'pivot'); // Highlight current element
        
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            await updateVisualization(j + 1, j);
            j = j - 1;
        }
        arr[j + 1] = key;
        await updateVisualization(j + 1);
        
        await updateVisualization(i, null, 'reset'); // Reset highlight
    }
}
// Merge Sort implementation
async function mergeSort(arr, start, end) {
    if (start < end) {
        const mid = Math.floor((start + end) / 2);
        await mergeSort(arr, start, mid);
        await mergeSort(arr, mid + 1, end);
        await merge(arr, start, mid, end);
    }
}

async function merge(arr, start, mid, end) {
    const leftArray = arr.slice(start, mid + 1);
    const rightArray = arr.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;

    while (i < leftArray.length && j < rightArray.length) {
        if (leftArray[i] <= rightArray[j]) {
            arr[k] = leftArray[i];
            i++;
        } else {
            arr[k] = rightArray[j];
            j++;
        }
        await updateVisualization(k);
        k++;
    }

    while (i < leftArray.length) {
        arr[k] = leftArray[i];
        await updateVisualization(k);
        i++;
        k++;
    }

    while (j < rightArray.length) {
        arr[k] = rightArray[j];
        await updateVisualization(k);
        j++;
        k++;
    }
}

// Quick Sort implementation
async function quickSort(arr, low, high) {
    if (low < high) {
        const pivotIndex = await partition(arr, low, high);
        await quickSort(arr, low, pivotIndex - 1);
        await quickSort(arr, pivotIndex + 1, high);
    }
}

async function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;

    // Highlight pivot
    await updateVisualization(high, null, 'pivot');

    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            await updateVisualization(i, j);
        }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    await updateVisualization(i + 1, high);

    // Reset pivot color
    await updateVisualization(high, null, 'reset');

    return i + 1;
}

async function updateVisualization(index1, index2, pivotAction) {
    const bars = arrayContainer.children;
    const totalBars = bars.length;

    function updateBar(index, color) {
        if (index >= 0 && index < totalBars) {
            bars[index].style.height = `${array[index] * 3}px`;
            bars[index].style.backgroundColor = color;
        }
    }

    if (pivotAction === 'pivot') {
        updateBar(index1, '#9b59b6'); // Purple for pivot
    } else if (pivotAction === 'reset') {
        updateBar(index1, '#3498db'); // Reset to original color
    } else {
        updateBar(index1, '#e74c3c');
        if (index2 !== null) {
            updateBar(index2, '#e74c3c');
        }
    }

    await new Promise(resolve => setTimeout(resolve, 75));

    if (pivotAction !== 'pivot' && pivotAction !== 'reset') {
        updateBar(index1, '#3498db');
        if (index2 !== null) {
            updateBar(index2, '#3498db');
        }
    }
}


// Event listeners
insertionSortBtn.addEventListener('click', () => runSortingAlgorithm(insertionSort));
mergeSortBtn.addEventListener('click', () => runSortingAlgorithm(mergeSort));
quickSortBtn.addEventListener('click', () => runSortingAlgorithm(quickSort));
generateArrayBtn.addEventListener('click', generateArray);

let startTime, endTime;

function updateInfo() {
    document.getElementById('arraySize').textContent = array.length;
}

function startTimer() {
    startTime = new Date();
}

function stopTimer() {
    endTime = new Date();
    const timeTaken = (endTime - startTime) / 1000; // in seconds
    document.getElementById('timeTaken').textContent = `${timeTaken.toFixed(2)} seconds`;
}

async function runSortingAlgorithm(sortFunction) {
    disableButtons();
    startTimer();
    if (sortFunction === insertionSort) {
        await sortFunction(array);
    } else {
        await sortFunction(array, 0, array.length - 1);
    }
    stopTimer();
    enableButtons();
}

// Helper functions to disable/enable buttons during sorting
function disableButtons() {
    generateArrayBtn.disabled = true;
    mergeSortBtn.disabled = true;
    quickSortBtn.disabled = true;
    insertionSortBtn.disabled = true;
}

function enableButtons() {
    generateArrayBtn.disabled = false;
    mergeSortBtn.disabled = false;
    quickSortBtn.disabled = false;
    insertionSortBtn.disabled = false;
}

// Initialize the array on page load
generateArray();