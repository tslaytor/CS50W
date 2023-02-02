
let bar_value_array = [
    [[{value: 4, rest: true}],[{value: 2, rest: false}, {value: 2, rest: false}]], 
    [[{value: 2, rest: false},{value: 2, rest: false}],[{value: 4, rest: false}]],
    [[{value: 4, rest: true}],[{value: 4, rest: false}]], 
    [[{value: 2, rest: false},{value: 2, rest: false}],[{value: 4, rest: false}]]
];
document.addEventListener("DOMContentLoaded", function(){
     // *************** CHANGES SOON TO HOW WE MAKE TEMPLATES? ********************************
    // GET EVERY TEMPLATE NOTE IN THE DOM AND ADD THE REST ELEMENT NEXT TO IT 
    let template_notes = Array.from(document.querySelectorAll('.note'));
    template_notes.forEach(ele => ele.innerHTML += `<img class='eighthRest' src='../../static/drum_exercises/images/EigthNoteRest.png'>`);
    // ***************************************************************************************

    // GET EVERY TEMPLATE BEAT IN THE DOM
    let template_beats = Array.from(document.querySelectorAll('.beat'));

    // FOR EACH BEAT IN THE VALUE ARRAY
    bar_value_array.forEach(function(beat_value_array, index){
        var beam_to_be_edited = getTopBeamForThisBeat(template_beats, index);
        // GET THE TEMPLATE NOTES
        var template_notes_of_this_beat = getTemplateNotesOfBeat(template_beats, index);
        var note_obj_of_this_beat = [];
        var indexs_of_non_rest_note_values = [];

        // SET A CURSOR TO KEEP TRACK OF WHICH NOTE IN THE TEMPLATE WE ARE EDITING
        let cursor = 0;
        // ITERATE OVER EACH SUBBEAT VALUE ARRAY AND EACH NOTE VAULE WITHIN
        beat_value_array.forEach(function(subbeat_value_array){
            subbeat_value_array.forEach(function(note_obj){
                 
                // WE USE THE VALUE OF THE CURSOR TO INDEX INTO THE TEMPLATE NOTES AND SELECT WHICH NOTE WE WANT TO EDIT
                // IF IT IS THE FIRST NOTE TEMPLATE NOTE OF THE LOOP WE LEAVE IT VISABLE, OTHERWISE, WE HIDE IT WITH DISPLAY = NONE
                // CREATE A LOOP THE LENGTH OF THE CURRENT NOTE VALUE,
                for (var i = 0; i < note_obj['value']; i++){
                    // IF NOTE IS A REST, HIDE ALL ELEMENTS IN THE NOTE AND DISPLAY THE REST
                    if (note_obj['rest'] === true){
                        var thisTemplateNote = template_notes_of_this_beat[cursor];
                        var ele = thisTemplateNote.children;
                        Array.from(ele).forEach(el => el.style.display = 'none');
                        thisTemplateNote.querySelector('.eighthRest').style.display = 'block';
                        
                    }
                    // OTHERWISE, SAVE THE POSITION OF THE NOTE FOR BEAM EDITING
                    else if (i === 0){
                        indexs_of_non_rest_note_values.push(cursor)
                    }

                    if (i > 0){
                        var ele = template_notes_of_this_beat[cursor].children;
                        Array.from(ele).forEach(el => el.style.display = 'none');
                    }
                    cursor++;
                }
                note_obj_of_this_beat.push(note_obj);
            });
        })
        console.log('indexs_of_non_rest_note_values');
        console.log(indexs_of_non_rest_note_values);

        topBeamEditor(indexs_of_non_rest_note_values, beam_to_be_edited);

        // to calculate where the top beam starts and ends, find the first and last note of the beat
        // var indexs_of_non_rest_note_values = [];
        // note_obj_of_this_beat.forEach(note_obj, i => {
        //     if (!note_obj['rest']){
        //         indexs_of_non_rest_note_values.push(i)
        //     }
        // })


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


function getTemplateNotesOfBeat(templateBeats, index){
    // GET THE TEMPLATE SUBBEAT ELEMENTS FOR THE IDENTIFIED TEMPLATE BEAT
        var templateSubbeats = Array.from(templateBeats[index].children).filter(function (child) {
        return child.classList.contains('sub-beat');
    })

    // CREATE EMPTY ARRAY FOR SAVING TEMPLATE NOTES
    var templateNotesOfThisBeat = [];

    // LOOP THROUGH THE 2 TEMPLATE SUBBEATS, AND GET ITS TEMPLATE NOTES
    templateSubbeats.forEach(child =>{
        var templateNotes = Array.from(child.children).filter(child => {return child.classList.contains('note')});
        templateNotesOfThisBeat.push(templateNotes);
    });
    // MERGE TEMPLATE NOTES OF THE 2 SUBBEATS INTO ONE ARRAY
    return [].concat(...templateNotesOfThisBeat)

}

function getTopBeamForThisBeat(templateBeats, index){
    // GET THE TEMPLATE SUBBEAT ELEMENTS FOR THE IDENTIFIED TEMPLATE BEAT
    var topBeam = Array.from(templateBeats[index].children).filter(function (child) {
        return child.classList.contains('top-beam');
    })
    return topBeam[0];
}

function topBeamEditor(indexs_of_non_rest_note_values, beam_to_be_edited){
    var first_and_last = [indexs_of_non_rest_note_values[0], indexs_of_non_rest_note_values[indexs_of_non_rest_note_values.length - 1]];
    beam_to_be_edited.style.width = `${(first_and_last[1] - first_and_last[0]) * 14}px`
    beam_to_be_edited.style.transform = `translateX(${first_and_last[0] * 14}px)`;
    if (first_and_last[0] === first_and_last[1]){
        beam_to_be_edited.style.width = '18px';
        beam_to_be_edited.style.transformOrigin = `${first_and_last[0] * 14}px`;
        beam_to_be_edited.style.transform = `rotateZ(45deg) translateX(${first_and_last[0] * 14}px) skew(45deg, 0deg)`
        beam_to_be_edited.style.borderRadius = '2px';
    }

    
}