import {calendarInit, dateToInner} from './classes/calendar.js'
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

//calendar, checkbox and drug&drop init
for (let item of document.querySelectorAll('.drag-item')){
    calendarInit(item.querySelector('.calendar'));
    item.querySelector('.checkbox').addEventListener('click', checkboxTouch)
    dragItem(item);
    //item.addEventListener('dblclick', (e)=>{item.style.backgroundColor = 'red'})
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
    }
}

//move with drug&drop
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

    let margin = item.getBoundingClientRect().y; //закрепление позиции item сверху

    let click1 = null;
    let click2 = null;

    item.addEventListener('touchstart', touchStart, {passive: false});
    item.addEventListener('mousedown', touchStart);

    function touchStart (event){

        //if checkbox click & item container != reel container
        if (container != item.parentElement){

            container = item.parentElement;
            nextContainer = null;
            prevContainer = null;

            if (containers.length > 1){
                if (container.nextElementSibling && container.nextElementSibling.classList.contains('drag-list')){
                    nextContainer = container.nextElementSibling;
                }
                if (container.previousElementSibling && container.previousElementSibling.classList.contains('drag-list')){
                    prevContainer = container.previousElementSibling;
                }
            }
        }

        //---------Отслеживание нажатия на checkbox или календарь
        if (event.target.tagName.toLowerCase() == 'label'
            || event.target.tagName.toLowerCase() == 'input'){
            return;
        }

        //отключение прокрутки страницы
        event.preventDefault();

        //--------Double click/tap
        click2 = Date.now();

        if (click1 && click2 - click1 < 200){
            popUp(item);
            return;
        }
        click1 = click2;

        //----------Начало драг&дроп
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

//pop-up

//colors
export let colors = {
    light : {
        red: '#f22a2a',
        orange: '#f2711c',
        yellow: '#fbbd08',
        green: '#B5CC18',
        blue: '#00bcd4',
        violet: '#cd5dde',
        base: '#ffffff'
    },
    dark : {
        red: '#ae1616',
        orange: '#e17014',
        yellow: '#dea90a',
        green: '#539412',
        blue: '#2a3d9c',
        violet: '#6435C9',
        base: '#46466d'
    }
}


function popUp(item){
    //init
    let popUp = document.querySelector('.pop-up');
    popUp.style.visibility = 'visible'

    let btnOk = popUp.querySelector('.pop-btn_ok');
    let btnDel = popUp.querySelector('.pop-btn_del');

    calendarInit(document.querySelector('.pop-up__calendar'), true);

    let colorBar = popUp.querySelectorAll('.color-bar > input');
    let colorTheme = document.querySelector('.list').classList.contains('list_dark-mode') ? colors.dark : colors.light;
    let itemColor = getColor(item).toLowerCase();

    //заполнение исходя из item
    //text
    popUp.querySelector('.form > input').value = item.querySelector('.text> strike') ?
        item.querySelector('.text> strike').innerHTML : item.querySelector('.text').innerHTML;

    //calendar
    dateToInner(popUp.querySelector('.calendar'), item.querySelector('.calendar > input'), true);

    //color
    for (let color of Object.entries(colorTheme)){
        if (itemColor == color[1].toLowerCase()) {
            for (let colorItem of colorBar){
                colorItem.checked = (colorItem.id == color[0]) ? true : false;
            }
        }
    }


    btnOk.addEventListener('click', changeItem);
    btnDel.addEventListener('click', deleteItem);

    function changeItem() {
        //text
        if (item.querySelector('.text> strike')){
            item.querySelector('.text> strike').innerHTML =  popUp.querySelector('.form > input').value;
        } else {
            item.querySelector('.text').innerHTML = popUp.querySelector('.form > input').value;
        }
        //calendar
        dateToInner(item.querySelector('.calendar'), popUp.querySelector('.calendar > input'));

        //color
        for (let colorItem of colorBar){
            if (colorItem.checked){
                item.style.backgroundColor = colorTheme[colorItem.id]

            }
        }
        closePopUp()
    }

    function deleteItem() {
        item.remove();

        closePopUp()
    }

    function closePopUp(){
        popUp.style.visibility = 'hidden';

        btnOk.removeEventListener('click', changeItem);
        btnDel.removeEventListener('click', deleteItem);
    }
}

export function getColor(tag) {
    let toHex = function(color) {
        let hex = function(str) {
            let result = parseInt(str).toString(16);
            if (result.length < 2)
                result = '0' + result;
            return result;
        }

        let rgb = color.match(/^rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)$/);
        if (!rgb)
            return color;
        return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    }

    let style = window.getComputedStyle(tag);
    return toHex(style.backgroundColor);
}