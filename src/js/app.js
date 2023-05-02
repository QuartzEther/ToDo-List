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

//itemList.push(new Item('text1 text1 text1 text1 text1 text1 text1 text1 text1'));


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

        dragItem(item)

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

        // item.removeEventListener('touchstart', touchStart)
        // item.removeEventListener('mousedown', touchStart)
        //
        // dragItem(item);
    }
}

//move with drug&drop
const items = document.querySelectorAll(".drag-item")

for (let item of items){
    dragItem(item);
}

//инициализация движения
function dragItem(item){

    let containers = document.querySelectorAll(".drag-list");
    let container = item.parentElement;

    let prevContainer = null;
    let nextContainer = null;

    if (containers.length > 1){
        if (container.nextElementSibling && container.nextElementSibling.classList.contains('drag-list')){
            nextContainer = container.nextElementSibling;
        }
        if (container.previousElementSibling && container.previousElementSibling.classList.contains('drag-list')){
            prevContainer = container.previousElementSibling;
        }
    }

    let margin =  item.getBoundingClientRect().y; //закрепление позиции item сверху

    item.addEventListener('touchstart', touchStart, {passive: false});
    item.addEventListener('mousedown', touchStart);

    function touchStart (event){

        //---------Отслеживание нажатия на checkbox или календарь
        if (event.target.tagName.toLowerCase() == 'label' || event.target.tagName.toLowerCase() == 'input'){
            return;
        }

        //----------Начало драг&дроп
        event.preventDefault();

        margin =  item.getBoundingClientRect().y; //закрепление позиции item сверху
        item.style.transition = 'none'

        item.style.position = 'relative';
        item.style.zIndex = '10';

        if (event.targetTouches){
            let touch = event.targetTouches[0];
            item.style.top = touch.clientY - margin - item.offsetHeight / 2 + 'px';

            document.addEventListener('touchmove', touchMove, {passive: false});
            document.addEventListener('touchend', touchEnd);
        } else {
            item.style.top = event.clientY - margin - item.offsetHeight / 2 + 'px';

            document.addEventListener('mousemove', touchMove);
            document.addEventListener('mouseup', touchEnd);
        }
    }


    function touchMove(event) {
        event.preventDefault();

        let touch = event.targetTouches? event.targetTouches[0]:event;
        item.style.top = touch.clientY - margin - item.offsetHeight / 2 + 'px';

        let thisEl = item;
        let prevEl = thisEl.previousElementSibling;
        let nextEl = thisEl.nextElementSibling;

        //перемещение item

        //перемещение вниз
        if (nextEl && item.getBoundingClientRect().y > nextEl.getBoundingClientRect().y
            && !nextEl.classList.contains('block__tittle')
            && !nextEl.classList.contains('animation-down')){
            container.insertBefore(nextEl, thisEl);

            nextEl.classList.add('animation-up');
            nextEl.addEventListener("animationend", () =>{
                nextEl.classList.remove('animation-up')
            }, false);

            item.style.top = 0;
            margin = item.getBoundingClientRect().y;


        } else if (prevEl && item.getBoundingClientRect().y < prevEl.getBoundingClientRect().y
            && !prevEl.classList.contains('block__tittle')
            && !prevEl.classList.contains('animation-up')){ //вверх
            container.insertBefore(thisEl, prevEl);

            prevEl.classList.add('animation-down')
            prevEl.addEventListener("animationend", () =>{
                prevEl.classList.remove('animation-down')
            }, false);

            item.style.top = 0;
            margin = item.getBoundingClientRect().y;

        } else if (nextContainer
            && (item.getBoundingClientRect().bottom) > nextContainer.querySelector('.block__tittle').getBoundingClientRect().bottom + 10){ //в нижний контейнер

            let textEl = nextContainer.querySelector('.block__tittle');

            nextContainer.prepend(item);
            nextContainer.insertBefore(textEl, item)

            textEl.classList.add('animation-up')
            textEl.addEventListener("animationend", () =>{
                textEl.classList.remove('animation-up')
            }, false);

            prevContainer = container;
            container = nextContainer;
            nextContainer = (container.nextElementSibling && container.nextElementSibling.classList.contains('drag-list')) ?
                container.nextElementSibling : null;

            item.style.top = 0;
            margin = item.getBoundingClientRect().y;

        } else if (prevContainer
            && item.getBoundingClientRect().y < prevContainer.getBoundingClientRect().bottom){ //в верхний контейнер

            let textEl = container.querySelector('.block__tittle');
            prevContainer.appendChild(item);

            textEl.classList.add('animation-down')
            textEl.addEventListener("animationend", () =>{
                textEl.classList.remove('animation-down')
            }, false);

            nextContainer = container;
            container = prevContainer;
            prevContainer = (container.previousElementSibling && container.previousElementSibling.classList.contains('drag-list')) ?
                container.previousElementSibling : null;

            item.style.top = 0;
            margin = item.getBoundingClientRect().y;
        }

        if (container.classList.contains('block_complete')
            && !item.classList.contains('item_complete')){

            item.classList.replace('item_todo', 'item_complete');
            item.querySelector('.text').innerHTML = `<strike>${item.querySelector('.text').innerHTML}</strike>`;

            item.querySelector('.checkbox > input').checked = true;
        }
        else if (container.classList.contains('block_todo')
            && !item.classList.contains('item_todo')){

            item.classList.replace('item_complete','item_todo')
            item.querySelector('.text').innerHTML = item.querySelector('.text > strike').innerHTML;

            item.querySelector('.checkbox > input').checked = false;
        }
    }

    function touchEnd (){
        document.removeEventListener('touchmove', touchMove);
        document.removeEventListener('mousemove', touchMove);

        item.ontouchend = null;
        item.style.transition = 'all .3s ease'
        item.style.top = 0;

        item.style.zIndex = '1';
    }
}