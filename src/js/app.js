import calendarInit from './classes/calendar.js'

//init items
let item = null;

let itemList = { //объект с эл которые находятся в todo и complete
    todo: [],
    complete : []
};

fillItemList('todo', '.block_todo');
fillItemList('complete', '.block_complete');


function fillItemList(objKey, blockName){
    for (item of document.querySelector(blockName).querySelectorAll('.item')){
        itemList[objKey].push(item)

        calendarInit(item.querySelector('.calendar'))
    }
}

//add item
let headerInput = document.querySelector('.header__form');

headerInput.querySelector('button').addEventListener('click', ()=>{
    let value = headerInput.querySelector('input').value;

    if (value){
        let newElem =
            `<div class="block__item item item_todo">
            <div class="item__check-text">
                <div class="item__checkbox checkbox">
                    <input type="checkbox" id="checkbox_${itemList.todo.length}" />
                    <label for="checkbox_${itemList.todo.length}"></label>
                </div>
                <p class="item__text text">${value}</p>
            </div>
            <div class="item__calendar calendar">
                <input type="date">
                <div class="calendar__img"></div>
                <h5 class="calendar__text"></h5>
            </div>
        </div>`;

        document.querySelector('.block_todo').insertAdjacentHTML("beforeend", newElem);

        item = document.querySelector('.block_todo').querySelectorAll('.item')[itemList.todo.length]

        itemList.todo.push(item);

        calendarInit(item.querySelector('.calendar'))
    }
})

//moving item by checker


