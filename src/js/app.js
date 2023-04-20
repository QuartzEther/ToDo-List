import calendarInit from './classes/calendar.js'
import {Item} from './classes/item.js'

//-----------------INIT----------------

let itemList = [];

new Item('text1', '', false).createItem(itemList);
new Item('text2', '', false).createItem(itemList);
new Item('text3', '', true).createItem(itemList);

const todoBlock = document.querySelector('.block_todo');
const completeBlock = document.querySelector('.block_complete');


for (let item of itemList){
    if (item.isComplete){
        completeBlock.insertAdjacentHTML("beforeend", item.createItem(itemList));
    } else {
        todoBlock.insertAdjacentHTML("beforeend", item.createItem(itemList));
    }
}

for (let item of document.querySelectorAll('.item')){
    calendarInit(item.querySelector('.calendar'));
}

//-----------------ADD NEW ITEM----------------
