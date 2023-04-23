import calendarInit from './classes/calendar.js'
import {Item} from './classes/item.js'

//-----------------INIT----------------

let itemList = [];

const todoBlock = document.querySelector('.block_todo');
const completeBlock = document.querySelector('.block_complete');

const addBtn = document.querySelector('.header__btn');

//--------------------------------------

itemList.push(new Item('text1'));
itemList.push(new Item('text2'));
itemList.push(new Item('text3', true));

//create html text
for (let id in itemList){
    itemList[id].createHTML(id);
}

//add items in DOM
for (let item of itemList){
    if (item.isComplete){
        completeBlock.insertAdjacentHTML("beforeend", item.itemHtml);
    } else {
        todoBlock.insertAdjacentHTML("beforeend", item.itemHtml);
    }
}

//calendar & checkbox init
for (let item of document.querySelectorAll('.item')){
    calendarInit(item.querySelector('.calendar'));
    item.querySelector('.checkbox').addEventListener('click', checkboxTouch)
}

//-----------------ADD NEW ITEM----------------

let input = document.querySelector('.header__input');

addBtn.addEventListener('click', ()=>{
    if (input.value){
        itemList.push(new Item(input.value));

        todoBlock.insertAdjacentHTML("beforeend", itemList[itemList.length-1].createHTML(itemList.length));

        let item = todoBlock.querySelectorAll('.item')[todoBlock.querySelectorAll('.item').length - 1]

        calendarInit(item.querySelector('.calendar'));
        item.querySelector('.checkbox').addEventListener('click', checkboxTouch)

        //for start dragging costing opacity
        item.addEventListener("dragstart", () => {
            item.classList.add("dragging")
        })

        //for end the dragging opacity costing
        item.addEventListener("dragend", () => {
            item.classList.remove("dragging")
        })
        
        input.value = '';
    }
})
//----------------Moving Items-------------------

//move with checkbox
function checkboxTouch(e){
    //выборка именно input checkbox т.е один элемент
    if (e.target.id) {
        let checkbox = e.target;
        let item = e.target.parentNode.parentNode.parentElement;

        if (checkbox.checked){
            item.classList.replace('item_todo', 'item_complete')
            item.querySelector('.text').innerHTML = `<strike>${item.querySelector('.text').innerHTML}</strike>`

            completeBlock.appendChild(item)
        } else {
            item.classList.replace('item_complete','item_todo')
            item.querySelector('.text').innerHTML = item.querySelector('.text > strike').innerHTML;

            todoBlock.appendChild(item)
        }
    }
}

//move with drug&drop
const draggbles = document.querySelectorAll(".shallow-draggable")
const containers = document.querySelectorAll(".draggable-container")

draggbles.forEach((draggble) => {
    //for start dragging costing opacity
    draggble.addEventListener("dragstart", () => {
        draggble.classList.add("dragging")
    })

    //for end the dragging opacity costing
    draggble.addEventListener("dragend", () => {
        draggble.classList.remove("dragging")
    })
})
//shit
containers.forEach((container) => {
    container.addEventListener("dragover", function (e) {
        e.preventDefault()
        const afterElement = dragAfterElement(container, e.clientY)
        const dragging = document.querySelector(".dragging")
        if (afterElement == null) {
            container.appendChild(dragging)
        } else {
            container.insertBefore(dragging, afterElement)
        }

        if (container.classList.contains('block_complete')){
            dragging.classList.replace('item_todo', 'item_complete')
            dragging.querySelector('.checkbox > input').checked = true;
            
            let text = dragging.querySelector('.text').innerHTML
            if(!text.includes('strike')){
                dragging.querySelector('.text').innerHTML = `<strike>${dragging.querySelector('.text').innerHTML}</strike>`
            }
        }else {
            dragging.classList.replace('item_complete','item_todo')
            dragging.querySelector('.checkbox > input').checked = false;

            let text = dragging.querySelector('.text').innerHTML;
            if(text.includes('strike')){
                dragging.querySelector('.text').innerHTML = dragging.querySelector('.text > strike').innerHTML;
            }
        }
    })
})

function dragAfterElement(container, y) {
    const draggbleElements = [...container.querySelectorAll(".shallow-draggable:not(.dragging)")]

    return draggbleElements.reduce(
        (closest, child) => {
            const box = child.getBoundingClientRect()
            const offset = y - box.top - box.height / 2
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child }
            } else {
                return closest
            }
        },
        { offset: Number.NEGATIVE_INFINITY }
    ).element
}
