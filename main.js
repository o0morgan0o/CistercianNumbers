// @ts-nocheck
let count = 0;
let data;
let colors = []
let color1, color2, color3, color4, color5

let piSimple
let verticalSpace = 20
let symbolWidth = 80
let symbolHeight = 60
let horizontalSpace = 20
let maximumCanvasSize = 300

let inputNumber = ''
let inputNumberElement

let symbolsPerLine = 4
let cnv

function preload() {
    inputNumberElement = document.getElementById('number')
    inputNumber = inputNumberElement.value
    inputNumberElement.addEventListener('input', (event) => {
        console.log(event.target.value)
        inputNumber = event.target.value.toString()
        updateCanvas()
    })
}

function updateCanvas() {

    console.log('input number', inputNumber)
    let scisserionNum = new ScisserionEnsemble(inputNumber, [0, 0])
    let numberOfSymbols = scisserionNum.getNumberOfSymbols()
    console.log(numberOfSymbols, ' symbols')
    let newCanvasDimensions = determineCanvasDimensions(scisserionNum.numberOfSymbols)
    let cWidth = newCanvasDimensions[0]
    let cHeight = newCanvasDimensions[1]
    // resizeCanvas(symbolWidth * numberOfSymbols + 20, symbolHeight + 40)
    resizeCanvas(cWidth, cHeight)
    stroke(255, 255, 255)
    background('#333')
    scisserionNum.draw()

}

function determineCanvasDimensions(numberOfSymbols) {
    let newCanvasWidth
    let newCanvasHeight
    if (numberOfSymbols <= symbolsPerLine) {
        newCanvasWidth = symbolWidth * numberOfSymbols + 2 * horizontalSpace
        newCanvasHeight = symbolHeight + verticalSpace * 3
    } else if (numberOfSymbols % symbolsPerLine === 0) {
        newCanvasWidth = symbolWidth * symbolsPerLine + horizontalSpace * 2
        newCanvasHeight = (Math.trunc(numberOfSymbols / symbolsPerLine)) * symbolHeight * 1.5 + verticalSpace * 2
    } else {
        newCanvasWidth = symbolWidth * symbolsPerLine + horizontalSpace * 2
        newCanvasHeight = (Math.trunc(numberOfSymbols / symbolsPerLine) + 1) * symbolHeight * 1.5 + verticalSpace * 2
    }
    return [newCanvasWidth, newCanvasHeight]



}


function setup() {
    cnv = createCanvas(400, 400, SVG); // aspect ratio for standard printing on the CNC
    // cnv.parent('canvasParent')
    noLoop();
    strokeWeight(5)
    updateCanvas()
    // blendMode(MULTIPLY)
    stroke(0);
    noFill();

}

class ScisserionEnsemble {
    constructor(num, position) {
        this.symbolWidth = symbolWidth
        this.symbolHeight = symbolHeight
        this.position = position
        this.array = num.split('')
        this.scisserionNums = []
        this.symbolPosition = [...this.position]
        this.symbolNum = this.array.join('')
        this.numberOfSymbols = 0
        this.index = 0
        console.log('init', this.array, this.symbolNum)


        while (this.array.length > 0) {
            let numToSplice = 4
            this.numberOfSymbols++

            let scisserionNumber = this.array.splice(0, numToSplice)
            // console.log('before', scisserionNumber)
            this.scisserionNums.push(new ScisserionSymbol(scisserionNumber, [...this.symbolPosition], this.symbolWidth, this.symbolHeight, this.index))
            this.index++

        }
    }

    draw() {
        for (let i = 0; i < this.scisserionNums.length; i++) {
            this.scisserionNums[i].draw()
        }
    }
    getNumberOfSymbols() {
        return this.numberOfSymbols
    }
}



class ScisserionSymbol {

    constructor(num, position, symbolWidth, symbolHeight, index) {
        console.log(index)
        this.verticalExtension = 3
        this.index = index
        this.position = position
        // go to next line if too wide
        this.height = symbolWidth
        this.width = symbolHeight
        while (this.position[0] >= maximumCanvasSize) {
            this.position[0] -= maximumCanvasSize
            // this.position[1] += this.height + verticalSpace
        }
        this.quadran = 'ne'
        this.array = num
        // console.log('symbol :', this.array)
        while (this.array.length < 4) {
            this.array.unshift('0') // fill with zero in order to keep 42 as 0042
        }
        this.calculatePositionOfSymbol()
        // console.log('new number ', this.array)
    }
    calculatePositionOfSymbol() {
        let lineIndex = Math.trunc(this.index / symbolsPerLine)
        let columnIndex = this.index % symbolsPerLine
        console.log('position symbol', lineIndex, columnIndex)
        this.position[0] = this.position[0] + (symbolWidth * columnIndex + horizontalSpace)
        this.position[1] = this.position[1] + ((symbolHeight * 1.5) * lineIndex + verticalSpace)
    }

    draw() {
        // console.log('will draw ', this.array, 'at', this.quadran)
        for (let i = 0; i < this.array.length; i++) {
            this.num = this.array[i]
            if (i % 4 === 0) {
                this.quadran = 'sw'
            } else if (i % 4 === 1) {
                this.quadran = 'se'
            } else if (i % 4 === 2) {
                this.quadran = 'nw'
            } else if (i % 4 === 3) {
                this.quadran = 'ne'
            } else {
                throw new Error('unrecognized size of number')
            }
            this.drawQuadraticDigit()
        }
    }
    drawQuadraticDigit() {

        // we want to draw only one time ber symbol the vertical 0 bar
        if (this.quadran === 'ne') {
            push()
            translate(this.position[0] + this.width / 2, this.position[1])
            this.drawOrigin()
            pop()
        }

        push()
        translate(this.position[0] + this.width / 2, this.position[1] + this.height / 2)
        if (this.quadran === 'se' || this.quadran === 'sw')
            rotate(PI)
        // let horizonInvert = true
        let horizonInvert = false

        if (this.quadran === 'nw' || this.quadran === 'se')
            horizonInvert = true

        this.drawDigit(horizonInvert)
        pop()

    }

    drawOrigin() {
        let org = [0, 0]
        let end = [0, this.height]
        line(org[0], org[1], end[0], end[1])
    }

    drawDigit(horizonInvert) {
        switch (this.num) {
            case '0':
                break
            case '1':
                this.drawOne(horizonInvert)
                break
            case '2':
                this.drawTwo(horizonInvert)
                break
            case '3':
                this.drawThree(horizonInvert)
                break
            case '4':
                this.drawFour(horizonInvert)
                break
            case '5':
                this.drawOne(horizonInvert)
                this.drawFour(horizonInvert)
                break
            case '6':
                this.drawSix(horizonInvert)
                break
            case '7':
                this.drawOne(horizonInvert)
                this.drawSix(horizonInvert)
                break
            case '8':
                this.drawTwo(horizonInvert)
                this.drawSix(horizonInvert)
                break
            case '9':
                this.drawOne(horizonInvert)
                this.drawTwo(horizonInvert)
                this.drawSix(horizonInvert)
                break
        }
    }

    drawOne(horizonInvert) {
        let mOrigin = [0, - this.height / 2]
        let mEnd = [this.width / 2, - this.height / 2]
        if (horizonInvert === true)
            mEnd[0] *= -1
        line(mOrigin[0], mOrigin[1], mEnd[0], mEnd[1])
    }
    drawTwo(horizonInvert) {
        let mOrigin = [0, -this.height / 2 + this.height / this.verticalExtension]
        let mEnd = [this.width / 2, - this.height / 2 + this.height / this.verticalExtension]
        if (horizonInvert === true)
            mEnd[0] *= -1
        line(mOrigin[0], mOrigin[1], mEnd[0], mEnd[1])
    }
    drawThree(horizonInvert) {
        let mOrigin = [0, -this.height / 2]
        let mEnd = [this.width / 2, -this.height / 2 + this.height / this.verticalExtension]
        if (horizonInvert === true)
            mEnd[0] *= -1
        line(mOrigin[0], mOrigin[1], mEnd[0], mEnd[1])
    }
    drawFour(horizonInvert) {
        let mOrigin = [0, -this.height / 2 + this.height / this.verticalExtension]
        let mEnd = [this.width / 2, - this.height / 2]
        if (horizonInvert === true)
            mEnd[0] *= -1
        line(mOrigin[0], mOrigin[1], mEnd[0], mEnd[1])
    }
    drawSix(horizonInvert) {
        let mOrigin = [this.width / 2, -this.height / 2]
        let mEnd = [this.width / 2, -this.height / 2 + this.height / this.verticalExtension]
        if (horizonInvert === true) {

            mOrigin[0] *= -1
            mEnd[0] *= -1
        }
        line(mOrigin[0], mOrigin[1], mEnd[0], mEnd[1])

    }

}
