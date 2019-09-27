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
                    }
                    else{
                        alert('You havent assined a correct answer.');
                    }
                 }
                 else{
                    alert('You must insert at least 2 options.');
                 }
             }
             else{
                 alert('You must insert Question.');
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
        insertedQuestionsWrapper: document.querySelector('.inserted-questions-wrapper')
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

        createQuestionList : function(getQuestions){
            let questionHTML ;

            domItems.insertedQuestionsWrapper.innerHTML = '';
           
            for (let index = 0; index < getQuestions.getQuestionCollection().length; index++) {
                let number = index+1;
                questionHTML = '<p><span>'+ number + '. ' + getQuestions.getQuestionCollection()[index].questionText +
                               '</span><button id="question-' + getQuestions.getQuestionCollection()[index].id +'">Edit</button></p>';

                domItems.insertedQuestionsWrapper.insertAdjacentHTML('afterbegin',questionHTML);
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

        quizCtrl.addQuestion( selectedDomItems.newQuestionText , adminOptions );
    });

   

})( quizController , UIController );

