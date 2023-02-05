
let bar_value_array = [
    [[{value: 4, rest: true}],[{value: 4, rest: false}]], 
    [[{value: 2, rest: false},{value: 4, rest: false}],[{value: 2, rest: false}]],
    [[{value: 4, rest: true}],[{value: 4, rest: false}]], 
    [[{value: 2, rest: false},{value: 2, rest: false}],[{value: 4, rest: false}]],
    [[{value: 2, rest: false}, {value: 2, rest: false}],[{value: 2, rest: false}, {value: 2, rest: false}]],
    [[{value: 2, rest: false}, {value: 2, rest: false}],[{value: 4, rest: true}]]
    
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
                    if (i === 0){
                        indexs_of_non_rest_note_values.push({'cursor': cursor, 'value': note_obj['value'], 'rest': note_obj['rest']});
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
        // console.log('note_obj_of_this_beat');
        // console.log(note_obj_of_this_beat);



        var top_beam_to_be_edited = getBeamForThisBeat(template_beats, index, 'top-beam');
        topBeamEditor(indexs_of_non_rest_note_values, top_beam_to_be_edited);

        var middle_beam_to_be_edited = getBeamForThisBeat(template_beats, index, 'middle-beam');

                // I CAN CHECK HOW MANY MIDDLE BEAMS ON THIS BEAT WITH THE NOTE OBJ OF THIS BEAT ARRAY
        // IF THERE ARE AT LEAST 2 PLAYED NOTES WITH A VALUE OF 16TH (2) OR LESS 
        // AND THAT HAS ANY REST IN BETWEEN THEM, OR A PLAYED NOTE WITH A VALUE OF 8TH (4) OR GREATER
        var x = middleBeamEditor(indexs_of_non_rest_note_values, middle_beam_to_be_edited);
        console.log('how many beams?');
        console.log(x);

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

function getBeamForThisBeat(templateBeats, index, beamName){
    // GET THE TEMPLATE SUBBEAT ELEMENTS FOR THE IDENTIFIED TEMPLATE BEAT
    var beam = Array.from(templateBeats[index].children).filter(function (child) {
        return child.classList.contains(beamName);
    })
    return beam[0];
}

function topBeamEditor(indexs_of_non_rest_note_values, beam_to_be_edited){
    let non_rests = indexs_of_non_rest_note_values.filter(obj => !obj['rest'])
    var first_and_last = [non_rests[0]['cursor'], non_rests[non_rests.length - 1]['cursor']];
    // EDIT THE LENGTH OF THE BEAM
    beam_to_be_edited.style.width = `${(first_and_last[1] - first_and_last[0]) * 14}px`
    // EDIT WHERE THE BEAM STARTS
    beam_to_be_edited.style.transform = `translateX(${first_and_last[0] * 14}px)`;
    // THIS PART HANDLES FLAGS (I.E. WHEN THE BEAM DOESNT CONNECT TO ANOTHER NOTE)
    if (first_and_last[0] === first_and_last[1]){
        beam_to_be_edited.style.width = '18px';
        beam_to_be_edited.style.transformOrigin = `${first_and_last[0] * 14}px`;
        beam_to_be_edited.style.transform = `rotateZ(45deg) translateX(${first_and_last[0] * 14}px) skew(45deg, 0deg)`
        beam_to_be_edited.style.borderRadius = '2px';
    }
}

// I THINK I NEED TO PASS THE BEAM TO BE EDITED
function middleBeamEditor(indexs_of_non_rest_note_values, beamToBeEdited){
    let non_rests = indexs_of_non_rest_note_values.filter(obj => !obj['rest'] && obj['value'] <= 2)
    console.log('non_rests', non_rests)
    var array16thPositions = [];
    var array8thAndRestPositions = [];
    var num_of_beams = 1;
    indexs_of_non_rest_note_values.forEach(function(note_obj, index){
        if (note_obj['value'] <= 2 && !note_obj['rest']){
            array16thPositions.push(note_obj['cursor']);
        }
        // ******************************** I'M' CHECKING FOR REST VALUES HERE... BUT THE VARIABLE IS ..
        // CALLED "InDExEs oF Non-ResT nOtE vAlUeS" ******************************************************
        else if (note_obj['value'] >= 4 || note_obj['rest']){
            array8thAndRestPositions.push(note_obj['cursor']);
        }
    })
    let length = array16thPositions.length;
    if (length === 0){
        num_of_beams = 0;
        // in this case, I need to hide the beam
        beamToBeEdited.style.display = 'none';
        return num_of_beams;
    }
    else {
        for(var i = 0; i < array8thAndRestPositions.length; i++){
            if (array16thPositions[0] < array8thAndRestPositions[i] && array8thAndRestPositions[i] < array16thPositions[length - 1]){
                // in this case I need to make a new beam 
                // and then break
                num_of_beams = 2;
            }
        }
        // here, I need to move the existing beam to the right position
        // I need the index of 16th note of less values
        console.log('beamToBeEdited: ')
        console.log(beamToBeEdited)
        console.log('${(non_rests[non_rests.length - 1] - non_rests[0]) * 14}px');
        console.log(non_rests[non_rests.length - 1], non_rests[0])
        beamToBeEdited.style.width = `${(non_rests[non_rests.length - 1]['cursor'] - non_rests[0]['cursor']) * 14}px`

        return num_of_beams;
    }
    
}
