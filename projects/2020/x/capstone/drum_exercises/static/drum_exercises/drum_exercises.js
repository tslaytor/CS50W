let values = [2,2,2,2];

document.addEventListener("DOMContentLoaded", function(){
    let nodes = document.querySelectorAll('.note');
    let cursor = 0;
    values.forEach(function(value){
        for (var i = 0; i < value; i++){
            if (i > 0){
                var ele = nodes[cursor].children;
                Array.from(ele).forEach(el => el.style.display = 'none');
            }
            cursor++;
        }
    })
})
