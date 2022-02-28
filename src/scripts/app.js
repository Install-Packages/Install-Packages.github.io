var app = angular.module('mainApp',['ngSanitize','ngRoute','ui.select2']);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
      templateUrl : "./src/views/home.html",
      controller: "homeCtrl"
    })
  });


app.controller('mainCtrl',['$scope','$http', function($scope,$http) {
    
    $scope.sortResults = function(data, prop, isAsc = true) {
        data.sort(function(a, b) {
            if (isAsc) {
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            } else {
                return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
            }
        });

        return data;
        
    }
    
}])

app.directive('copyToClipboard', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.click(function () {
                if (attrs.copyToClipboard) {
                    
                    var $temp_input = $("<input>");
                    $("body").append($temp_input);
                    var texts = attrs.copyToClipboard.split("//");
                    $temp_input.val(texts[0]).select();
                    document.execCommand("copy");
                    $temp_input.remove();
                    elem.text("Copied")
                    setTimeout(function () {
                        elem.text("Copy")
                    },2000)
                    
                }
            });
        }
    };
});


app.controller('homeCtrl',['$scope','$http', function($scope,$http){

    $scope.oss = [];
    $scope.os = null;
    $scope.modules = [];
    $scope.module = null;
    $scope.versions = [];
    $scope.version = null;
    $scope.installData = [];
    $scope.cmdLines = [];
    
    $scope.getOs = ()=>{
        $http.get("./data/os.json").then(function(response) {
            $scope.oss = response.data;
        });
    },
    $scope.selectOs = () => {
        var file = null
        $scope.oss.forEach((e) => {
            if (e.name == $scope.os){
                file = e.file
                $http.get("./data/"+file).then(function(response) {
                    $scope.modules = $scope.sortResults(response.data,"name");
                    // $scope.modules = response.data

                });
            }
        })
    },
    $scope.selectModule = () => {
        $scope.modules.forEach((e) => {
            if (e.name == $scope.module){
                $scope.versions = e.versions
                $scope.version = $scope.versions[0].version
                $scope.selectVersion()
            }
        })
    },

    $scope.selectVersion = () =>{
        $scope.modules.forEach((e) => {
            if (e.name == $scope.module){
                $scope.versions.forEach((e) => {
                    if(e.version == $scope.version){
                        $scope.installData = e;
                        $scope.cmdLines = e.cmd.split("<br>")
                    }
                })
            }
        })
    }
    


}]);