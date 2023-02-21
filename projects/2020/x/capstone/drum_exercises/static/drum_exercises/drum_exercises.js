const NOTEWIDTH = 12;

let bars = [
    { // bar
        tempo: 120,
        timeSignature: [4, 4],
        // I now know how many beats and subbeats in this bar
        beats: [ 
            [  
                { subdivision: 4, notes: [ { value: 2, rest: false }, { value: 2, rest: true } ] },
                { subdivision: 4, notes: [ { value: 2, rest: true }, { value: 2, rest: true } ] },
            ], 
            [ 
                { subdivision: 4, notes: [ { value: 2, rest: false }, { value: 4, rest: false } ] },
                { subdivision: 4, notes: [ { value: 2, rest: false } ] },
            ], 
            [ 
                { subdivision: 4, notes: [ { value: 2, rest: false }, { value: 2, rest: false } ] },
                { subdivision: 4, notes: [ { value: 4, rest: false } ] },
            ], 
            [ 
                { subdivision: 4, notes: [ { value: 4, rest: false } ] },
                { subdivision: 4, notes: [ { value: 2, rest: false }, { value: 2, rest: false } ] },
            ]
        ]
    },
    { // bar
        tempo: 120,
        timeSignature: [4, 4],
        // I now know how many beats and subbeats in this bar
        beats: [ 
            [  
                { subdivision: 4, notes: [ { value: 2, rest: true }, { value: 2, rest: false } ] },
                { subdivision: 4, notes: [ { value: 2, rest: false }, { value: 2, rest: false } ] },
            ], 
            [ 
                { subdivision: 4, notes: [ { value: 2, rest: false }, { value: 4, rest: true } ] },
                { subdivision: 4, notes: [ { value: 2, rest: false } ] },
            ], 
            [ 
                { subdivision: 4, notes: [ { value: 2, rest: false }, { value: 2, rest: false } ] },
                { subdivision: 4, notes: [ { value: 4, rest: true } ] },
            ], 
            [ 
                { subdivision: 4, notes: [ { value: 2, rest: false }, { value: 2, rest: true } ] },
                { subdivision: 4, notes: [ { value: 2, rest: true }, { value: 2, rest: false } ] },
            ]
        ]
    }
]

document.addEventListener("DOMContentLoaded", function(){

    // make a div inside container
    let newContainer = makeElement('container', document.querySelector('body'), 'div')

    bars.forEach( bar => {
        let newBar = makeElement('bar', newContainer, 'div')

        let barLines = makeElement('bar-line', newBar, 'div')

        bar['beats'].forEach( beat => {
            let newBeat = makeElement('beat', newBar, 'div')

            let leftOvers = 0;
            let cursor = 0;
            let indexs_of_notes = [];

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
                                
                                if (note['value'] <= 2 ) {
                                    makeElement('sixteenthRest', newNote, 'img');
                                }
                                else if (note['value'] <= 4) {
                                    makeElement('eighthRest', newNote, 'img');
                                }
                                
                            }
                            else {
                                let newHead = document.createElement('div');
                                newHead.className = 'head';
                                let newStem = document.createElement('div');
                                newStem.className = 'stem';
                                newNote.appendChild(newHead);
                                newNote.appendChild(newStem);
                            }
                            indexs_of_notes.push({ 'cursor': cursor, 'value': note['value'], 'rest': note['rest'] });
                        }
                        cursor++;
                    };
                    subdiv = subdiv - i;
                    leftOvers = note['value'] - i;
                });
                
            });
            topBeamEditor(indexs_of_notes, newBeat);
            middleBeamEditor(indexs_of_notes, newBeat);
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

function topBeamEditor(indexs_of_notes, parentBeat){
    
    let non_rests = indexs_of_notes.filter(obj => !obj['rest'])
    let first_and_last = [non_rests[0]['cursor'], non_rests[non_rests.length - 1]['cursor']];

    for (let i = 0; i < non_rests.length; i++) {
        if (non_rests[i]['value'] < 8) {
            var topBeam = parentBeat.querySelector('.top-beam');
            if ( !topBeam ) {
                topBeam = makeElement('top-beam', parentBeat, 'div');
                break;
            }
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
            topBeam.style.borderTop = '5px black solid';
            topBeam.style.transformOrigin = `${first_and_last[0] * NOTEWIDTH}px`;
            topBeam.style.transform = `rotateZ(45deg) translateX(${first_and_last[0] * NOTEWIDTH}px) skew(45deg, 0deg)`
            topBeam.style.borderRadius = '2px';
        }
    }
}

function middleBeamEditor(indexs_of_notes, parentBeat){
    let nonRest16thsOrLess = indexs_of_notes.filter(obj => !obj['rest'] && obj['value'] <= 2)

    let array16thPositions = [];
    let array8thAndRestPositions = [];

    let count = 0;
    let firstGroup = 0;
    let secondGroup = 0;

    indexs_of_notes.forEach(function(note_obj, index){
        if (note_obj['value'] <= 2 && !note_obj['rest']){
            // so...here... im just making an array of indices
            array16thPositions.push(note_obj['cursor']);
            count++;
        }
        else if (note_obj['value'] >= 4 || note_obj['rest']){
            // and here too... why am I filtering these data?
            array8thAndRestPositions.push(note_obj['cursor']);
            firstGroup = count;
            count = 0;
        }
    })
    secondGroup = count;

    if (array16thPositions.length === 0){
        // in this case, no beams - im filtering to make this check... can I do it another way? Do I want to?
        return 0;
    }
    else if (firstGroup > 0 && secondGroup > 0){
        let firstBeam = makeElement('middle-beam', parentBeat, 'div');
        let secondBeam = makeElement('middle-beam', parentBeat, 'div');

        firstBeam.style.width = `${firstGroup * NOTEWIDTH}px`;
        firstBeam.style.transform = `translateX(${nonRest16thsOrLess[0]['cursor'] * NOTEWIDTH}px)`;
        
        secondBeam.style.width = `${secondGroup * NOTEWIDTH}px`;
        // only do this if the secondGroup > 1
        if ( secondGroup === 1 ) {
            secondBeam.style.transform = `translateX(${nonRest16thsOrLess[nonRest16thsOrLess.length - 1]['cursor'] * NOTEWIDTH - NOTEWIDTH}px)`;
        }
        else {
            // translate to the first note of the last group
            secondBeam.style.transform = `translateX(${nonRest16thsOrLess[nonRest16thsOrLess.length - 1]['cursor'] * NOTEWIDTH - secondGroup * NOTEWIDTH}px)`;
        }
        

        return 2;
    }
    else {
        let middleBeam = makeElement('middle-beam', parentBeat, 'div');
        if ( array16thPositions.length === 1){
            // OK, not nonRest16ths then... in the top beam function this is called first and last
            middleBeam.style.width = '18px';
            middleBeam.style.borderTop = '5px black solid';
            middleBeam.style.transformOrigin = `${nonRest16thsOrLess[0]['cursor'] * NOTEWIDTH}px`;
            middleBeam.style.transform = `rotateZ(45deg) translateX(${nonRest16thsOrLess[0]['cursor'] * NOTEWIDTH}px) skew(45deg, 0deg)`
            middleBeam.style.borderRadius = '2px';
        }
        else {
            middleBeam.style.width = `${(nonRest16thsOrLess[nonRest16thsOrLess.length - 1]['cursor'] - nonRest16thsOrLess[0]['cursor']) * NOTEWIDTH}px`
            middleBeam.style.transform = `translateX(${nonRest16thsOrLess[0]['cursor'] * NOTEWIDTH}px)`;
        }
        
        return 1;
    }    
}
