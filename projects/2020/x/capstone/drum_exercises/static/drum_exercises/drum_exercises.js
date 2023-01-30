let bar_value_array = [[[2,2],[2,2]],[[2,2],[4]]];

document.addEventListener("DOMContentLoaded", function(){
    let beats_template_as_array = Array.from(document.querySelectorAll('.beat'));

    bar_value_array.forEach(function(beat_value_array, index){
        // here we can determine: 
        // 1. whether the top beam is visible 
        // 2. which notes belong to this beat

        sub_beat_elements = Array.from(beats_template_as_array[index].children).filter(function (child) {
            return child.classList.contains('sub-beat');
        })

        var notes_of_this_beat = [];
        sub_beat_elements.forEach(child =>{
            var noteys = Array.from(child.children).filter(child => {return child.classList.contains('note')});
            notes_of_this_beat.push(noteys);
        });
        notes_of_this_beat = [].concat(...notes_of_this_beat)

        
        let cursor = 0;
        beat_value_array.forEach(function(subbeat_array){
            subbeat_array.forEach(function(note_value){
                for (var i = 0; i < note_value; i++){
                    if (i > 0){
                        var ele = notes_of_this_beat[cursor].children;
                        Array.from(ele).forEach(el => el.style.display = 'none');
                    }
                    cursor++;
                }
            });
        })
    })
})


function topBeamChanger(){
    // where is starts (always 0 from now)
    
    
    // where is ends

}
