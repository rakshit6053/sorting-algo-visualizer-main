let array = [];
let currentIndex = 0;
let originalArray = [];
let history = [];
let futureSteps = [];

function generateRandomArray(length) {
    return Array.from({length}, () => Math.floor(Math.random() * 100) + 1);
}

function displayArray() {
    const container = document.getElementById('array-container');
    container.innerHTML = '';
    array.forEach((num, index) => {
        const item = document.createElement('div');
        item.className = 'array-item';
        item.textContent = num;
        if (index === currentIndex) {
            item.classList.add('current');
        }
        if (index === currentIndex + 1) {
            item.classList.add('next');
        }
        if (index === currentIndex || index === currentIndex + 1) {
            item.classList.add('swap-box');
        }
        container.appendChild(item);
    });
    updateButtons();
}

function updateButtons() {
    document.getElementById('undo-btn').disabled = history.length === 0;
    document.getElementById('redo-btn').disabled = futureSteps.length === 0;
}

function saveState() {
    history.push({array: [...array], currentIndex});
    futureSteps = [];
    updateButtons();
}

function swap() {
    if (currentIndex < array.length - 1) {
        saveState();
        const temp = array[currentIndex];
        array[currentIndex] = array[currentIndex + 1];
        array[currentIndex + 1] = temp;
        currentIndex++;
        displayArray();
        checkSorted();
    }
}

function pass() {
    if (currentIndex < array.length - 1) {
        saveState();
        currentIndex++;
        displayArray();
        checkSorted();
    }
}

function undo() {
    if (history.length > 0) {
        futureSteps.push({array: [...array], currentIndex});
        const previousState = history.pop();
        array = previousState.array;
        currentIndex = previousState.currentIndex;
        displayArray();
    }
}

function redo() {
    if (futureSteps.length > 0) {
        history.push({array: [...array], currentIndex});
        const nextState = futureSteps.pop();
        array = nextState.array;
        currentIndex = nextState.currentIndex;
        displayArray();
    }
}

function checkSorted() {
    if (currentIndex === array.length - 1) {
        const sorted = [...array].sort((a, b) => a - b);
        if (JSON.stringify(array) === JSON.stringify(sorted)) {
            document.getElementById('popup').style.display = 'flex';
        } else {
            document.getElementById('message').textContent = 'The array is not fully sorted. Try again!';
        }
        currentIndex = 0;
        displayArray();
    }
}

function initGame() {
    originalArray = generateRandomArray(5);
    array = [...originalArray];
    currentIndex = 0;
    history = [];
    futureSteps = [];
    displayArray();
    document.getElementById('message').textContent = '';
    document.getElementById('popup').style.display = 'none';
}

function resetArray() {
    array = [...originalArray];
    currentIndex = 0;
    history = [];
    futureSteps = [];
    displayArray();
    document.getElementById('message').textContent = 'Array reset to original state.';
}

document.getElementById('swap-btn').addEventListener('click', swap);
document.getElementById('pass-btn').addEventListener('click', pass);
document.getElementById('reset-btn').addEventListener('click', resetArray);
document.getElementById('new-game-btn').addEventListener('click', initGame);
document.getElementById('undo-btn').addEventListener('click', undo);
document.getElementById('redo-btn').addEventListener('click', redo);

initGame();