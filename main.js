// select element
let count = document.querySelector(".Quiz-info .count span")
let bullets = document.querySelector(".footer .bullets")
let question = document.querySelector(".question h3")
let answersContainer = document.querySelectorAll(".answer label")
let radio =[...document.querySelectorAll('input[type="radio"]')]
let submitButton= document.querySelector(".submit")
let resultContainer = document.querySelector(".result")
let resultSpan = document.querySelector(".result span")
let countContainer = document.querySelector(".count-down")
// remove
let RquizInfo = document.querySelector(".Quiz-info")
let Rquestion = document.querySelector(".question")
let Ranswers = document.querySelector(".answers")
let footer = document.querySelector(".footer")

// set option
let currentIndex = 0
let rightAnswers = 0
let timer;
let TanswerFc;
let indexCount=1


function main(){
    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200){
            let questions = JSON.parse(this.responseText);
            let numbersOFquestions = questions.length;
            let Tanswer = questions[currentIndex].right_answer


            getQnumbers(numbersOFquestions)
            addQA(questions[currentIndex], numbersOFquestions)
            countDown(7,Tanswer)

            submitButton.onclick = () => {
                if (indexCount <numbersOFquestions ) {
                    TanswerFc = questions[indexCount].right_answer
                }
                Tanswer = questions[currentIndex].right_answer
                let bullet = document.querySelectorAll(".footer .bullets span")

                // handle not chose answer error
                if (radio.some((r) => r.checked == true)) {
                    let choosenAnswer = document.querySelector(".answer input:checked+label").textContent

                    if (Tanswer === choosenAnswer){
                        rightAnswers++
                    }
                    currentIndex++
                    indexCount++

                    // add the next question
                    addQA(questions[currentIndex], numbersOFquestions)
                    // handle bullets
                    hundleBullet(bullet)
                    // countdown
                    clearInterval(timer)
                    countDown(30, TanswerFc)
                }else{
                    window.alert("Please choose an answer")
                }
                
            }
        }
    };

    req.open("Get", "Html questions.json");
    req.send();
}

function getQnumbers(num){
    count.innerHTML = " "+num
    
    for (let i = 0 ; i < num; i++) {
        let span = document.createElement("span")
        bullets.appendChild(span)

        if(i === 0){
            span.className = 'on'
            }
    }
}

function addQA(obj, questionNumbers){
    if (currentIndex < questionNumbers) {
        // remove the old question  
        question.innerHTML=""
        // remove the old answers  
        for (let i = 0; i < answersContainer.length; i++) {
            answersContainer[i].innerHTML=""
        }
        // clear the checked radios
        for (let i = 0; i < radio.length; i++) {
            radio[i].checked = false;
        }
        let q = document.createTextNode(obj.title)
        let span = document.createElement('span')
        let qnumber = document.createTextNode(currentIndex + 1 +'- ') 
        let answers = []
        
        span.appendChild(qnumber)
        question.appendChild(span)
        question.appendChild(q)
        
        for (let i = 1; i <= 4; i++) {   
            let answer = obj[`answer_${i}`]
            answers.push(answer)
        }
        
        for (let i = 0; i < 4; i++) {   
            answersContainer[i].appendChild(document.createTextNode(answers[i]))
        }
    }else{
        showResult(questionNumbers)
    }
}


function hundleBullet(arr){
    for (let i = 0; i < arr.length; i++) {
        if(i <= currentIndex){
            arr[i].className = 'on'
            }
    }
}

function showResult(questionNumbers){
    if (currentIndex === questionNumbers) {
        let text = ` You Answered ${rightAnswers} from ${questionNumbers}`
        // let textNode = document.createTextNode(text)
        let span = document.createElement("span")
        if(rightAnswers === questionNumbers){
            span.className = "perfect"
            span.append("perfect")
        }else if(rightAnswers < questionNumbers && rightAnswers >= questionNumbers-4){
            span.className = "good"
            span.append("good")
        }else{
            span.className = "bad"
            span.append("bad")
        }
        footer.remove()
        Ranswers.remove()
        Rquestion.remove()
        RquizInfo.remove()
        submitButton.remove()
        resultContainer.appendChild(span)
        resultContainer.append(text)
        setTimeout(() => {
            window.location.reload()
        }, 5000);
    }
}

function countDown(duration , trueAnswer){
    let second , minute
    timer = setInterval(() => {
        minute = parseInt(duration / 60)
        second = parseInt(duration % 60)
        if (duration-- === 0) {
            if (radio.some((r) => r.checked == true)) {
                submitButton.click()
            }else {
                for (let i = 0; i < answersContainer.length; i++) {
                    if (answersContainer[i].innerText !== trueAnswer) {
                        radio[i].checked = true
                        submitButton.click()
                        break;
                    }
                }
            }
        }
        second = second.toString().padStart(2 , "0")
        minute = minute.toString().padStart(2 , "0")
        countContainer.innerHTML = `${minute}:${second}`
    }, 1000);
}


main();