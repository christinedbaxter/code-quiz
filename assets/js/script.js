//CREATE QUIZ CLASS
class Quiz {
    constructor(questions, result) {
        this.score = 0;
        this.questions = questions;
        result = getRandomNumber(0, questions.length - 1);
        this.questionIndex = result;
        this.questionCount = 1;        
    }

    getQuestionIndex() {
        return this.questions[this.questionIndex];
    }

    guess(answer) {
        if (this.getQuestionIndex().isCorrectAnswer(answer)) {            
            this.score += 10;
        } else {
            this.score -= 10;
        }
        this.questionIndex = getRandomNumber(0, questions.length - 1);
        this.questionCount++;
    }

    isEnded() {
        return this.quizTime === 0;
    }
}

// DISPLAY QUESTION
function displayQuestion() {    
    if (quiz.isEnded()) {
        showScores();
    } else {
      // show question
      let questionEl = document.getElementById("question"); 
      questionEl.innerHTML = quiz.getQuestionIndex().text;

      // show options
      let choices = quiz.getQuestionIndex().choices;
      for (let i = 0; i < choices.length; i++) {
        let choiceEl = document.getElementById("choice" + i);
        choiceEl.innerHTML = choices[i];
        guess("btn" + i, choices[i]);
      }

      showProgress();
    }
};

//generating and returning an array of numbers ranging from 0-69 representing questions array indices
function generateNumbers(min, max) {
  var numArr = [];

  for (var i = 0; i < max; i++) {
    numArr.push(i);
  }

  return numArr;
}

//passing in the generateNumbers function array then returning a shuffled array of numbers 0-69
function shuffle(array) {
  var i = array.length,
    j = 0,
    temp;

  while (i--) {
    j = Math.floor(Math.random() * (i + 1));

    // swap randomly chosen element with current element
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}

//passing in 0 and questions.length indices
function getRandomNumber(min, max) {
  var minNum = min;
  var maxNum = max;

  var numArr = generateNumbers(minNum, maxNum);

  var shuffleNumArr = shuffle(numArr);

  //adding another level of randomness to returning question index
  var result = Math.floor(Math.random(shuffleNumArr) * 70);
    
  console.log(result);

  return result;
}

/* REFACTOR candidate (generalizing screens hidden, reducing hiding quizBox code pieces) */
//hiding the quiz intro screen once Start button is clicked, then making quiz box visible
function hideQuizIntro() {
    let qIntroEl = document.getElementById("quizIntro");
    qIntroEl.style.display = "none";
    let qBox = document.getElementById("quizBox");
    qBox.style.display = "flex";
};

/* REFACTOR candidate (generalizing screens hidden, reducing hiding quizBox code pieces) */
//hiding the high scores screen once Go Back button is clicked, then making quiz box visible
function hideHighScores() {
    let highScoresBoxEl = document.getElementById("highScoresBox");
    highScoresBoxEl.style.display = "none";
    let qBox = document.getElementById("quizBox");
    qBox.style.display = "flex";
};

// create guess function
function guess(id, guess) {
    let button = document.getElementById(id);
    button.onclick = function () {
        quiz.guess(guess);        
        displayQuestion();
    }
};

// create show progress
function showProgress() {
    
    let currentQuestionNumber = quiz.questionCount;
    let progressEl = document.getElementById("progress");
    progressEl.innerHTML =
        `Question ${currentQuestionNumber} of ${quiz.questions.length}`;
    let currScoreEl = document.getElementById("currentScore");
    currScoreEl.innerHTML = `Score: ${quiz.score}`;
};

/* REFACTOR candidate (moving HTML creation to own function) */
// show score
function showScores() {    
    let totalScore = quiz.questions.length * 10;
    let quizEndHTML = `
            <h1 id="score">All Done!</h1>
            <h2 id="score">Your final score is: </br> ${quiz.score} of ${totalScore}</h2>
            <div id="initials">
                Enter initials:
                <input type="text" name="userInitials" id="userInitials" />
            </div>
            <div id="resultBox" class="resultBox">
                <div id="resultBoxButton" class="resultBoxButton">
                    <input id="submit" type="button" value="Submit" onclick=saveUserData(); />
                </div>
                <div id="resultBoxButton" class="resultBoxButton">
                    <input id="view" type="button" value="View High Scores" />
                </div>
                <div class="quizRepeat">
                    <a href="index.html">Take Quiz Again</a>
                </div>
            </div>
        `;
    let quizEl = document.getElementById("quiz");
    quizEl.innerHTML = quizEndHTML;
    document.getElementById("view").addEventListener("click", viewHighScores);
};

//acquire questions

let quiz = new Quiz(questions);

//display question
displayQuestion();

//add a 60 second (1 min) count down
let time = 1;
let quizTimeInMinutes = time * 60 * 60;
let quizTime = quizTimeInMinutes / 60;

let counting = document.getElementById("countDown");

function startCountdown() {
    let quizTimer = setInterval(function () {
        if (quizTime <= 0) {
            clearInterval(quizTimer);
            showScores();
        } else {
            quizTime--;            
            let sec = Math.floor(quizTime % 60);
            let min = Math.floor(quizTime / 60) % 60;
            let timerHTML = `TIME: ${min}:${sec}`;            
            counting.innerHTML = timerHTML;
        }
    }, 1000);
};

//save user score, initials, and date played to local storage
function saveUserData() {    
    var newDataEl = document.getElementById("highScoresContent").value;
    let userInfoEl = document.querySelector("#userInitials").value;
    var userInfoScore = `${quiz.score}`;
    let nowDate = new Date();

    if (!userInfoEl) {
        alert("Please enter initials and then Submit.");
        return;
    } else {
    
        let newUserInfo = { "initials": userInfoEl, "score": userInfoScore, "date": nowDate };

        newDataEl = newUserInfo;

        if (localStorage.getItem("userInfo") === null) {
            localStorage.setItem("userInfo", "[]");
        }

        var oldData = JSON.parse(localStorage.getItem("userInfo"));
        oldData.push(newDataEl);

        localStorage.setItem("userInfo", JSON.stringify(oldData));

        window.alert("Score has been saved!");
    }
}

//checking that local storage data exists, if not, create empty array
//load existing user data from local storage
function loadUserData() {    
    var scoresListEl = document.getElementById("scoresList");   
    
    if (localStorage.getItem("userInfo") != null) {
        var currUserInfoArr = JSON.parse(localStorage.getItem("userInfo"));        
        
        for (let i = 0; i < currUserInfoArr.length; i++) {            
            currUserInfoArr[i].initials;
            currUserInfoArr[i].score;
            currUserInfoArr[i].date;
            var row = document.createElement("tr");
            row.setAttribute("id", "tblDataRow");
            row.innerHTML = `
                <tr id="tblDataRow">                    
                    <td id="initials">${currUserInfoArr[i].initials}</td>
                    <td id="score">${currUserInfoArr[i].score}</td>
                    <td id="datePlayed">${currUserInfoArr[i].date}</td>
                </tr>
            `;            
                        
            scoresListEl.appendChild(row);
        };        
    }
};

/* REFACTOR candidate (generalizing screens hidden/displayed) */
//hiding quizBox once View High scores button/link is clicked, then making highScoresBox visible
function viewHighScores() {
    let quizBoxEl = document.getElementById("quizBox");
    quizBoxEl.style.display = "none";

    let highScoresBoxEl = document.getElementById("highScoresBox");
    highScoresBoxEl.style.display = "block";
    loadUserData();
};

//calling start countdown function to start quiz timer
startCountdown();