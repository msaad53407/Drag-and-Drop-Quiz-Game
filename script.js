const draggableElementsContainer = document.querySelector('.draggable-elements');
const dropableElementsContainer = document.querySelector('.dropable-elements');
const scoreElement = document.querySelector('.score');
const timerElement = document.querySelector('.timer');

let score = 0;
let randomIndexSet = new Set();
let randomIndexSetSize;

const logosArray = [{
    name: 'Audi',
    logo: 'assets/audi-logo.png'
}, {
    name: 'Beats',
    logo: 'assets/Beats-Logo-Design.jpg'
}, {
    name: 'Louis',
    logo: 'assets/louis-vuitton-logo.png'
}, {
    name: 'Mitsubishi',
    logo: 'assets/Mitsubishi-Logo-Design.png'
}, {
    name: 'Mastercard',
    logo: 'assets/mastercard-logo.png'
}, {
    name: 'Nike',
    logo: 'assets/nike-logo.png'
}, {
    name: 'Shell',
    logo: 'assets/Shell-Logo-Design.png'
}, {
    name: 'StarBucks',
    logo: 'assets/starbucks-logo.png'
}, {
    name: 'Volkswagen',
    logo: 'assets/Volkswagen-Logo-Design.png'
}, {
    name: 'Wikipedia',
    logo: 'assets/Wikipedia-Logo-Design.jpg'
}];

const insertRandomLogos = () => {
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * logosArray.length);
        randomIndexSet.add(randomIndex);
    }

    for (let i = 0; i < randomIndexSet.size; i++) {
        const randomIndexArray = Array.from(randomIndexSet);
        randomIndexSetSize = randomIndexArray.length;
        const { name, logo } = logosArray[randomIndexArray[i]];

        draggableElementsContainer.insertAdjacentHTML('beforeend', `<img src="${logo}" alt="${name}" id=${name} draggable='true'/>`);
        dropableElementsContainer.insertAdjacentHTML('beforeend', `
        <div class="dropable-box">
        <div class="box-heading">${name}</div>
        <div
          class="box-dropable-area"
          dropzone="move"
          data-dropable-id="${name}"
          ></div>
          </div>
          `)
    }
    randomIndexSet = new Set();
};

const basicSetupFunction = () => {
    insertRandomLogos();

    const dropableBoxes = document.querySelectorAll('.box-dropable-area');
    const draggableElements = document.querySelectorAll('.draggable-elements img');
    draggableElements.forEach(draggableElement => {
        draggableElement.addEventListener('dragstart', dragStart);
        // draggableElement.addEventListener('dragend', dragEnd);
    });
    dropableBoxes.forEach(dropableBox => {
        dropableBox.addEventListener('dragenter', dragEnter);
        dropableBox.addEventListener('dragleave', dragLeave);
        dropableBox.addEventListener('dragover', dragOver);
        dropableBox.addEventListener('drop', drop);
    });
}

const setTimer = () => {
    let timeLeft = 60;
    let timerId = setInterval(() => {
        if (timeLeft === 1) {
            document.body.innerHTML = `Game Over! You scored ${score} points!`
            clearInterval(timerId);
        };
        timeLeft--;
        timerElement.innerHTML = `Time left: ${timeLeft}s`;
    }, 1000);
};

const dragStart = e => {
    e.dataTransfer.setData('text', e.target.getAttribute('id'));
    e.dataTransfer.setData('logo', e.target.getAttribute('src'));
};

const dragEnter = e => {
    e.target.classList.add('drop-hover');
};

const dragLeave = e => {
    e.target.classList.remove('drop-hover');
};

const drop = e => {
    e.preventDefault();
    const idOfDraggableElement = e.dataTransfer.getData('text')
    const idOfDropableElement = e.target.getAttribute('data-dropable-id');
    e.target.classList.remove('drop-hover');
    if (idOfDropableElement === idOfDraggableElement) {
        const draggableElement = document.querySelector(`#${idOfDraggableElement}`);
        draggableElement.setAttribute('draggable', false)
        draggableElement.classList.add('disabled')
        const disabledDraggableElements = document.querySelectorAll('.draggable-elements img.disabled');
        if (disabledDraggableElements.length === randomIndexSetSize) {
            draggableElementsContainer.innerHTML = '';
            dropableElementsContainer.innerHTML = '';
            randomIndexSetSize = 0;
            basicSetupFunction();
        }
        e.target.insertAdjacentHTML("beforeend", `<img src="${e.dataTransfer.getData('logo')}" alt="${idOfDraggableElement}" draggable='false' />`);
        e.target.classList.add('dropped')
        score += 10;
        scoreElement.innerHTML = `Score: ${score}`;
    }
};

const dragOver = e => {
    e.preventDefault();
};

window.addEventListener('DOMContentLoaded', function () {
    setTimer();
    basicSetupFunction();
});
