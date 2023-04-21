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

for (let item of document.querySelectorAll('.item')){
    calendarInit(item.querySelector('.calendar'));
}

//-----------------ADD NEW ITEM----------------

let input = document.querySelector('.header__input');

addBtn.addEventListener('click', ()=>{
    if (input.value){
        itemList.push(new Item(input.value));

        todoBlock.insertAdjacentHTML("beforeend", itemList[itemList.length-1].createHTML(itemList.length-1));

        let item = todoBlock.querySelectorAll('.item')[todoBlock.querySelectorAll('.item').length - 1]
        calendarInit(item.querySelector('.calendar'));

        input.value = '';
    }
})
//----------------Moving Items-------------------

document.querySelector('.checkbox').addEventListener('click', (e) => {
    let checkbox = e.target.parentNode.parentNode.parentNode;
    console.log(checkbox);
})
