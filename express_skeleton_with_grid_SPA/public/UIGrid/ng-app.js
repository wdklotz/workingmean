angular.module('ng-app', ['ngTouch', 'ui.grid', 'ui.grid.pagination'])

.controller('ng-appCtrl', ['$scope', '$http', 'uiGridConstants', function($scope, $http, uiGridConstants) {  

  $scope.gridOptions1 = {
    paginationPageSizes: null,
    useCustomPagination: true,
    columnDefs: [
      { name: 'Document', enableSorting: false },
      { name: 'Keywords', enableSorting: false }
      // { name: 'type',  enableSorting: false }
    ]
  };

  $scope.gridOptions2 = {
    paginationPageSizes: null,
    useCustomPagination: true,
    useExternalPagination : true,
    columnDefs: [
      { name: 'id',       enableSorting: false },
      { name: 'Document', enableSorting: true },
      { name: 'author',   enableSorting: true },
      { name: 'type',     enableSorting: true },
      { name: 'shelf',    enableSorting: true },
      { name: 'Keywords', enableSorting: true }

    ],
    onRegisterApi: function(gridApi) {
      gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
        $scope.gridOptions2.data = getPage($scope.grid2data, pageNumber);
      });
    }
  };

// call DB-API
  $http.get('http://127.0.0.1:3000/api/lib')
  .then(function (response) {
    var data = response.data;

    $scope.gridOptions1.data = data;
    $scope.gridOptions1.paginationPageSizes = calculatePageSizes(data);
    // console.log("$scope.gridOptions1.paginationPageSizes= ",$scope.gridOptions1.paginationPageSizes);
  });

// call DB-API
  $http.get('http://127.0.0.1:3000/api/lib')
  .then(function (response) {
    var data = response.data;

    $scope.grid2data = data;
    $scope.gridOptions2.totalItems = 0;//data.length;
    $scope.gridOptions2.paginationPageSizes = calculatePageSizes(data);
    $scope.gridOptions2.data = getPage($scope.grid2data, 1);
  });

  function calculatePageSizes(data) {
    var initials = [];
    return data.reduce(function(pageSizes, row) {
      var initial = row.Document.charAt(0);
      var index = initials.indexOf(initial);
      if(index < 0)
      {
        index = initials.length;
        initials.push(initial);
      }
      pageSizes[index] = (pageSizes[index] || 0) + 1;
      return pageSizes;
    }, []);
  }

  function getPage(data, pageNumber) {
    var initials = [];
    return data.reduce(function(pages, row) {
      var initial = row.Document.charAt(0);

      if(!pages[initial]) pages[initial] = [];
      pages[initial].push(row);

      if(initials.indexOf(initial) < 0)
      {
        initials.push(initial);
        initials.sort();
      }

      return pages;

    }, {})[initials[pageNumber - 1]] || [];
  }
}]);

/*
* for reduce see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
*/
