// the goal of this project will be to simulate an ecosystem with a key predator species and a key prey species.
// this project is inspired by Sebastian Lague's Bunny and Fox ecosystem: https://www.youtube.com/watch?v=r_It_X7v-1E
// ultimately the end result of the project is equilibrum with the shark and fish population, as well as some evolutions
// that develop as survival of the fittest plays out.

function randint(min, max){
    return min + (Math.floor(Math.random() * (max - min + 1)))
}

function randchoice(list_){
    let index = randint(0, list_.length-1)
    return list_[index]
}

class Animal{ // designing the base class for the sharks and the fish
    static speedRange = [0, 0]
    static metabolismRange = [0, 0]
    static matingDesireRange = [0, 0]
    constructor(parent1, parent2, ){
        // base variables, always set to zero
        this.hunger = 0 // animals need to eat to survive
        this.reproduction = 0 // when this reaches 100 they'll start looking for a mate
        this.age = 0 // just to keep track

        // genes
        if (parent1 == undefined){
            this.speed = randint(Animal.speedRange[0], Animal.speedRange[1])
            this.metabolism = randint(Animal.metabolismRange[0], Animal.metabolismRange[1]) // the lower the number, the slower you get hungry
            this.matingDesire = randint(Animal.matingDesireRange[0], Animal.matingDesireRange[1]) // the higher the number, the faster reproduction hits 100
        }
        else{
            this.speed = Math.trunc((parent1.speed + parent2.speed)/2)
            this.metabolism = (Math.trunc((parent1.metabolism + parent2.metabolism)/2))
            this.matingDesire = Math.trunc((parent1.matingDesire + parent2.matingDesire)/2)
        }
    }

    updateSelf(){
        this.age += 1
        this.hunger += this.metabolism
        this.reproduction += this.matingDesire
    }
    
    checkSelf(){
        if(this.hunger >= 100){ //
            this.die()
            return
        }
        if(this.hunger > this.constructor.gluttony){ 
            this.searchForFood()
        }
        if(this.reproduction >= 100){
            this.tryToFindMate()
        }
    }

    reproduce(other){
        other.reproduction = 0
        this.reproduction = 0
        new this.constructor(this, other)
    }

    tryToFindMate(){
        if(this.constructor.all.length <= 1){
            return // can't look for a mate if you're the only one alive. sad.
        }

        let attempts = 10 // could add like a gene for like determination
        while(attempts > 0){
            let randomMember = randchoice(this.constructor.all)
            if(randomMember != this && randomMember.reproduction >= 100){
                this.reproduce(randomMember)
            }
            attempts -= 1
        }
    }

    die(){
        let index = this.constructor.all.indexOf(this)
        this.constructor.all.splice(index, 1)
        delete this
    }

    update(){
        this.updateSelf()
        this.checkSelf()
    }
}

class Fish extends Animal{ // Fish will act as the prey
    static all = [] // list of all the fish
    static gluttony = 10 // how hungry they have to be to start eating
     constructor(parent1, parent2){
        super(parent1, parent2)
        Fish.all.push(this)
    }

    eat(plant){
        this.hunger -= plant.calories
        plant.beEaten()
    }

    searchForFood(){
        if(Plant.all.length <= 0){return}
        let chosenPlant = randchoice(Plant.all)
        this.eat(chosenPlant)
    }
}

class Shark extends Animal{ // shark will act as top predator
    static all = [] // list of all the sharks
    static gluttony = 50 // how hungry they have to be to start eating
    constructor(parent1, parent2){
        super(parent1, parent2)
        Shark.all.push(this)
    }

    eat(fish){
        this.hunger -= (100 - fish.hunger)
        fish.die()
    }

    searchForFood(){
        if(Fish.all.length <= 0){return}
        let chosenFish = randchoice(Fish.all)
        if(this.speed >= chosenFish.speed){
            this.eat(chosenFish)
        }        
    }
}

class Plant{ // this will act as the food for the fish to eat
    static all = []
    static growth = 0
    static calorieRange = [0, 0]
    constructor(calories=randint(Plant.calorieRange[0], Plant.calorieRange[1])){
        this.calories = calories
        this.age = 0
        Plant.all.push(this)
    }

    static spread(){
        let newPlants = Plant.all.length / Plant.growth
        while(newPlants > 0){
            new Plant()
            newPlants -= 1
        }
    }

    beEaten(){
        let index = this.constructor.all.indexOf(this)
        this.constructor.all.splice(index, 1)
        delete this
    }

    update(){
        this.age += 1
    }
    
}

class Game{ // this is the central class that works everything
    constructor({fish=100, sharks=10, plants=50, endGeneration=500, plantCalories = [1, 100], plantGrowth=2,
        speedRange = [1, 100], metabolismRange=[10, 100], matingDesireRange=[1, 10]}){

        Plant.calorieRange = plantCalories
        Plant.growth = plantGrowth

        Animal.speedRange = speedRange
        Animal.metabolismRange = metabolismRange
        Animal.matingDesireRange = matingDesireRange

        // for how many the user specifies create
        while(fish > 0){
            new Fish()
            fish -= 1
        }
        while(sharks > 0){
            new Shark()
            sharks -= 1
        }
        while(plants > 0){
            new Plant()
            plants -= 1
        }

        this.generation = 1
        this.endGeneration = endGeneration
        
    }

    recentPopulationSurvey(){
        return {
            "Fish Population": Fish.all.length,
            "Shark Population": Shark.all.length,
            "Plant Population": Plant.all.length
        }
    }

    recentStatisticsSurvey(){
        let statsToSurvey = [
            "age",
            "speed",
            "metabolism",
            "matingDesire"
        ]

        let statsSurvey = {
            "Fish": {},
            "Shark": {}
        }

        for(const[key, value] of Object.entries(statsSurvey)){
            for(let stat of statsToSurvey){
                statsSurvey[key][stat] = 0
            }
        }

        for(let stat of statsToSurvey){
            let avgStat = 0
            for(let f of Fish.all){
                avgStat += f[stat]
            }
            avgStat /= Fish.all.length
            statsSurvey["Fish"][stat] = avgStat
        }
        

        for(let stat of statsToSurvey){
            let avgStat = 0
            for(let s of Shark.all){
                avgStat += s[stat]
            }
            avgStat /= Shark.all.length
            statsSurvey["Shark"][stat] = avgStat
        }


        return statsSurvey
    }

    runGen(){
        let report = this.generateReport()
        this.generation += 1
        this.updateAll()
        return report
    }

    run(){
        while(this.generation < this.endGeneration && this.populationsAreAlive()){
            this.runGen()
        }
    }

    populationsAreAlive(){
        return (Plant.all.length > 0 || Fish.all.length > 0 || Shark.all.length > 0)
    }

    updateAll(){
        for(let f of Fish.all){
            f.update()
        }
        for(let s of Shark.all){
            s.update()
        }
        for(let p of Plant.all){
            p.update()
        }
        Plant.spread()
    }

    generateReport(){
        let report = {}
        report['population'] = this.recentPopulationSurvey()
        report['stats'] = this.recentStatisticsSurvey()
        report['generation'] = this.generation
        return report  
    }

    totalPopulation(){
        let totalPopulation = 0
        totalPopulation += Fish.all.length
        totalPopulation += Shark.all.length
        totalPopulation += Plant.all.length
        return totalPopulation
    }
}

// for html

function renderAllCharts(){
    charts['population'].render()
    charts['stats']['Fish'].render()
    charts['stats']['Shark'].render()
}

function makeGraphPlotPoint(gen, value){
    return {x:gen, y:value}
}

function updateChartData(report){
    updatePopulationChart(report)
    updateStatsChart(report, "Fish")
    updateStatsChart(report, "Shark")
}

function updatePopulationChart(report){
    let chartData = charts['population'].options.data
    chartData[0].dataPoints.push(makeGraphPlotPoint(report['generation'], report['population']['Fish Population']))
    chartData[1].dataPoints.push(makeGraphPlotPoint(report['generation'], report['population']['Shark Population']))
    chartData[2].dataPoints.push(makeGraphPlotPoint(report['generation'], report['population']['Plant Population']))
}

function updateStatsChart(report, animal){
    let chartData = charts["stats"][animal].options.data
    chartData[0].dataPoints.push(makeGraphPlotPoint(report['generation'], report['stats'][animal]['age']))
    chartData[1].dataPoints.push(makeGraphPlotPoint(report['generation'], report['stats'][animal]['speed']))
    chartData[2].dataPoints.push(makeGraphPlotPoint(report['generation'], report['stats'][animal]['metabolism']))
    chartData[3].dataPoints.push(makeGraphPlotPoint(report['generation'], report['stats'][animal]['matingDesire']))
}

function updateCharts(){
    let report = game.runGen()
    console.log(report)
    updateChartData(report)
    renderAllCharts()
    if(!(game.generation < game.endGeneration && game.populationsAreAlive() && game.totalPopulation() < 25000)){
        console.log(game.totalPopulation())
        updateChartData(game.generateReport())
        renderAllCharts()
        clearInterval(updateChartsInterval)
    }
}

function createCharts(){
    let populationData = {
        toolbar:{
            buttonBorderColor: "#FFFFFF"
        },
        zoomEnabled: true,
        height: 500,
        axisX:{
            title: "Generation",
            viewportMinimum: 1
        },
        theme: "dark1",
        axisY:{
            title: "Population",
            gridThickness: 0
        },
        title: {
            text: "Species Population By Day"
        },
        data:[{
            type:"line",
            markerType: "none",
            dataPoints: [],
            showInLegend: true,
            name: "Fish Population",
            toolTipContent: "<strong>{y}</strong> Fish Alive"
        },
        {
            type:"line",
            markerType: "none",
            dataPoints: [],
            showInLegend: true,
            name: "Shark Population",
            toolTipContent: "<strong>{y}</strong> Shark(s) Alive"
        },
        {
            type:"line",
            markerType: "none",
            dataPoints: [],
            showInLegend: true,
            name: "Plant Population",
            toolTipContent: "<strong>{y}</strong> Plant(s) Alive"
        },]
}

let fishStatsData = {
        toolbar:{
            buttonBorderColor: "#FFFFFF"
        },
        zoomEnabled: true,
        height: 500,
        axisX:{
            title: "Generation",
            viewportMinimum: 1
        },
        theme: "dark1",
        axisY:{
            title: "Value",
            gridThickness: 0
        },
        title: {
            text: "Average Stat for Fish"
        },
        data:[{
            type:"line",
            markerType: "none",
            dataPoints: [],
            showInLegend: true,
            name: "Age",
            toolTipContent: "<strong>{y}</strong>"
        },
        {
            type:"line",
            markerType: "none",
            dataPoints: [],
            showInLegend: true,
            name: "speed",
            toolTipContent: "<strong>{y}</strong>"
        },
        {
            type:"line",
            markerType: "none",
            dataPoints: [],
            showInLegend: true,
            name: "metabolism",
            toolTipContent: "<strong>{y}</strong>"
        },
        {
            type:"line",
            markerType: "none",
            dataPoints: [],
            showInLegend: true,
            name: "matingDesire",
            toolTipContent: "<strong>{y}</strong>"
        }]
}

let sharkStatsData = JSON.parse(JSON.stringify(fishStatsData))
sharkStatsData["title"]["text"] = "Average Stat for Shark"

charts["population"] = new CanvasJS.Chart("populationChart", populationData)
charts["stats"] = {
    "Fish": new CanvasJS.Chart("fishStatsChart", fishStatsData),
    "Shark": new CanvasJS.Chart("sharkStatsChart", sharkStatsData)
}
renderAllCharts()
}   

function translateInputValueToInt(value){
if(value == "" || isNaN(Number(value))){
    return undefined
}
else{
    return Number(value)
}
}

function beginSimulation(){
    inputs = document.getElementsByTagName("input")
    output = document.getElementById("graphs")
    output.style.display = "block"
    let arguments_ = {}
    for(let i = 0; i < inputs.length; i++){
        let input = inputs[i]
        
        if(input.name.slice(-3) == "Low"){
            let range = [translateInputValueToInt(input.value), translateInputValueToInt(inputs[i + 1].value)]
            i++
            arguments_[input.name.split("-")[0]] = range
            if(range[0] == undefined && range[1] == undefined){
                arguments_[input.name.split("-")[0]] = undefined
            }
        }else{
            arguments_[input.name] = translateInputValueToInt(input.value)
        }
    }

    document.getElementById("inputDiv").remove()
    game = new Game(arguments_)
    charts = {}
    createCharts()
    updateChartsInterval = setInterval(updateCharts, 100)
}   