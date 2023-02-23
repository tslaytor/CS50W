const NOTEWIDTH = 12;

let bars = [
    { // bar
        tempo: 120,
        timeSignature: [4, 4],
        // I now know how many beats and subbeats in this bar
        beats: [ 
            [  
                { subdivision: 4, notes: [ { value: 1, rest: true }, { value: 1, rest: false }, { value: 2, rest: false } ] },
                { subdivision: 4, notes: [ { value: 1, rest: false }, { value: 1, rest: false }, { value: 2, rest: false } ] }
            ], 
            [ 
                { subdivision: 4, notes: [ { value: 1, rest: false }, { value: 4, rest: true } ] },
                { subdivision: 4, notes: [ { value: 2, rest: true }, { value: 1, rest: true }  ] },
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
                { subdivision: 4, notes: [ { value: 2, rest: true }, { value: 1, rest: true }, { value: 1, rest: false } ] },
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
            let indexesOfNotes = [];
            

            beat.forEach( (subbeat, index) => {
                let indexesForBottomBeam = [];
                let cursorForBottomBeam = 0;
                let subdiv = subbeat['subdivision'];
                let newSubBeat = makeElement('sub-beat', newBeat, 'div')

                subbeat['notes'].forEach( note => {
                    // add any empty notes from previous sub-beat
                    for ( var i = 0; i < leftOvers; i++ ){
                        makeElement('note', newSubBeat, 'div');
                        cursor++;
                        cursorForBottomBeam++;
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
                            indexesOfNotes.push({ 'cursor': cursor, 'value': note['value'], 'rest': note['rest'] });
                            indexesForBottomBeam.push({ 'cursor': cursorForBottomBeam, 'value': note['value'], 'rest': note['rest'] });
                        }
                        cursor++;
                        cursorForBottomBeam++;
                    };
                    subdiv = subdiv - i;
                    leftOvers = note['value'] - i;
                });
                bottomBeamEditor(indexesForBottomBeam, newSubBeat, index);
                // i need to know if i'm in the first half or second half
            });

            topBeamEditor(indexesOfNotes, newBeat);
            middleBeamEditor(indexesOfNotes, newBeat);
            
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

function topBeamEditor(indexesOfNotes, parentBeat){
    
    let nonRests = indexesOfNotes.filter(obj => !obj['rest'])
    let firstAndLast = [nonRests[0]['cursor'], nonRests[nonRests.length - 1]['cursor']];

    for (let i = 0; i < nonRests.length; i++) {
        if (nonRests[i]['value'] < 8) {
            var topBeam = parentBeat.querySelector('.top-beam');
            if ( !topBeam ) {
                topBeam = makeElement('top-beam', parentBeat, 'div');
                break;
            }
        }
    }
    // EDIT THE LENGTH OF THE BEAM
    if (topBeam){
        topBeam.style.width = `${(firstAndLast[1] - firstAndLast[0]) * NOTEWIDTH}px`
        // EDIT WHERE THE BEAM STARTS
        topBeam.style.transform = `translateX(${firstAndLast[0] * NOTEWIDTH}px)`;
        // THIS PART HANDLES FLAGS (I.E. WHEN THE BEAM DOESNT CONNECT TO ANOTHER NOTE)
        if (firstAndLast[0] === firstAndLast[1]){
            topBeam.style.width = '18px';
            topBeam.style.borderTop = '5px black solid';
            topBeam.style.transformOrigin = `${firstAndLast[0] * NOTEWIDTH}px`;
            topBeam.style.transform = `rotateZ(45deg) translateX(${firstAndLast[0] * NOTEWIDTH}px) skew(45deg, 0deg)`
            topBeam.style.borderRadius = '2px';
        }
    }
}

function middleBeamEditor(indexesOfNotes, parentBeat){
    let nonRests =  indexesOfNotes.filter(obj => !obj[ 'rest' ] );
    let nonRest16thsOrLess = nonRests.filter(obj => obj[ 'value' ] <= 2 );

    let array16thPositions = [];
    let array8thAndRestPositions = [];

    let count = 0;
    let firstGroup = 0;
    let secondGroup = 0;

    indexesOfNotes.forEach(function(noteObj){
        if (noteObj[ 'value' ] <= 2 && !noteObj[ 'rest' ]){
            // so...here... im just making an array of indices
            array16thPositions.push(noteObj['cursor']);
            count++;
        }
        else if (noteObj[ 'value' ] >= 4 || noteObj[ 'rest' ]){
            // and here too... why am I filtering these data?
            array8thAndRestPositions.push(noteObj[ 'cursor' ]);
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
        if ( nonRests.length === 1){
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

function bottomBeamEditor(indexesOfNotes, parentBeat, index){

    console.log('this in subbeat: ' + index);

    let nonRests = indexesOfNotes.filter( obj => !obj[ 'rest' ] );
    let nonRest32nds = nonRests.filter( obj => obj[ 'value' ] <= 1 );

    console.log('nonrest.length = ' + nonRests.length)

    let array32ndPositions = [];
    let array8thAndRestPositions = [];

    let count = 0;
    let firstGroup = 0;
    
    let secondGroup = 0;

    indexesOfNotes.forEach(function(noteObj){
        if (noteObj['value'] <= 1 && !noteObj['rest']){
            // so...here... im just making an array of indices
            array32ndPositions.push(noteObj['cursor']);
            count++;
        }
        else if (noteObj['value'] >= 4 || noteObj['rest']){
            // and here too... why am I filtering these data?
            array8thAndRestPositions.push(noteObj['cursor']);
            firstGroup = count;
            count = 0;
        }
    })
    secondGroup = count;

    if (array32ndPositions.length === 0){
        // in this case, no beams - im filtering to make this check... can I do it another way? Do I want to?
        return 0;
    }
    else if (firstGroup > 0 && secondGroup > 0){
        let firstBeam = makeElement('bottom-beam', parentBeat, 'div');
        let secondBeam = makeElement('bottom-beam', parentBeat, 'div');

        firstBeam.style.width = `${firstGroup * NOTEWIDTH}px`;
        firstBeam.style.transform = `translateX(${nonRest32nds[0]['cursor'] * NOTEWIDTH}px)`;
        
        secondBeam.style.width = `${secondGroup * NOTEWIDTH}px`;
        if ( nonRests.length === 1 ) {
            secondBeam.style.transform = `translateX(${nonRest32nds[nonRest32nds.length - 1]['cursor'] * NOTEWIDTH - NOTEWIDTH}px)`;
        }
        else {
            // translate to the first note of the last group
            secondBeam.style.transform = `translateX(${nonRest32nds[nonRest32nds.length - 1]['cursor'] * NOTEWIDTH - secondGroup * NOTEWIDTH}px)`;
        }
        return 2;
    }
    else {
        let bottomBeam = makeElement('bottom-beam', parentBeat, 'div');

        // console.dir('nonrest.length = ' + nonRests.length)
        // here... i don't really wat to check the length of nonrests, because it only checks one half of the beat at a time *** 
        // I need to know if its the only non-rest note in the whole beat
        if ( nonRests.length === 1){
            bottomBeam.style.width = '18px';
            bottomBeam.style.borderTop = '5px black solid';
            bottomBeam.style.transformOrigin = `${nonRest32nds[0]['cursor'] * NOTEWIDTH}px`;
            bottomBeam.style.transform = `rotateZ(45deg) translateX(${nonRest32nds[0]['cursor'] * NOTEWIDTH}px) skew(45deg, 0deg)`
            bottomBeam.style.borderRadius = '2px';
        }
        // I want to know
        else if ( nonRest32nds[nonRest32nds.length - 1]['cursor'] === nonRest32nds[0]['cursor'] ){
            bottomBeam.style.width = `${ 0.5 * NOTEWIDTH }px`
            bottomBeam.style.transform = `translateX(${ NOTEWIDTH }px)`;
        }
        else {
            bottomBeam.style.width = `${(nonRest32nds[nonRest32nds.length - 1]['cursor'] - nonRest32nds[0]['cursor']) * NOTEWIDTH}px`
            bottomBeam.style.transform = `translateX(${nonRest32nds[0]['cursor'] * NOTEWIDTH}px)`;
        }
        return 1;
    }    
}
