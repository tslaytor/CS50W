const NOTEWIDTH = 12;

let bars = [
    { // bar
        tempo: 120,
        timeSignature: [4, 4],
        // I now know how many beats and subbeats in this bar
        beats: [
            [ // beat
                { // sub-beat 1
                    subdivision: 4,
                    notes: [{ value: 4, rest: true}] // notes
                },
                { // sub-beat 2
                    subdivision: 4,
                    notes: [{ value: 2, rest: false}, {value: 2, rest: false }] // notes
                },
            ], 
            [ // beat
                { // sub-beat 1
                    subdivision: 4,
                    notes: [{ value: 2, rest: false }, { value: 4, rest: false }] // notes
                },
                { // sub-beat 2
                    subdivision: 4,
                    notes: [{ value: 2, rest: false }] // notes
                },
            ], 
            [ // beat
                { // sub-beat 1
                    subdivision: 4,
                    notes: [{ value: 2, rest: false}, {value: 2, rest: false }] // notes
                },
                { // sub-beat 2
                    subdivision: 4,
                    notes: [{ value: 4, rest: false }] // notes
                },
            ], 
            [ // beat
                { // sub-beat 1
                    subdivision: 4,
                    notes: [{ value: 4, rest: false } ] // notes
                },
                { // sub-beat 2
                    subdivision: 4,
                    notes: [ {value: 2, rest: false}, {value: 2, rest: false} ] // notes
                },
            ]
        ]
    }
]

document.addEventListener("DOMContentLoaded", function(){

    // make a div inside container
    let newContainer = makeElement('container', document.querySelector('body'), 'div')

    bars.forEach( bar => {
        let newBar = makeElement('bar', newContainer, 'div')

        bar['beats'].forEach( beat => {
            let newBeat = makeElement('beat', newBar, 'div')

            let leftOvers = 0;
            let cursor = 0;
            let indexs_of_non_rest_note_values = [];

            beat.forEach( subbeat => {

                let subdiv = subbeat['subdivision'];
                let newSubBeat = makeElement('sub-beat', newBeat, 'div')

                subbeat['notes'].forEach( note => {
                    // add any empty notes from previous sub-beat
                    for ( var i = 0; i < leftOvers; i++ ){
                        makeElement('note', newSubBeat, 'div');
                        cursor++;
                    }
                    
                    for ( var i = 0; i < note['value'] && i < subdiv; i++ ){
                        let newNote = document.createElement('div');
                        newNote.className = 'note';
                        newSubBeat.appendChild(newNote);

                        if (i === 0) {
                            if (note['rest']){
                                makeElement('eighthRest', newNote, 'img');
                            }
                            else {
                                let newHead = document.createElement('div');
                                newHead.className = 'head';
                                let newStem = document.createElement('div');
                                newStem.className = 'stem';
                                newNote.appendChild(newHead);
                                newNote.appendChild(newStem);
                                indexs_of_non_rest_note_values.push({'cursor': cursor, 'value': note['value'], 'rest': note['rest']});
                            }
                        }
                        cursor++;
                    };
                    subdiv = subdiv - i;
                    leftOvers = note['value'] - i;
                });
                
            });
            topBeamEditor(indexs_of_non_rest_note_values, newBeat);
            middleBeamEditor(indexs_of_non_rest_note_values, newBeat);
        });    
    });    
});

// makes a div element with class name and appended to the parent
function makeElement(nameOfClass, parentElement, type) {
    let newElement = document.createElement(type);
    newElement.className = nameOfClass;
    parentElement.appendChild(newElement);

    return newElement;
}

// makes only 1 top beam per beat
function makeTopBeam(thisBeat){
    let topBeam = thisBeat.querySelector('.top-beam');
    if ( !topBeam ) {
        makeElement('top-beam', thisBeat, 'div')
    }
    return topBeam;
};

function topBeamEditor(indexs_of_non_rest_note_values, parentBeat){
    
    let non_rests = indexs_of_non_rest_note_values.filter(obj => !obj['rest'])
    let first_and_last = [non_rests[0]['cursor'], non_rests[non_rests.length - 1]['cursor']];

    for (let i = 0; i < non_rests.length; i++) {
        if (non_rests[i]['value'] < 8) {
            var topBeam = makeTopBeam(parentBeat);
        }
    }
    // EDIT THE LENGTH OF THE BEAM
    if (topBeam){
        topBeam.style.width = `${(first_and_last[1] - first_and_last[0]) * NOTEWIDTH}px`
        // EDIT WHERE THE BEAM STARTS
        topBeam.style.transform = `translateX(${first_and_last[0] * NOTEWIDTH}px)`;
        // THIS PART HANDLES FLAGS (I.E. WHEN THE BEAM DOESNT CONNECT TO ANOTHER NOTE)
        if (first_and_last[0] === first_and_last[1]){
            topBeam.style.width = '18px';
            topBeam.style.transformOrigin = `${first_and_last[0] * NOTEWIDTH}px`;
            topBeam.style.transform = `rotateZ(45deg) translateX(${first_and_last[0] * NOTEWIDTH}px) skew(45deg, 0deg)`
            topBeam.style.borderRadius = '2px';
        }
    }
}

function middleBeamEditor(indexs_of_non_rest_note_values, parentBeat){
    let non_rests = indexs_of_non_rest_note_values.filter(obj => !obj['rest'] && obj['value'] <= 2)
    let array16thPositions = [];
    let array8thAndRestPositions = [];
    let num_of_beams = 1;
    indexs_of_non_rest_note_values.forEach(function(note_obj, index){
        if (note_obj['value'] <= 2 && !note_obj['rest']){
            array16thPositions.push(note_obj['cursor']);
        }
        else if (note_obj['value'] >= 4 || note_obj['rest']){
            array8thAndRestPositions.push(note_obj['cursor']);
        }
    })

    if (array16thPositions.length === 0){
        // in this case, no beams
        return 0;
    }
    else {
        for ( let i = 0; i < array8thAndRestPositions.length; i++ ){
            if (array16thPositions[0] < array8thAndRestPositions[i] && array8thAndRestPositions[i] < array16thPositions[length - 1]){
                // num_of_beams = 2;
                // no... make 2 beams and append them to the parent
                return 2;
            }
        }
        // make one beam and postition it with the below code
        let beamToBeEdited = makeElement('middle-beam', parentBeat);
        beamToBeEdited.style.width = `${(non_rests[non_rests.length - 1]['cursor'] - non_rests[0]['cursor']) * NOTEWIDTH}px`
        beamToBeEdited.style.transform = `translateX(${non_rests[0]['cursor'] * NOTEWIDTH}px)`;
        return 1;
    }    
}
