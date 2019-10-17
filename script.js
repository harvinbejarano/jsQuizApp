/***************************
***********QUIZ CONTROLLER
****************************/ 
let quizController = (function(){

    //Question Constructor
    function Question(id, questionText, options, correctAnswer){
        this.id = id;
        this.questionText = questionText;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }


    const questionLocalStorage = {
        setQuestionCollection: function (newCollection) {
            localStorage.setItem('questionCollenction', JSON.stringify(newCollection));
        },
        getQuestionCollection: function () {
            return JSON.parse(localStorage.getItem('questionCollenction'));
        },
        removeQuestionCollection: function () {
            localStorage.removeItem('questionCollenction');
        }
    };

    //Initialize localStorage
    if(questionLocalStorage.getQuestionCollection() === null ){
        questionLocalStorage.setQuestionCollection([]);
    }

    let quizProgress = {
        questionIndex: 0
    };

    //****Person */
    function Person(id, firstname, lastname, score) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.score = score;
    }

    let currPersonData = {
        fullname: [],
        score : 0
    };

    let adminFullName = ['John', 'Smith'];

    const personLocalStorage = {
        setPersondata: function (newPerson) {
            localStorage.setItem('personData', JSON.stringify(newPerson));
        },
        getPersonData: function () {
            return JSON.parse(localStorage.getItem('personData'));
        },
        removePersonData: function () {
            localStorage.removeItem('personData');
        }
    };

    if (personLocalStorage.getPersonData() === null) {
        personLocalStorage.setPersondata([]);
    }

    return {
        getQuizProgress: quizProgress,
        
        getQuestionLocalStorage : questionLocalStorage,

        addQuestion: function(newQuestionText , Options){
            let optArr, correctAns, questionId, newQuestion,getStoredQuestions, isChecked;
            
            //Initialize localStorage
            if(questionLocalStorage.getQuestionCollection() === null ){
                questionLocalStorage.setQuestionCollection([]);
            }

            optArr = [];
            isChecked = false;

            //Gather Question Answers.
            for (let index = 0; index < Options.length; index++) {
                if(Options[index].value !== ""){
                    optArr.push( Options[index].value ); 
                }

                if(Options[index].previousElementSibling.checked &&  Options[index].value !== ""){
                    correctAns = Options[index].value;
                    isChecked = true;
                }
             }

             //Increase questionId
             if(questionLocalStorage.getQuestionCollection().length > 0){
                questionId = questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length  - 1].id + 1;
             }
             else{
                 questionId = 0;
             }
             
             //Validatiosn before adding the Question to localStorage
             if(newQuestionText.value !== ""){
                if(optArr.length > 1){
                    if (isChecked){
                        
                        newQuestion = new Question(questionId,newQuestionText.value,optArr,correctAns);
             
                        //Store new question collection in local storage
                        getStoredQuestions = questionLocalStorage.getQuestionCollection();
                        getStoredQuestions.push(newQuestion );
                        questionLocalStorage.setQuestionCollection(getStoredQuestions);
           
                        //Clear the Form
                        newQuestionText.value = "";
                        for (let x = 0; x < Options.length; x++) {
                           Options[x].value = "";
                           Options[x].previousElementSibling.checked = false;
                        }

                        return true;
                    }
                    else{
                        alert('You havent assined a correct answer.');
                        return false;
                    }
                 }
                 else{
                    alert('You must insert at least 2 options.');
                    return false;
                 }
             }
             else{
                 alert('You must insert Question.');
                 return false;
             }
        },

        checkAnswer: function (ans) {
            if (questionLocalStorage.getQuestionCollection()[quizProgress.questionIndex].correctAnswer === ans.textContent) {
                currPersonData.score++
                return true;
            }
            else {
                return false;
            }
        },

        isFinished: function () {
            return quizProgress.questionIndex + 1 === questionLocalStorage.getQuestionCollection().length;
        },

        addPerson: function () {
            let newPerson, personId, personData;
            if (personLocalStorage.getPersonData().length > 0) {
                personId = personLocalStorage.getPersonData()[personLocalStorage.getPersonData().length - 1].id + 1;
            }
            else {
                personId = 0;
            }
            newPerson = new Person(personId, currPersonData.fullname[0], currPersonData.fullname[1], currPersonData.score);
            personData = personLocalStorage.getPersonData();
            personData.push(newPerson);
            personLocalStorage.setPersondata(personData);

            console.log('new person added',newPerson);
            
        },

        removePerson: function (personId) {
            const persons = personLocalStorage.getPersonData();
            let newPersons = [];
           
            for (let i = 0; i < persons.length; i++) {
                if (persons[i].id.toString() === personId) {
                    newPersons = persons.filter(p => p.id.toString() !== personId);
                    break;
                }
            }
            personLocalStorage.setPersondata(newPersons);
        },

        getCurrPersonData: currPersonData,
        
        getAdminFulName: adminFullName,
        getPersonLocalStorage : personLocalStorage
    }
    

})();

/***************************
***********UI CONTROLLER
****************************/ 
let UIController = ( function() {

    const domItems = {
        //Admin panel Elements-----
        adminPanelSection: document.querySelector(".admin-panel-container"),
        questionInsertBtn : document.getElementById("question-insert-btn"),
        newQuestionText  : document.getElementById("new-question-text"),
        adminOptions    : document.querySelectorAll(".admin-option"),
        adminOptionsContainer: document.querySelector(".admin-options-container"),
        insertedQuestionsWrapper: document.querySelector('.inserted-questions-wrapper'),
        questionUpdateBtn: document.getElementById("question-update-btn"),
        questionDeleteBtn: document.getElementById("question-delete-btn"),
        questionClearBtn: document.getElementById("questions-clear-btn"),
        resultList: document.querySelector(".results-list-wrapper"),
        clearResultBtn:document.getElementById("results-clear-btn"),
        //----Quiz Section Elements-----
        quizSection : document.querySelector(".quiz-container"),
        askedQuestionText: document.getElementById("asked-question-text"),
        quizOptionsWraper: document.querySelector(".quiz-options-wrapper"),
        progressBar: document.querySelector("progress"),
        progressPar: document.getElementById("progress"),
        instantAnsContainer: document.querySelector(".instant-answer-container"),
        instantAnsText: document.getElementById('instant-answer-text'),
        instantAnsDiv: document.getElementById('instant-answer-wrapper'),
        emotionIcon: document.getElementById("emotion"),
        nextQuestionBtn: document.getElementById('next-question-btn'),
        //----landng page elements---
        landingPageSection : document.querySelector(".landing-page-container"),
        startQuizBtn: document.getElementById("start-quiz-btn"),
        firstNameInput: document.getElementById("firstname"),
        lastNameinput: document.getElementById("lastname"),
        //---Final results eleents
        finalResultSection: document.querySelector(".final-result-container"),
        finalScoreText: document.getElementById('final-score-text'),
        logoutBtn: document.getElementById("final-logout-btn")
        

    };

    return {
        getDomItems: domItems,
       
        addInputsDynamically : function(){

            //Add new question inputs dynamically
            const addInput = function(){
                let inputHTML, z;
                z = document.querySelectorAll(".admin-option").length;
                
                inputHTML = '<div class="admin-option-wrapper"><input type="radio" class="admin-option-'+ z + 
                            '" name="answer" value="'+ z + '"><input type="text" class="admin-option admin-option-'+ z + 
                            '" value=""></div>';
                 
                domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHTML);

                //Remove eventListener from previous input
                domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus',addInput);
                
                //Add eventListener to last input
                domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);

            }
            
            domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
        },

        //Creates the Question List everytime the page is load
        createQuestionList: function (getQuestions) {
            let questionHTML ;

            domItems.insertedQuestionsWrapper.innerHTML = '';
           
            for (let index = 0; index < getQuestions.getQuestionCollection().length; index++) {
                let number = index+1;
                questionHTML = '<p><span>'+ number + '. ' + getQuestions.getQuestionCollection()[index].questionText +
                               '</span><button id="question-' + getQuestions.getQuestionCollection()[index].id +'">Edit</button></p>';

                domItems.insertedQuestionsWrapper.insertAdjacentHTML('afterbegin',questionHTML);
            }
        },
        
        
        editQuestionList: function (event, storageQuestionList, fnAddInputs, fnUpdateQuestionList) {
            let getId, foundItemIdex, optionHTML;
            let questionToUpdate , QuestionList = [];

            if ('question-'.indexOf(event.target.id)) {
                questionId = parseInt(event.target.id.split('-')[1]);
                QuestionList = storageQuestionList.getQuestionCollection();
                
                //Find the question to Edit
                for (let index = 0; index < QuestionList.length; index++) {
                    if (QuestionList[index].id === questionId) {
                        questionToUpdate = QuestionList[index];
                        foundItemIdex = index;
                        break;
                    }
                } 
                
                //Update the UI wth the question Data.
                domItems.newQuestionText.value = questionToUpdate.questionText;
                domItems.adminOptionsContainer.innerHTML = '';
                
                //Add questio answers
                optionHTML = '';
                for (let x = 0; x < questionToUpdate.options.length; x++) {
                    
                    optionHTML += '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' + x +
                        '" name="answer" value="' + x + '"><input type="text" class="admin-option admin-option-'
                        + x + '" value="' + questionToUpdate.options[x] + '" > </div>';
                }
                domItems.adminOptionsContainer.innerHTML = optionHTML;

                //Display Update and Delete Btns, Hide insert btn
                domItems.questionUpdateBtn.style.visibility = 'visible';
                domItems.questionDeleteBtn.style.visibility = 'visible';
                domItems.questionInsertBtn.style.visibility = 'hidden';
                domItems.questionClearBtn.style.visibility = 'hidden';
                fnAddInputs();

                const restoreDefaultView = () => { 
                    let updatedOptions;
                    updatedOptions = document.querySelectorAll(".admin-option");
                    
                    domItems.newQuestionText.value = '';
                    for (let i = 0; i < updatedOptions.length; i++) {
                        updatedOptions[i].value = '';
                        updatedOptions[i].previousElementSibling.checked = false;
                    }

                    domItems.questionUpdateBtn.style.visibility = 'hidden';
                    domItems.questionDeleteBtn.style.visibility = 'hidden';
                    domItems.questionInsertBtn.style.visibility = 'visible';
                    domItems.questionClearBtn.style.visibility = 'visible';

                    fnUpdateQuestionList(storageQuestionList);
                }

                const updateQuestion = () => {
                    let optionElements, newOptions = [];

                    optionElements = document.querySelectorAll(".admin-option");
                    questionToUpdate.questionText = domItems.newQuestionText.value;
                    questionToUpdate.correctAnswer = '';

                    for (let i = 0; i < optionElements.length; i++) {
                        if (optionElements[i].value !== '') {
                            newOptions.push(optionElements[i].value);
                            if (optionElements[i].previousElementSibling.checked) {
                                questionToUpdate.correctAnswer = optionElements[i].value;
                            }
                        }
                    }
                    questionToUpdate.options = newOptions;
                    
                    if (questionToUpdate.questionText !== '') {
                        if (questionToUpdate.options.length > 1) {
                            if(questionToUpdate.correctAnswer !== ''){
                                QuestionList.splice(foundItemIdex, 1, questionToUpdate);
                                storageQuestionList.setQuestionCollection(QuestionList);    

                                restoreDefaultView();
                            }
                            else {
                                alert('You havent assined a correct answer.');
                            }
                        } else {
                            alert('you must insert at least two options');
                        }
                            
                    }
                    else {
                        alert('Please insert question.')
                    }
                    
                }

                const deleteQuestion = () => { 
                    QuestionList.splice(foundItemIdex, 1);
                    storageQuestionList.setQuestionCollection(QuestionList);
                    restoreDefaultView();
                }

                domItems.questionUpdateBtn.onclick = updateQuestion;
                domItems.questionDeleteBtn.onclick = deleteQuestion;
            
            }
        },

        clearQuestionList: function (storageQuestionList) {
            if (storageQuestionList.getQuestionCollection() !== null) {
                if (storageQuestionList.getQuestionCollection().length > 0) {
                    let result = confirm('Do you want to close the List?');
                    if (result) {
                        storageQuestionList.removeQuestionCollection();
                        domItems.insertedQuestionsWrapper.innerHTML = '';
                    }
               }
            }
            
        },

        displayQuestion: function (storageQuestionList , progress) {
            
            if (storageQuestionList.getQuestionCollection().length > 0) {

                let newOptionHTML, characterArray;
                characterArray = ['A', 'B', 'C', 'D', 'E', 'F'];

                domItems.askedQuestionText.textContent = storageQuestionList.getQuestionCollection()[progress.questionIndex].questionText;
                
                domItems.quizOptionsWraper.innerHTML = '';
                
                for (let i = 0; i < storageQuestionList.getQuestionCollection()[progress.questionIndex].options.length; i++) {
                    
                    newOptionHTML = '<div class="choice-' + i + '"><span class="choice-' + i + '">'+characterArray[i]+'</span><p  class="choice-' + i +
                        '">' + storageQuestionList.getQuestionCollection()[progress.questionIndex].options[i] + '</' + i + '></div>';
                    
                    domItems.quizOptionsWraper.insertAdjacentHTML('beforeend', newOptionHTML);
                    
                }
            }
        },

        displayProgress: function (storageQuestionList , progress) {
            domItems.progressBar.max  = storageQuestionList.getQuestionCollection().length;
            domItems.progressBar.value = progress.questionIndex + 1;
            domItems.progressPar.textContent = (progress.questionIndex + 1) + '/' + storageQuestionList.getQuestionCollection().length;
        },

        newDesign: function (ansResult, selectdAnswer) {
            let index = 0;
            let twoOptions = {
                instAnstext: ['This is a wrong answer', 'This is a correct answer'],
                instAnsClass: ['red', 'green'],
                emationType: ['images/sad.png', 'images/happy.png'],
                optionsSpanBg:['rgba(200,0,0,.7)','rgba(0,250,0,.2)']
            };

            if (ansResult) {
                index = 1;
            }

            domItems.quizOptionsWraper.style.cssText = "opacity: 0.6; pointer-events: none;";    
            domItems.instantAnsContainer.style.opacity = 1;
            domItems.instantAnsText.textContent = twoOptions.instAnstext[index];
            domItems.instantAnsDiv.className = twoOptions.instAnsClass[index];
            domItems.emotionIcon.setAttribute('src', twoOptions.emationType[index]);
            selectdAnswer.previousElementSibling.style.backgroundColor = twoOptions.optionsSpanBg[index];
        },

        resetDesign: function () {
            domItems.quizOptionsWraper.style.cssText = "";    
            domItems.instantAnsContainer.style.opacity = 0;
        },

        getFullName: function (currPerson, storageQuestionList, admin) {

            if ( domItems.firstNameInput.value === '' || domItems.lastNameinput.value === '') {
                alert('Please, enter your firstname and lastname');
                return;
            }
                
            if ( !(domItems.firstNameInput.value === admin[0] && domItems.lastNameinput.value === admin[1]) ) {
                if (storageQuestionList.getQuestionCollection().length === 0) {
                    alert('The quiz is not ready, please contact the admin.');
                    return;
                }

                currPerson.fullname.push(domItems.firstNameInput.value);
                currPerson.fullname.push(domItems.lastNameinput.value);
                domItems.landingPageSection.style.display = 'none';
                domItems.quizSection.style.display = 'block';
            }
            else {
                domItems.landingPageSection.style.display = 'none';
                domItems.adminPanelSection.style.display = 'block';
            }
            
            
        },

        finalResult: function (currPerson) {
            domItems.finalScoreText.textContent = currPerson.fullname[0] + ' ' + currPerson.fullname[1] + 
                ' , your final score is ' + currPerson.score;
            
            domItems.quizSection.style.display = 'none';
            domItems.finalResultSection.style = 'block';
        },

        addResultOnPanel: function (userData) {
            const persons = userData.getPersonData();

            for (let i = 0; i < persons.length; i++) {
                let index = i + 1;
                let personInfo = persons[i].firstname + ' ' + persons[i].lastname + ' - ' + persons[i].score + ' Points.';
                
                const perSonHTML = '<p class="person person-' + index + '"><span class="person-' + index + '">' + personInfo + '</span><button        id="delete-result-btn_' + persons[i].id + '"class="delete-result-btn">Delete</button></p>';                
                
                domItems.resultList.insertAdjacentHTML('beforeend', perSonHTML);
                
            }
        },

        removeResultFromPanel: function (btn) {
            btn.parentElement.remove();
        },

        clearResultList: function (userData) {
            userData.removePersonData();    
            domItems.resultList.innerHTML = '';
        }

    };


})();

/***************************
***********CONTROLLER
****************************/ 
let Controller = (function( quizCtrl, UICtrl ){
    const selectedDomItems = UICtrl.getDomItems;

    UICtrl.addInputsDynamically();

    UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);

    selectedDomItems.questionInsertBtn.addEventListener('click', (e) => {
        const adminOptions = document.querySelectorAll('.admin-option');

        const checkBoolean = quizCtrl.addQuestion(selectedDomItems.newQuestionText, adminOptions);
        
        if (checkBoolean) {
            UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);
        }

    });

    selectedDomItems.insertedQuestionsWrapper.addEventListener('click', (e) => {
        UICtrl.editQuestionList(e, quizCtrl.getQuestionLocalStorage,UIController.addInputsDynamically , UIController.createQuestionList);
    });


    selectedDomItems.questionClearBtn.addEventListener('click', () => {
        UIController.clearQuestionList(quizCtrl.getQuestionLocalStorage);
    });

    //--Quiz Section---
    UIController.displayQuestion(quizController.getQuestionLocalStorage, quizController.getQuizProgress);
    UIController.displayProgress(quizController.getQuestionLocalStorage, quizController.getQuizProgress);

    selectedDomItems.quizOptionsWraper.addEventListener('click', (e) => {
        let updatedOptionsDiv = selectedDomItems.quizOptionsWraper.querySelectorAll('div');
        for (let i = 0; i < updatedOptionsDiv.length; i++) {
            if (e.target.className === 'choice-' + i) {
                let answer = document.querySelector('.quiz-options-wrapper div p.' + e.target.className);
                const ansResult = quizController.checkAnswer(answer);
                UIController.newDesign(ansResult, answer);

                if (quizController.isFinished()) {
                    selectedDomItems.nextQuestionBtn.textContent = 'Finish';
                }
            }
        }
    });

    

    let nextQuestion = function (questionData, progress) {
        if (quizController.isFinished()) {
             
            //Fish QUiz
            quizController.addPerson();
            UIController.finalResult(quizController.getCurrPersonData);

            
        }
        else {
            UIController.resetDesign();
            quizController.getQuizProgress.questionIndex++;
            UIController.displayQuestion(quizController.getQuestionLocalStorage, quizController.getQuizProgress);
            UIController.displayProgress(quizController.getQuestionLocalStorage, quizController.getQuizProgress);
        }
    };

    selectedDomItems.nextQuestionBtn.onclick = function () {
        nextQuestion(quizController.getQuestionLocalStorage, quizController.getQuizProgress);
    }

    selectedDomItems.startQuizBtn.addEventListener('click', () => {
        UIController.getFullName(quizController.getCurrPersonData, quizController.getQuestionLocalStorage, quizController.getAdminFulName);
    });

    selectedDomItems.lastNameinput.addEventListener('focus', () => { 
        
        selectedDomItems.lastNameinput.addEventListener('keypress', (e) => {
            if (e.keyCode === 13) {
                UIController.getFullName(quizController.getCurrPersonData, quizController.getQuestionLocalStorage, quizController.getAdminFulName);
            }
         });
    });

    UIController.addResultOnPanel(quizController.getPersonLocalStorage);

    selectedDomItems.resultList.addEventListener('click', (e) => { 
        if (e.target.id.indexOf("btn_") >= 0) { 
            const personId = e.target.id.split("_")[1];

            UIController.removeResultFromPanel(e.target);
            quizController.removePerson(personId);
        }
    });

    selectedDomItems.clearResultBtn.addEventListener('click', () => {
        UIController.clearResultList(quizController.getPersonLocalStorage);
    });

   

})( quizController , UIController );

