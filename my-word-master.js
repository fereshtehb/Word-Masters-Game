const letters = document.querySelectorAll(".word-letters");
const loadingDiv = document.querySelector(".loading-bar");
const Answer_lenght = 5;
ROUNDS = 6;

async function init() {
    let currentGuess = '';
    let currentRow = 0;
    let isLoading = true;

//getting sth from API check it with console and check on console to make sure and plan
//how to use it
//the random=1 part produce new word in every refresh
    const res = await fetch ("https://words.dev-apis.com/word-of-the-day?random=1");
    const resObj = await res.json();
    const word = resObj.word.toUpperCase();
    const wordParts = word.split("");
    let done = false;
    setLoading (false);
    isLoading = false;

    console.log(word);
    setLoading();

    function addLetter (letter){
    if (currentGuess.length < Answer_lenght) {
        currentGuess += letter;
    } else {
        // Replace the last letter
        currentGuess = currentGuess.substring(0, currentGuess.length -1) + letter;
    }
    letters [Answer_lenght * currentRow + currentGuess.length - 1].innerText = letter;
    }
async function commit() {
    //if the number of charactars less than 5
    if (currentGuess.length !== Answer_lenght) {
        //do nothing
        return;
    }

    // validate the word
    isLoading = true;
    setLoading(true);
    const res = await fetch ("https://words.dev-apis.com/validate-word",{
        method: "POST",
        body: JSON.stringify({word: currentGuess})
    });
    const { validWord } = await res.json();
    isLoading = false;
    setLoading(isLoading);

    // not valid, mark the word as invalid and return
    if (!validWord){
        markInvalidword ();
        return;
    }
    //  did they win or lose?
    const guessParts = currentGuess.split("");
    const map = makeMap(wordParts);
    console.log(map);

    for (let i = 0 ; i < Answer_lenght ; i++){
        //mark as correct
        if (guessParts [i] === wordParts [i]){
            letters[ currentRow * Answer_lenght + i].classList.add("correct");
            map[guessParts[i]]--;
        }
    }

    for (let i = 0 ; i < Answer_lenght ; i++)
    {
        if (guessParts [i] === wordParts[i]){
        //do nothing I already did it
        }
        else if (wordParts.includes(guessParts[i]) && map[guessParts[i]]> 0 )
        {
        //mark as close
        letters[ currentRow * Answer_lenght + i].classList.add("close");
        map[guessParts[i]]--;
        }
        else { 
        //mark as wrong
        letters[ currentRow * Answer_lenght + i].classList.add("wrong");
        }
    }
    //showing the alert
    currentRow++;
    if ( currentGuess === word) {
        //win
        alert ('you win!');
        document.querySelector('.brand').classList.add("winner");
        done = true;
        return;
    } else if (currentRow === ROUNDS) {
        //the alert dosnt have '' but `` if you need to ${word} to be shown
        alert (`you lose, the word was ${word}`);
        done = true;
    }
    currentGuess = '';

}
function backspace(){
    currentGuess = currentGuess.substring(0,currentGuess.length-1);
    letters[Answer_lenght * currentRow + currentGuess.length].innerText = "";
}

function markInvalidword () {
    //alert ('not a valid word!!!!!!');

    for (let i = 0; i<Answer_lenght; i++){
        letters[currentRow * Answer_lenght + i ].classList.add("invalid");

        setTimeout(function () {
            letters [currentRow * Answer_lenght + i].classList.remove("invalid");
        }, 800);
    }
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
  }
  function setLoading (isLoading) {
    // console.log(isLoading);
     loadingDiv.classList.toggle("hidden", !isLoading);
 }

    document.addEventListener('keydown', function handleKeyPress (event) {
        //if it's done or loading do nothing
        if ( done || isLoading ){
            //do nothing
            return;
        }
        const action= event.key;
        console.log(action);
        if (action === "Enter"){
            commit();
        }
        else if (action === "Backspace") {
            backspace();
        }
        else if(isLetter(action)){
            addLetter ( action.toUpperCase());
        }
        else{
            // do nothing
        }
    });

}
// to get the close char when there are more than 1 correct char and 1 close char
function makeMap(array) {
    const obj = {};
    for (let i = 0; i < array.length; i++) {
      if (obj[array[i]]) {
        obj[array[i]]++;
      } else {
        obj[array[i]] = 1;
      }
    }
    return obj;
  }

init();

