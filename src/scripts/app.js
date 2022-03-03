var app = angular.module('mainApp',['ngSanitize','ngRoute','ui.select2']);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
      templateUrl : "./src/views/home.html",
      controller: "homeCtrl"
    })
    .when("/genrate", {
        templateUrl : "./src/views/genrate.html",
        controller: "genrateCtrl"
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


app.controller('homeCtrl',['$scope','$routeParams','$location','$http', function($scope,$routeParams,$location,$http){

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
            if($routeParams){
                if($routeParams.os != null){
                    $scope.os = [$routeParams.os];
                }
                if($routeParams.module != null){
                    $scope.module = [$routeParams.module];
                }
                if($routeParams.version != null){
                    $scope.version = [$routeParams.version];
                }
            }

        });
    },
    $scope.selectOs = () => {
        var file = null
        $scope.oss.forEach((e) => {
            if (e.name == $scope.os){
                file = e.file
                $http.get("./data/"+file).then(function(response) {
                    $scope.modules = $scope.sortResults(response.data,"name");
                    $scope.installData = [];
                    $scope.cmdLines = []
                    $scope.versions = []
                });
                // $location.url("/?os="+$scope.os+"&module="+$scope.module+"&version="+$scope.version[0])
            }
        })
    },
    $scope.selectModule = () => {
        $scope.modules.forEach((e) => {
            if (e.name == $scope.module){
                $scope.versions = e.versions
                // $scope.version = [$scope.versions[0].version]
                
                // $location.url("/?os="+$scope.os+"&module="+$scope.module+"&version="+$scope.version[0])
                // $scope.selectVersion()
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
                        var url = "/?os="+$scope.os+"&module="+$scope.module+"&version="+e.version
                        $location.url(url)
                    }
                })
            }
        })
        
    }
}]);

app.controller('genrateCtrl',['$scope','$http', function($scope, $http) {
    $scope.links = [];
    $scope.genrateLinks = () => {
        $http.get("./data/os.json").then(function(response) {
            var oss = response.data;
            oss.forEach((e) => {
                var os = e.name;
                $http.get("./data/"+e.file).then(function(response) {
                    var modules = $scope.sortResults(response.data,"name");

                    modules.forEach((m) => {
                        var module = m.name;
                        m.versions.forEach((v) => {
                            var version = v.version
                            var link_line = encodeURI(`https://install-packages.github.io/#!/?os=${os}&module=${module}&version=${version}`)
                            var link = {
                                'text' : `How to install ${module} (${version}) in ${os}`,
                                'link' : link_line
                            }
                            $scope.links.push(link)
                        })
                    })
                });
            })
        });
        console.log($scope.links)
    }
}])