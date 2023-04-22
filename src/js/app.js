import calendarInit from './classes/calendar.js'
import {Item} from './classes/item.js'

//-----------------INIT----------------

let itemList = [];

const todoBlock = document.querySelector('.block_todo');
const completeBlock = document.querySelector('.block_complete');

const addBtn = document.querySelector('.header__btn');

//--------------------------------------

// itemList.push(new Item('text1'));
// itemList.push(new Item('text2'));
// itemList.push(new Item('text3', true));

//create html text
// for (let id in itemList){
//     itemList[id].createHTML(id);
// }
//
// //add items in DOM
// for (let item of itemList){
//     if (item.isComplete){
//         completeBlock.insertAdjacentHTML("beforeend", item.itemHtml);
//     } else {
//         todoBlock.insertAdjacentHTML("beforeend", item.itemHtml);
//     }
// }
//
// //calendar & checkbox init
// for (let item of document.querySelectorAll('.item')){
//     calendarInit(item.querySelector('.calendar'));
//     item.querySelector('.checkbox').addEventListener('click', checkboxTouch)
// }

//-----------------ADD NEW ITEM----------------

let input = document.querySelector('.header__input');

addBtn.addEventListener('click', ()=>{
    if (input.value){
        itemList.push(new Item(input.value));

        todoBlock.insertAdjacentHTML("beforeend", itemList[itemList.length-1].createHTML(itemList.length));

        let item = todoBlock.querySelectorAll('.item')[todoBlock.querySelectorAll('.item').length - 1]

        calendarInit(item.querySelector('.calendar'));
        item.querySelector('.checkbox').addEventListener('click', checkboxTouch)
        
        input.value = '';
    }
})
//----------------Moving Items-------------------

//move width checkbox
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