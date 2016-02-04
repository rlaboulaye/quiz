var app = angular.module('quizApp', []);

app.directive("generateWelcome", function() {
    return {
        template : "<div class='row center'>\
                      <div class='col-xs-offset-3 col-xs-6'>\
                        <h1>Welcome to Nerd Heaven<br/><br/> A paradise of trivia and glory!</h1>\
                      </div>\
                    </div>\
                    <br/><br/>\
                    <div class='row center'>\
                      <div class='col-xs-offset-3 col-xs-3'>\
                        <h3>Please enter your name:</h3>\
                      </div>\
                      <div class='col-xs-3'>\
                        <br/><input type='text' ng-model='name' />\
                      </div>\
                    </div>\
                    <br/><br/>\
                    <div class='row center'>\
                      <button class='btn btn-primary' ng-click='submitName()'>Submit</button>\
                    </div>"
    };
});

app.directive("generateCategory", function() {
    return {
        template :
        "<div class='row center'>\
          <div class='col-xs-offset-3 col-xs-6'>\
            <h1>Please select a category<br/><br/><br/>\
            <div class='row center'>\
              <div class='col-xs-offset-3 col-xs-6'>\
                <div class='dropdown'>\
                  <button class='btn btn-primary dropdown-toggle' type='button' data-toggle='dropdown'>Select a Category\
                  <span class='caret'></span></button>\
                  <ul class='dropdown-menu'>\
                    <li><a ng-click='startCategoryQuiz(123)' href='#'>Science General Knowledge</a></li>\
                    <li><a ng-click='startCategoryQuiz(21)' href='#'>Geography</a></li>\
                    <li><a ng-click='startCategoryQuiz(35)' href='#'>The Environment</a></li>\
                    <li><a ng-click='startCategoryQuiz(80)' href='#'>Probability</a></li>\
                    <li><a ng-click='startCategoryQuiz(74)' href='#'>Geometry</a></li>\
                  </ul>\
                </div>\
              </div>\
            </div>\
          </div>\
        </div>"
    };
});

app.directive("generateCategoryQuiz", function() {
    return {
        template :
        "<br/><br/><div class='jumbotron' id='quizContainer'>\
          <div class='row'>\
            <div class='col-xs-4'>\
              <h3 ng-show='showScore'>Question {{questionCounter + 1}}</h3>\
            </div>\
            <div class='col-xs-offset-6 col-xs-2'>\
              <h3 ng-show='showScore'>{{score}} / 10</h3>\
            </div>\
          </div>\
          <br/>\
          <div ng-show='showScore' class='row left'>\
            <div class='col-xs-offset-2 col-xs-8'>\
              <div ng-bind-html='questionText | sanitize'></div>\
            </div>\
          </div>\
          <h1 ng-show='showNewHigh'>New High Score!</h1>\
          <br/>\
          <h1 ng-show='showFinalScore'>{{score}} / 10</h1>\
          <div class='row left' ng-show='showScore'>\
            <div class='col-xs-offset-3 col-xs-6'>\
              <form>\
                <input type='radio' ng-model='selection' value='1'>{{' ' + option1}}<br/>\
                <input type='radio' ng-model='selection' value='2'>{{' ' + option2}}<br/>\
                <input type='radio' ng-model='selection' value='3'>{{' ' + option3}}<br/>\
                <input type='radio' ng-model='selection' value='4'>{{' ' + option4}}<br/>\
                </form>\
            </div>\
          </div>\
          <div ng-show='showScore' class='row'>\
            <div ng-click='clickNext()' id='nextButton' class='btn btn-success'>Next</div>\
          </div>\
          <div ng-show='showFinalScore' class='row'>\
            <br/>\
            <div ng-click='submitName()' class='btn btn-success'>Back to Categories</div>\
          </div>\
        </div>"
    };
});

app.filter("sanitize", ['$sce', function($sce) {
  return function(htmlCode){
    return $sce.trustAsHtml(htmlCode);
  }
}]);

app.controller('quizCtrl', function($scope) {

  $scope.initialize = function() {
    if (!($scope.highScore > 0))
    {
      $scope.highScore = 0;
    }
    $scope.questionCounter = 0;
    $scope.page = 1;
    $scope.score = 0;
    $scope.selection = 0;
    $scope.showWelcome = true;
    $scope.showCategory = false;
    $scope.showCategoryQuiz = false;
    $scope.showScore = true;
    $scope.showFinalScore = false;
    $scope.showNewHigh = false;
  },

  $scope.submitName = function() {
    if ($scope.name === "")
    {
      alert("Please enter your name");
    }
    else {
      if ($scope.name != $scope.checkname)
      {
        $scope.highScore = 0;
      }
      $scope.checkname = $scope.name;
      $scope.showWelcome = false;
      $scope.showCategoryQuiz = false;
      $scope.showCategory = true;
    }
  },

  $scope.htmlDecode = function htmlDecode(input){
  var e = document.createElement('div');
  e.innerHTML = input;
  return e.childNodes[0].nodeValue;
  },

  $scope.startCategoryQuiz = function(iCategory) {
    $scope.showCategory = false;
    $scope.showCategoryQuiz = true;
    $scope.showScore = true,
    $scope.showFinalScore = false,
    $scope.showNewHigh = false,
    $scope.page = Math.floor((Math.random() * 10) + 1);
    $scope.score = 0;
    $scope.questionCounter = 0;

    $scope.questions = $.parseJSON($.ajax({
        url: 'https://pareshchouhan-trivia-v1.p.mashape.com/v1/getQuizQuestionsByCategory?categoryId=' + iCategory + '&limit=10&page=' + $scope.page, // The URL to the API. You can get this by clicking on "Show CURL example" from an API profile
        type: 'GET', // The HTTP Method
        data: {}, // Additional parameters here
        datatype: 'json',
        async: false,
        success: function(data) {
          questions = data; //store data into questions
          console.log("Success!");
          $scope.question = questions[0].q_text;
          $scope.questionText = $scope.htmlDecode($scope.question)

          $scope.option1 = questions[0].q_options_1;
          $scope.option2 = questions[0].q_options_2;
          $scope.option3 = questions[0].q_options_3;
          $scope.option4 = questions[0].q_options_4;

          console.log(questions[0].q_correct_option);
        },
        error: function(err) { alert(err); },
        beforeSend: function(xhr) {
          xhr.setRequestHeader("X-Mashape-Authorization", "rNq9CpOrHzmshInw94Se1tPCb9QFp1YXK58jsnGUStNE114o0T"); // Enter here your Mashape key
        }
      }).responseText);
  },

  $scope.clickNext = function() {
    if ($scope.selection == 0)
    {
      alert("Please select an answer");
    }
    else
    {
      if ($scope.selection == questions[$scope.questionCounter].q_correct_option) {
        $scope.score++;
      }
      if ($scope.questionCounter != 9){
        $scope.questionCounter++;

        $scope.question = questions[$scope.questionCounter].q_text;
        $scope.questionText = $scope.htmlDecode($scope.question)

        $scope.option1 = questions[$scope.questionCounter].q_options_1;
        $scope.option2 = questions[$scope.questionCounter].q_options_2;
        $scope.option3 = questions[$scope.questionCounter].q_options_3;
        $scope.option4 = questions[$scope.questionCounter].q_options_4;

        console.log(questions[$scope.questionCounter].q_correct_option);
      }
      else {
        $scope.showScore = false;
        if ($scope.highScore < $scope.score)
        {
          $scope.highScore = $scope.score;
          $scope.showNewHigh = true;
        }
        $scope.showFinalScore = true;
      }

    }
  },

  $scope.initialize(),

  $('#welcome').click($scope.initialize),
  $('#categories').click($scope.submitName);

});
