import calendarInit from './classes/calendar.js'
import {Item} from './classes/item.js'


let itemList = [];

new Item('text1', '', false).createItem(itemList);
new Item('text2', '', false).createItem(itemList);
new Item('text3', '', true).createItem(itemList);

const todoBlock = document.querySelector('.block_todo');
const completeBlock = document.querySelector('.block_complete');


for (let item of itemList){
    console.log(item);
}



// function fillItemList(objKey, blockName){
//     for (item of document.querySelector(blockName).querySelectorAll('.item')){
//         itemList[objKey].push(item)
//
//         calendarInit(item.querySelector('.calendar'))
//     }
// }

