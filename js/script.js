const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemsBtn = document.querySelectorAll('.solid');
const addItemsContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');

//Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

//Items
let updatedOnload = false;

//Intialize Array
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

//Drag functionality
let draggedItem;
let currentColumn;
let dragging = false;

//Get Arrays from localStorage if available,set default value if not
function getSavedColumns() {
    if (localStorage.getItem('backlogItems')) {
        backlogListArray = JSON.parse(localStorage.backlogItems);
        progressListArray = JSON.parse(localStorage.progressItems);
        completeListArray = JSON.parse(localStorage.completeItems);
        onHoldListArray = JSON.parse(localStorage.onHoldItems);
    } else {
        backlogListArray = ['Release the course', 'Sit back and relax'];
        progressListArray = ['Work on projects', 'Listen to music'];
        completeListArray = ['Being Cool', 'Getting stuff done'];
        onHoldListArray = ['Being Uncool'];
    }
}


//set local storage arrays
function updateSavedColumns() {
    listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
    const arrayNames = ['backlogItems', 'progressItems', 'completeItems', 'onHoldItems'];
    arrayNames.forEach((arrayName, index) => { localStorage.setItem(`${arrayName}`, JSON.stringify(listArrays[index])) });
}

//filter array to remove empty item
function filterArray(array) {
    const filteredArray = array.filter(item => item !== null);
    return filteredArray;
}

// // //double click
// function dbclick(e) {

//     // list.contentEditable =
//     console.log("double click");
// }


//Create DOM elements for each list item
function createItemEl(columnEl, column, item, index) {

    //list Item
    const listEl = document.createElement('li');
    listEl.classList.add('drag-item');
    listEl.textContent = item;
    listEl.draggable = true;
    listEl.setAttribute('ondragstart', 'drag(event)')
    listEl.id = index;
    // listEl.ondblclick = dbclick(this);
    listEl.contentEditable = 'true';
    listEl.setAttribute('onfocusout', `updateItem(${ index }, ${ column })`);

    //Append
    columnEl.appendChild(listEl);
}

// Update Columns in DOM- Reset HTML, Filter Array, Update localStorage
function updateDOM() {

    //check local storage once
    if (!updatedOnload) {
        getSavedColumns();
    }

    //Backlog column
    backlogList.textContent = '';
    backlogListArray.forEach((backlogItem, index) => {
        createItemEl(backlogList, 0, backlogItem, index);
    });
    backlogListArray = filterArray(backlogListArray);

    //Progress Column
    progressList.textContent = '';
    progressListArray.forEach((progressItem, index) => {
        createItemEl(progressList, 1, progressItem, index);
    });
    progressListArray = filterArray(progressListArray);

    //Complete Column
    completeList.textContent = '';
    completeListArray.forEach((completeItem, index) => {
        createItemEl(completeList, 2, completeItem, index);
    });
    completeListArray = filterArray(completeListArray);

    //onHold Column
    onHoldList.textContent = '';
    onHoldListArray.forEach((onHoldItem, index) => {
        createItemEl(onHoldList, 3, onHoldItem, index);
    });
    onHoldListArray = filterArray(onHoldListArray);

    // Run getSavedColumns only once , update local storage
    updatedOnload = true;
    updateSavedColumns();
}

//Update Item of List or Delete if blank
function updateItem(id, column) {
    const selectedArray = listArrays[column];
    const selectedColumnEl = listColumns[column].children;
    if (!dragging) {
        if (selectedColumnEl[id].textContent == '') {
            delete selectedArray[id];
        } else {
            listArrays[column][id] = selectedColumnEl[id].textContent;
        }
        updateDOM();
    }
}


//Add to Column List Reset the TextBox
function addToColumn(column) {
    const itemText = addItems[column].textContent;
    const selectedArray = listArrays[column];
    selectedArray.push(itemText);
    addItems[column].textContent = '';
    updateDOM();
}

//show Add Item Input box
function showInputBox(column) {
    addBtns[column].style.visibility = 'hidden';
    saveItemsBtn[column].style.display = 'flex';
    addItemsContainers[column].style.display = 'flex';
}


//Hide Item Input Box
function hideInputBox(column) {
    addBtns[column].style.visibility = 'visible';
    saveItemsBtn[column].style.display = 'none';
    addItemsContainers[column].style.display = 'none';
    addToColumn(column);
}


//Allow array  to reflect Drag and Drop item
function rebuildArrays() {
    backlogListArray = [];
    for (let i = 0; i < backlogList.children.length; i++) {
        backlogListArray.push(backlogList.children[i].textContent);
    }
    progressListArray = [];
    for (let i = 0; i < progressList.children.length; i++) {
        progressListArray.push(progressList.children[i].textContent);
    }
    completeListArray = [];
    for (let i = 0; i < completeList.children.length; i++) {
        completeListArray.push(completeList.children[i].textContent);
    }
    onHoldListArray = [];
    for (let i = 0; i < onHoldList.children.length; i++) {
        onHoldListArray.push(onHoldList.children[i].textContent);
    }
    updateDOM();
}

//item start draging
function drag(e) {
    draggedItem = e.target;
    dragging = true;
}

// Columns allow for item to drop
function allowDrop(e) {
    e.preventDefault();
}

// where Item Enters Column area
function dragEnter(column) {
    listColumns[column].classList.add('over');
    currentColumn = column;
}

//Droping item
function drop(e) {
    e.preventDefault();


    //Remove Background color padding
    listColumns.forEach((column) => {
        column.classList.remove('over');
    });

    //Add the Item to Column
    const parent = listColumns[currentColumn];
    parent.appendChild(draggedItem);
    dragging = false;
    rebuildArrays();
}
//

//onload
updateDOM();