let bar_array = [[[7],[1]],[[2,4],[2]]];

document.addEventListener("DOMContentLoaded", function(){
    let beats = document.querySelectorAll('.beat');
    let notes = document.querySelectorAll('.note');
    console.log(notes);
    let cursor = 0;

    bar_array.forEach(function(beat_array){
        
        beat_array.forEach(function(subbeat_array){
            subbeat_array.forEach(function(note_value){
                for (var i = 0; i < note_value; i++){
                    if (i > 0){
                        var ele = notes[cursor].children;
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
