export class Item {
    #itemHTML = '';
    constructor(text = '', date = '', isComplete = false) {
        this.text = text;
        this.date = date;
        this.isComplete = isComplete;
    }

    createItem(itemList){
        if (!this.#itemHTML){
            this.#itemHTML = `<div class="block__item item ${this.isComplete ? 'item_complete' : 'item_todo'}">
                <div class="item__check-text">
                    <div class="item__checkbox checkbox">
                        <input type="checkbox" ${this.isComplete ? 'checked' : ''} id="checkbox_${itemList.length}" />
                        <label for="checkbox_${itemList.length}"></label>
                    </div>
                    <p class="item__text text">${this.isComplete ? `<strike>${this.text}</strike>` : this.text}</p>
                </div>
                <div class="item__calendar calendar">
                    <input type="date">
                    <div class="calendar__img"></div>
                    <h5 class="calendar__text"></h5>
                </div>
            </div>`;
            itemList.push(this);
        }
        return this.#itemHTML
    }
}