async function readTextFile(file){
    let rawResponse = await fetch(file)
    let response = await rawResponse.json()
    console.log(response)
    return response
}
let rawQuestions = readTextFile('./questions.txt')

// prepare questions and insert them when "#get-term" is clicked. 

const listOfTerms = document.getElementById("list-of-terms")
const getTermButton = document.getElementById("get-term")
const restartButton = document.getElementById("restart-term")
let usedIndex = [] // all index of seen terms
let currentIndex = 0;
let questions;

function getRandomIntForArray(max) {
    return Math.floor(Math.random() * max.length);
}

function whileSeenIndexChangeCurrent(questions) {
    while (!checkIfTermUsed(usedIndex, currentIndex)) { // if term already in list
        currentIndex = getRandomIntForArray(questions)
        if (checkIfTermUsed(usedIndex, currentIndex) == true) {
            break;
        }
    }
}

function checkIfTermUsed(usedIndexes) {
    for (const index of usedIndexes) {
        if (index == currentIndex) {
            return false
        }
    }
    return true;
}

function checkIfTermIsLastOne(questions) {
    if (usedIndex.length == questions.length) {
        setTimeout(() => {
            alert("Ultimo termino alcanzado, felicidades!")
            getTermButton.style.display = "none";
        }, 500);
        return true;
    }
}

function insertTermIntoList(questions) { // add to list
    listOfTerms.insertAdjacentHTML
    ("beforeend",
    `
    <li id="${currentIndex}">
        ${questions[currentIndex].title} <strong class="d-none">- ${questions[currentIndex].definition}
    </strong></li>        
    `)
}

function styleSeenElements() {
    for (let i = 0; i < document.querySelectorAll("ol li").length - 1; i++) {
        document.querySelectorAll("ol li")[i].classList.add("alreadyDefined")
    }
}

// show definition on click
function toggleDefinition(e) {
    if (e.target.tagName == "LI") {
        e.target.children[0].classList.toggle("d-none")
    }
}

document.addEventListener("click", (e) => {
    toggleDefinition(e)
})


// check what topic user want to learn.
const select = document.getElementById("topic");

function start(){
    select.addEventListener("change", checkSelectedAndFilterQuestions);
}

function resetGame(){
    usedIndex = [] // all index of seen terms
    currentIndex = 0;
    while (listOfTerms.hasChildNodes()) {
        listOfTerms.removeChild(listOfTerms.lastChild)
    }
    getTermButton.style.display = "none"
}
async function checkSelectedAndFilterQuestions(){
    resetGame()
    resetSelectOptions()
    //option is selected
    let topic = select.options[select.selectedIndex].value;
    select.options[select.selectedIndex].disabled = true; // disable current option for future select.
    
    let filtredQuestions =  await QuestionsBySelectValue(topic)
    if(filtredQuestions.length == 0) return alert("No hay preguntas para este topico")
    // show button to play
    getTermButton.style.display = "flex"

    questions = filtredQuestions; // update questions on every select
}
function resetSelectOptions(){ // reset all options without the 1st one.
    for (let i = 1; i < select.length; i++) {
        select[i].disabled = false;
    }
}
window.addEventListener("load", start, false);

async function QuestionsBySelectValue(selectedValue){
        rawQuestions = await rawQuestions
        if(selectedValue == "all") return rawQuestions
        const result = rawQuestions.filter(question =>{
            if(question.topic == selectedValue) return true;
            else return false;
        })  
        return result;
}

// get all parts and create game.
async function mainGetTermInsideList() {
    questions = await questions;
    console.log(questions)
    currentIndex = getRandomIntForArray(questions)

    whileSeenIndexChangeCurrent(questions) // if current index inside usedIndex then renew

    insertTermIntoList(questions) // insert term into list

    usedIndex.push(currentIndex) // add to usedIndex

    styleSeenElements() // style seen element except last one

    checkIfTermIsLastOne(questions) // check if term is last one
}


getTermButton.addEventListener("click", mainGetTermInsideList)
window.addEventListener("keyup", (e) =>{
    e.preventDefault()
    if(getTermButton.style.display != "none" && !(questions.length == usedIndex.length)) getTermButton.click()
});
