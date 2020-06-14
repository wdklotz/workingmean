angular.module('ngApp')
.controller('deleteDocController', ['$scope',function($scope) {
    const scope = $scope;
    const vm    = this;
//     vm.notice   = "controller('deleteDocController',...";
//     console.log(vm.notice);
    vm.selection = scope.gridApi.selection;
    const ndocs  = vm.selection.getSelectedCount();
//     console.log('ndocs: ',ndocs)
    if (ndocs === 0) {
        vm.notice = 'nothing to delete!'
    } else {
        const docs = vm.selection.getSelectedRows();
        const doc  = docs[0];
        vm.doc     = Object.assign({},doc);  // oject copy
        vm.notice  = JSON.stringify(vm.doc);
//         vm.selection.unSelectRow(vm.doc);   // unselect fifo
    }
    console.log(vm.notice);
    scope.notice = vm.notice;
}]); // deleteDocController
