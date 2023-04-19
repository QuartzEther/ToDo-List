import dateToInner from './calendar.js'

//get elements in TODO & complete
let item = null;

let itemList = {
    todo: [],
    complete : []
};

fillItemList('todo', '.block_todo');
fillItemList('complete', '.block_complete');


function fillItemList(objKey, blockName){
    for (item of document.querySelector(blockName).querySelectorAll('.item')){
        itemList[objKey].push(item)
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

        const calendar = item.querySelector('.calendar');
        const input = calendar.querySelector('input');

        //заполнение поля text
        dateToInner(calendar, input);

        //появление поля выбора
        calendar.addEventListener('click', ()=>{
            input.showPicker();
        })

        //изменение поля text
        input.addEventListener("change", (event) => dateToInner( calendar, input));


    }
})
