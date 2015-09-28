(function() {

  var app = angular.module('myApp', ['ngRoute'])
                   .controller('mainController', mainCtrl);

  mainCtrl.$inject = ['$scope', '$rootScope', '$location', '$http'];

  function mainCtrl ($scope, $rootScope, $location, $http, mapService) {

    init()

    function init () {
      $http.get('./data/data.json').then(function(resp) {
        console.log(resp.data)
        $scope.data = resp.data;
        setTimeout(function(){ draw(); }, 100);
      });
    }

    function draw () {

      for (var i = 0; i < $scope.data.length; ++i) {
        var item = $scope.data[i];
        d3.select('#'+item.id)
          .append("g")
          .attr("transform", "translate(0, 0)");

        d3.select('#'+item.id)
        .append("polygon")
        .attr("points", getShape(item.this_avg))
        .style("fill", getColor(item.this_avg));

        d3.select('#'+item.id)
        .append("svg:text")
        .attr("x", 55)
        .attr("y", 20)
        .attr("dy", '0.35em')
        .attr("font-weight", '600')
        .attr("fill", "rgb(237, 237, 237)")
        .text(item.this_avg);
      }
    }

    function getColor (value) {
      if (value < 5) {
        return 'rgb(227, 26, 28)';
      }
      else if (value < 5.6) {
        return 'rgb(249, 114, 17)';
      }
      else {
        return 'rgb(31, 120, 180)';
      }
    }

    function getShape(value) {
      var len = value * 25;
      var min = len - 20;
      if (value < 5) {
        return '0,0 ' + min + ',0 ' + len + ',20,' + min + ',40 0,40';
      }
      else if (value < 5.6) {
        return '0,0 ' + min + ',0 ' + len + ',20,' + min + ',40 0,40';
      }
      else {
        return '0,0 ' + min + ',0 ' + len + ',20,' + min + ',40 0,40';
      }
    }
  }

})();
