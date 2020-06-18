angular.module('ngApp')
.controller('deleteDocController', ['$scope','$document','docResource',function($scope,$document,docResource) {
    const scope = $scope;
    const vm    = this;
    const null_doc = {id: '?',Document: 'nothing slected for removal...'};
    vm.selection = scope.gridApi.selection;
//     const ndocs  = vm.selection.getSelectedCount();
//     console.log('ndocs: ',ndocs);
    scope.doc_to_delete = null_doc;

/*
    $('html, body') seems to be the jquery solution for cross-browser scroll animation.
    'html, body' denotes the html element, to go to any other custom element, use '#elementID'
    Here is an example for cross browser animation:
        //('html, body') is the jquery solution for cross browser scroll animation
        $('html, body').animate( {
            scrollTop: $(".abc-container").offset().top+ "-50px"
            }, 300)
    $scope.scrollToTop: found this on: https://gist.github.com/akashrajkn/4351531b513c43fca173; and it works!
    see also: https://stackoverflow.com/questions/19303405/difference-between-html-body-animate-and-body-animate
*/
    vm.scrollToTop = function() {
          $('html, body').animate({
              scrollTop: 0
          }, 'fast'); // 'fast' is for fast animation
          };
    scope.gridApi.selection.on.rowSelectionChanged(scope,function(row) {
        const new_doc = row.entity;
        if (row.isSelected) {
            scope.doc_to_delete = new_doc;
            vm.scrollToTop();
        } else {
            scope.doc_to_delete = null_doc;
            }
        });
    scope.delFromDb = function(id) {
//         docResource.get({id:id}).$promise.then(function(doc) {
//             console.log(doc);
//             });
        docResource.delete({id:id}).$promise.then(function(doc) {
            console.log('deleted',doc);
            });
    };
}]); // deleteDocController
