// let bar_value_array = [
//     [[3],[5]], 
//     [[2,2],[4]]
// ];
let bar_value_array = [
    [[{value: 3, rest: false}],[{value: 5, rest: false}]], 
    [[{value: 2, rest: false},{value: 2, rest: false}],[{value: 4, rest: false}]]
];
document.addEventListener("DOMContentLoaded", function(){

    // GET EVERY TEMPLATE BEAT IN THE DOM
    let template_beats = Array.from(document.querySelectorAll('.beat'));

    // FOR EACH BEAT IN THE VALUE ARRAY, USE THE INDEX OF THE LOOP TO INDENTIFY WHICH TEMPLATE BEATS IT REFERS TO
    bar_value_array.forEach(function(beat_value_array, index){
        
        // FIND THE CHILDREN OF THE IDENTIFIED TEMPLATE BEAT AND FILTER SO WE ONLY HAVE TEMPLATE SUBBEAT ELEMENTS
        template_subbeats = Array.from(template_beats[index].children).filter(function (child) {
            return child.classList.contains('sub-beat');
        })

        // CREATE EMPTY ARRAY FOR SAVING TEMPLATE NOTES
        var template_notes_of_this_beat = [];
        // LOOP THROUGH THE 2 TEMPLATE SUBBEATS, FIND THE CHILDREN, AND FILTER FOR ONLY THE TEMPLATE NOTES
        template_subbeats.forEach(child =>{
            var template_notes = Array.from(child.children).filter(child => {return child.classList.contains('note')});
            template_notes_of_this_beat.push(template_notes);
        });
        // MERGE TEMPLATE NOTES INTO ONE ARRAY
        template_notes_of_this_beat = [].concat(...template_notes_of_this_beat)

        // SET A CURSOR TO KEEP TRACK OF WHICH NOTE IN THE TEMPLATE WE ARE EDITING
        let cursor = 0;
        // ITERATE OVER EACH SUBBEAT VALUE ARRAY AND EACH NOTE VAULE WITHIN
        beat_value_array.forEach(function(subbeat_array){
            subbeat_array.forEach(function(note_obj){
                // WE CREATE A LOOP THE LENGTH OF THE CURRENT NOTE VALUE, AND USE THE VALUE OF THE CURSOR TO INDEX INTO THE TEMPLATE NOTES OF THIS BEAT TO SELECT WHICH NOTE WE WANT TO CHAGE
                // IF IT IS THE FIRST NOTE (I.E. THE VALUE OF i IS 0) WE LEAVE IT VISABLE, OTHERWISE, WE HIDE IT WITH DISPLAY = NONE
                for (var i = 0; i < note_obj['value']; i++){
                    if (i > 0){
                        var ele = template_notes_of_this_beat[cursor].children;
                        Array.from(ele).forEach(el => el.style.display = 'none');
                    }
                    cursor++;
                }
            });
        })
        // here we can determine: 
        // 1. whether the top beam is visible 
        // 2. which notes belong to this beat

        // and only here, once we have looped through both subbeat arrays, can we have all of the notes of the beat in one array
        // (the subbeat array thing will become useful when we get into 2nd and 3rd beam controls... maybe just 3rd beam controls actually)
        // so lets make a top beam handling function
                    // it needs to know:
                    // 1. if there should be a top beam at all (calc. if the first note value is bigger than 7)
                    // 2. where the top beam should start (calc. first note that is not a rest)
                    // 3. where the top beam should end (calc. the last note of the beat that isn't a rest - can use lastIndexOf )
                    // as a function... it will need all this information passed in in one go
                //     if (index === 0 && note_value > 7) {
                
                //         console.log('there should be no top beam')
                        
                    
                // }
    })
})


function topBeamChanger(){
    // where is starts (always 0 from now)
    
    
    // where is ends

}
