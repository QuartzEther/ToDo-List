let toggle = document.querySelector('.toggle-switch>input');
toggle.addEventListener('click', ()=>{

    let items = document.querySelectorAll('.drag-item')
    for (let item of items) item.style.transition = 'none';

    if (toggle.checked) {
        document.querySelector('body').style.backgroundColor = '#434582';
        document.querySelector('.toggle-switch').style.backgroundPosition = "5% 100%";
        document.querySelector('.toggle-switch').style.boxShadow = "0 0 15px 10px rgba(0,0,0,0.1) inset";

        document.querySelector('.list').classList.add('list_dark-mode');
    } else {
        document.querySelector('body').style.backgroundColor = '#F2F8FB';

        document.querySelector('.toggle-switch').style.backgroundPosition = "100% 100%";
        document.querySelector('.toggle-switch').style.boxShadow = "0 0 15px 10px rgba(0,0,0,0.1) inset";

        document.querySelector('.list').classList.remove('list_dark-mode');

    }
})