function calendarInit(calendar){
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

function dateToInner(calendar, input){
    if (input.value){

        input.style.cursor = 'auto'
        calendar.querySelector('.calendar__text').style.visibility = 'inherit';
        calendar.querySelector('.calendar__img').style.visibility = 'inherit';


        let date = new Date();
        date.setDate(date.getDate()-1)

        let days = ['Yesterday', 'Due today', 'Tomorrow']

        let isSet = false

        for (let i in days) {
            if (date.toISOString().split('T')[0] == input.value){
                calendar.querySelector('.calendar__text').innerHTML = days[i];
                isSet = true;
                break;
            }
            date.setDate(date.getDate()+1)
        }

        if(!isSet && input.value){
            calendar.querySelector('.calendar__text').innerHTML = input.value.split('-').reverse().join('/')
        }

    } else {
        calendar.querySelector('.calendar__text').innerHTML = '00/00/0000';
        input.style.cursor = 'pointer'

        calendar.querySelector('.calendar__text').style.visibility = 'hidden';
        calendar.querySelector('.calendar__img').style.visibility = 'hidden';
    }

}

export default calendarInit;