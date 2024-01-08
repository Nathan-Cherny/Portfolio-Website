// thanks to nandgame.com for teaching me all of this

class Gate{
    constructor(name, logic){
        this.name = name; // name of gate
        this.logic = logic // actual wiring of the gate
    }
}

function convertBoolToInt(list_){ // better to have 1's and 0's rather than true's and false's for numbers. this function does that.
    converted = []
    for(val of list_){
        if(val){
            converted.push(1)
        }
        else{
            converted.push(0)
        }
    }
    return converted
}

nandCounter = 0

nand = new Gate("nand", function(a, b){ // start with nand (not and), build everything from this
    nandCounter += 1
    return !(a && b)                    // this is the only time i use javascript logic functions here! (+, !)
})

not = new Gate("not", function(a){ // invert the input
    return nand.logic(a, a) // two 0's become 1 and two 1's become 0.
})

and = new Gate("and", function(a, b){ // first double line gate, essentially just a double negative and
    c = nand.logic(a, b)
    return not.logic(c)
})

or = new Gate("or", function(a, b){ // by inverting both inputs then putting it into nand,
                                    // output is only 0 when both a and b are off - or!
    a = not.logic(a)
    b = not.logic(b)
    return nand.logic(a, b)
})

xor = new Gate("xor", function(a, b){ // xor outputs 1 when the inputs are not the same
    a1 = or.logic(a, b) // if at least one of them are one
    b1 = nand.logic(a, b) // and BOTH of them aren't 1
    return and.logic(a1, b1) // then we return 1
})

// fundamental gates down only using nand! moving onto basic arithmetic

halfAdder = new Gate("Half Adder", function(a, b){ // a half adder returns the addition of two bits
    let output = [0, 0] // addition of two bits requires two outputs (we're working in binary now!)

    // work the first bit
    c1 = and.logic(a, b) // if my math is right, 1 + 1 = 2, so if both are on (1 + 1) the first bit has to be 1 (2 = 1, 0)

    // work the second bit
    c2 = xor.logic(a, b) // in cases where both are the same (0 + 0), 
                         //(1 + 1) the last bit is always 0, the opposite is true when only 1 is on

    // wire to the outputs
    output[0] = c1
    output[1] = c2

    return output // this is effectively the "actual counting" of the entire calculator!
})

fullAdder = new Gate("Full Adder", function(a, b, c){ // this adds three bits
    let output = [0, 0] // two outputs
    
    ha1 = halfAdder.logic(a, b) // add two bits
    ha2 = halfAdder.logic(ha1[1], c) // take the results lower bit to the carry input
    ha3 = halfAdder.logic(ha1[0], ha2[0]) // take the higher bits and add them

    output[0] = ha3[1] // the lower bit is always the sum, so for the sum of the higher bits, we output that in the output's high bit
    output[1] = ha2[1] // same for the lower bit

    return output
})

fourBitAdder = new Gate("4 Bit Adder", function(nibble1, nibble2, c){ // now we're going to combine 2 four bit numbers (nibbles) together.
    let output = [0, 0, 0, 0, 0] // this now requires 5 outputs

    fa3 = fullAdder.logic(nibble1[3], nibble2[3], c)        // the strategy here is to link four fulladders together, one for each bit.
    fa2 = fullAdder.logic(nibble1[2], nibble2[2], fa3[0])   // each full adder takes one bit from the same index from both and, as like
    fa1 = fullAdder.logic(nibble1[1], nibble2[1], fa2[0])   // earlier, the lower bit is the sum of those two, so we output that result to
    fa0 = fullAdder.logic(nibble1[0], nibble2[0], fa1[0])   // the corresponding bit.
                                                            // the carry output is sent through all of the adders (like how carrying is
                                                            // done when you do math on paper, you send it through all of the bits until
                                                            // it reaches the end) in which it becomes the very last bit.
    output[0] = fa0[0]
    output[1] = fa0[1]
    output[2] = fa1[1]
    output[3] = fa2[1]
    output[4] = fa3[1]

    return output
})

eightBitAdder = new Gate("8 Bit Adder", function(byte1, byte2, c){ // this just expands the four bit algorithm, same thing
    let output = [0, 0, 0, 0, 0, 0, 0, 0, 0]

    let mid = byte1.length / 2

    lower4bAdder = fourBitAdder.logic(byte1.slice(mid), byte2.slice(mid), c) // using .slice now because the lists are getting longer
    higher4bAdder = fourBitAdder.logic(byte1.slice(0, mid), byte2.slice(0, mid), lower4bAdder[0])

    output[0] = higher4bAdder[0] // these wirings also follow a set pattern - the first bit (the carry) is the very
    output[1] = higher4bAdder[1] // very first output of the higher bit adder, and then because we use the carry output
    output[2] = higher4bAdder[2] // from the lower bit adder for the higher bit adder, we use all the remaining outputs
    output[3] = higher4bAdder[3] // of the lower bit adder for our lower bits here.
    output[4] = higher4bAdder[4]
    output[5] = lower4bAdder[1]
    output[6] = lower4bAdder[2]
    output[7] = lower4bAdder[3]
    output[8] = lower4bAdder[4]

    return output
})

function wireToOutput(lower, higher, output){ // replicates the wiring process just for sanity
    i = 0
    while(output.length > i){
        if(i < higher.length){

            output[i] = higher[i]
        }
        else{
            output[i] = lower[(i - higher.length) + 1]
        }
        i+=1
    }
    return output
}

function createList(n){
    let rtrn = []
    while(n > 0){
        n -= 1
        rtrn.push(0)
    }
    return rtrn
}

sixteenBitAdder = new Gate("16 Bit Adder", function(dbyte1, dbyte2, c){ // at this point we're just looping the algorithm to work with bigger numbers.
    let output = createList(17)

    let mid = dbyte1.length / 2

    lower8bAdder = eightBitAdder.logic(dbyte1.slice(mid), dbyte2.slice(mid), c)
    higher8bAdder = eightBitAdder.logic(dbyte1.slice(0, mid), dbyte2.slice(0, mid), lower8bAdder[0])

    wireToOutput(lower8bAdder, higher8bAdder, output)

    return output
})

thirtytwoBitAdder = new Gate("32 Bit Adder", function(word1, word2, c){ // i think about 8 billion is enough.
    let output = createList(33)

    let mid = word1.length / 2

    lower16bAdder = sixteenBitAdder.logic(word1.slice(mid), word2.slice(mid), c)
    higher16bAdder = sixteenBitAdder.logic(word1.slice(0, mid), word2.slice(0, mid), lower16bAdder[0])

    wireToOutput(lower16bAdder, higher16bAdder, output)

    return output
})

// we now have the ability to add thirty two bit numbers together, but we need to subtract them as well

thirtyTwoBitAdderSubtractor = new Gate("32 Bit Adder/Subtractor", function(word1, word2, subtract){
    let newWord2 = [                        // subtraction works by taking the second number and inversing all of the
        xor.logic(word2[0], subtract),      // bits, then adding one. this works because, by inversing the bits, you
        xor.logic(word2[1], subtract),      // essentially make the number negative - the twos complement. so instead
        xor.logic(word2[2], subtract),      // of 4 + 4, you get 4 + (-4), which is the same as 4 - 4. the result is
        xor.logic(word2[3], subtract),      // similarly changed. since subtracting numbers won't ever get you over
        xor.logic(word2[4], subtract),      // 2^32, the very first bit is now an indicator of if the result is negative
        xor.logic(word2[5], subtract),      // or positive. if the result is 0, its negative, and if its 1, its positive. 
        xor.logic(word2[6], subtract),      // however, if the result is negative, we have to inverse the result back
        xor.logic(word2[7], subtract),      // because of how twos complement works.
        xor.logic(word2[8], subtract),
        xor.logic(word2[9], subtract),
        xor.logic(word2[10], subtract),
        xor.logic(word2[11], subtract),
        xor.logic(word2[12], subtract),
        xor.logic(word2[13], subtract),
        xor.logic(word2[14], subtract),
        xor.logic(word2[15], subtract),
        xor.logic(word2[16], subtract),
        xor.logic(word2[17], subtract),
        xor.logic(word2[18], subtract),
        xor.logic(word2[19], subtract),
        xor.logic(word2[20], subtract),
        xor.logic(word2[21], subtract),
        xor.logic(word2[22], subtract),
        xor.logic(word2[23], subtract),
        xor.logic(word2[24], subtract),
        xor.logic(word2[25], subtract),
        xor.logic(word2[26], subtract),
        xor.logic(word2[27], subtract),
        xor.logic(word2[28], subtract),
        xor.logic(word2[29], subtract),
        xor.logic(word2[30], subtract),
        xor.logic(word2[31], subtract),
    ]

    return thirtytwoBitAdder.logic(word1, newWord2, subtract)
})

function twoComplement(number){
    subtract = 1
    let word2 = number.slice(1)
    let newWord2 = [
        xor.logic(word2[0], subtract),
        xor.logic(word2[1], subtract),
        xor.logic(word2[2], subtract),
        xor.logic(word2[3], subtract),
        xor.logic(word2[4], subtract),
        xor.logic(word2[5], subtract),
        xor.logic(word2[6], subtract),
        xor.logic(word2[7], subtract),
        xor.logic(word2[8], subtract),
        xor.logic(word2[9], subtract),
        xor.logic(word2[10], subtract),
        xor.logic(word2[11], subtract),
        xor.logic(word2[12], subtract),
        xor.logic(word2[13], subtract),
        xor.logic(word2[14], subtract),
        xor.logic(word2[15], subtract),
        xor.logic(word2[16], subtract),
        xor.logic(word2[17], subtract),
        xor.logic(word2[18], subtract),
        xor.logic(word2[19], subtract),
        xor.logic(word2[20], subtract),
        xor.logic(word2[21], subtract),
        xor.logic(word2[22], subtract),
        xor.logic(word2[23], subtract),
        xor.logic(word2[24], subtract),
        xor.logic(word2[25], subtract),
        xor.logic(word2[26], subtract),
        xor.logic(word2[27], subtract),
        xor.logic(word2[28], subtract),
        xor.logic(word2[29], subtract),
        xor.logic(word2[30], subtract),
        xor.logic(word2[31], subtract),
    ]
    return convertBoolToInt(thirtytwoBitAdder.logic(newWord2, createList(32), 1))
}

// html stuff

function binaryToDecimal(binary){
    return parseInt(binary.join(""), 2)
}

function calculateAnswer(){ // this function parses the data given by the buttons and sends it to the js function
    
    // get the binary representations (and the subtract signal)
    let binaryContainers = document.getElementsByClassName("32bit")
    let subtract = document.getElementById("subtract").checked
    let signal = []
    
    for(container of binaryContainers){
        signal.push(getBinary(container))
    }
    signal.push(subtract)

    let trueFalseAnswer = thirtyTwoBitAdderSubtractor.logic(signal[0], signal[1], signal[2])
    let binaryAnswer = convertBoolToBin(trueFalseAnswer)

    // checking for negative numbers (using the carry output) algorithm is talked about in js
    if(signal[2]){
        isPositive = binaryAnswer[0]
        if(isPositive){
            binAnswer = binaryAnswer.slice(0, 1) + " " + binaryAnswer.slice(1).join("")
            decAnswer = binaryToDecimal(binaryAnswer.slice(1))
        }
        else{
            binaryAnswer = twoComplement(binaryAnswer)
            binAnswer = binaryAnswer.slice(0, 1) + " " + binaryAnswer.slice(1).join("")
            decAnswer = "-" + binaryToDecimal(binaryAnswer.slice(1))
        }
    }
    else{
        decAnswer = binaryToDecimal(binaryAnswer)
        binAnswer = binaryAnswer.join("")
    }

    // outputting answer
    document.getElementById("decAnswer").innerHTML = decAnswer
    document.getElementById("binAnswer").innerHTML = binAnswer
}

// various helper functions for quality of life and smaller necessary details

function convertBoolToBin(boolBinaryNumber){
    let binaryAnswer = []

    for(val of boolBinaryNumber){
        binaryAnswer.push(val ? 1 : 0)
    }

    return binaryAnswer
}

function changeCalcButtonEquation(){
    let button = document.getElementById("calcButton")
    let buttonText = "Calculate: "
    let decNumbers = document.getElementsByClassName("32toDecimal")
    let operation = document.getElementById("subtract").checked ? "-" : "+"
    
    buttonText = buttonText + decNumbers[0].innerHTML + " " + operation + " " + decNumbers[1].innerHTML
    button.innerHTML = buttonText
}

function getBinary(container){
    let binary = []
    for(checkbox of container.children){
        binary.push(Number(checkbox.checked))
    }
    return binary
}

function createThirtyTwoBitInput(){ // creating the GUI
    let thirtytwoBit = document.getElementsByClassName("32bit")
    for(input of thirtytwoBit){
        for(let i = 0; i < 32; i+=1){
            let checkbox = document.createElement("input")
            checkbox.type = "checkbox"
            input.appendChild(checkbox)
        }
        input.onchange = function(){
            // set the text in the individual divs to be the new decimal number
            decimalNumber = binaryToDecimal(getBinary(this))
            this.nextSibling.nextSibling.innerHTML = decimalNumber

            // update the equation in the button:
            changeCalcButtonEquation()
        }
    }
}

function createCalculator(){
    createThirtyTwoBitInput()
    calculateAnswer() // calculate answer just so the button says 0+0=0
}