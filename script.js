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
        setQuestionCollection : function(newCollection){
            localStorage.setItem('questionCollenction' , JSON.stringify(newCollection ));
        },
        getQuestionCollection : function(){
            return JSON.parse ( localStorage.getItem('questionCollenction'));
        },
        removeQuestionCollection : function(){
            localStorage.removeItem('questionCollenction');
        }
    }

    //Initialize localStorage
    if(questionLocalStorage.getQuestionCollection() === null ){
        questionLocalStorage.setQuestionCollection([]);
    }

    return {
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
        }
    }
    

})();

/***************************
***********UI CONTROLLER
****************************/ 
let UIController = ( function() {

    const domItems = {
        questionInsertBtn : document.getElementById("question-insert-btn"),
        newQuestionText  : document.getElementById("new-question-text"),
        adminOptions    : document.querySelectorAll(".admin-option"),
        adminOptionsContainer: document.querySelector(".admin-options-container"),
        insertedQuestionsWrapper: document.querySelector('.inserted-questions-wrapper'),
        questionUpdateBtn: document.getElementById("question-update-btn"),
        questionDeleteBtn: document.getElementById("question-delete-btn"),
        questionClearBtn : document.getElementById("questions-clear-btn")
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

   

})( quizController , UIController );

