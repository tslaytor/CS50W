let bar_value_array = [[[4],[2,2]],[[2,2],[4]]];

document.addEventListener("DOMContentLoaded", function(){
    let beats_template = document.querySelectorAll('.beat');
    let notes_template = document.querySelectorAll('.note');

    var beats_template_as_array = Array.from(beats_template);
    
   

    bar_value_array.forEach(function(beat_value_array, index){
        // here we can determine: 
        // 1. whether the top beam is visible 
        // 2. which notes belong to this beat

        // console.log('this is index: ' + index);
        // console.log(beats_template_as_array[index]);

        // console.log('beats_template_as_array current index children');
        // console.log(Array.from(beats_template_as_array[index].children))

        var children_elements = Array.from(beats_template_as_array[index].children);

        // filtered children is an array of 2 subbeat elements
        filtered_children = children_elements.filter(function (child) {
            return child.classList.contains('sub-beat');
        })

        // console.log('filtered children');
        // console.log(filtered_children)

        var notes_of_this_beat = [];
        filtered_children.forEach(child =>{
            // console.log('childs childrens')
            // console.log(child.children);
            // var noteys = Array.from(child.children).filter(child => {return child.classList.contains('note')});
            var noteys = Array.from(child.children).filter(child => {return child.classList.contains('note')});
            
            // console.log('noteys')
            // console.log(noteys);
            notes_of_this_beat.push(noteys);
        });
        notes_of_this_beat = [].concat(...notes_of_this_beat)
        // console.log('notes of this beat');
        // console.log(notes_of_this_beat);

        // var sub_beats_template_array = [];
        // beats_template_as_array.forEach( beat => {
        //     console.log('hey');
        //     console.log(beat);
        //     var children = Array.from(beat.children);
        //     console.log('children');
        //     console.log(children);  
            
        //     children.forEach(child => {
        //         if (child.classList.contains('sub-beat')){
        //             sub_beats_template_array.push(child);
        //         }
        //     })
        // });

        // console.log('sub_beats_template_array');
        // console.log(sub_beats_template_array);


        // var sub_beats = sub_beats.filter(function(beat){
        //     return beat.children.classList.contains('sub-beat')
        // })
        // console.log('filtered beats_as_array');
        // console.log(sub_beats);
        // console.log(beats.item(0).childNodes);
        // var beat = beats

        // beat_value_array.forEach(function(subbeat_array){
        //     subbeat_array.forEach(function(note_value){
        //         for (var i = 0; i < note_value; i++){
        //             if (i > 0){
        //                 var ele = notes_template[cursor].children;
        //                 Array.from(ele).forEach(el => el.style.display = 'none');
        //             }
        //             cursor++;
        //         }
        //     });
        // })
        let cursor = 0;
        beat_value_array.forEach(function(subbeat_array){
            subbeat_array.forEach(function(note_value){
                for (var i = 0; i < note_value; i++){
                    if (i > 0){
                        var ele = notes_of_this_beat[cursor].children;
                        Array.from(ele).forEach(el => el.style.display = 'none');
                    }
                    cursor++;
                    // if(cursor > 7){
                    //     cursor = 0;
                    // }
                }
            });
        })
    })
})


function topBeamChanger(){
    // where is starts (always 0 from now)
    
    
    // where is ends

}
