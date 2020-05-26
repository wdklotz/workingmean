angular.module('ngApp').controller('navBtnsController',       ['$scope','$uibModal','$document','U',function ($scope,$uibModal,$document,U) {
    const scope = $scope;
    const vm = this;
    vm.animationsEnabled = true;
    vm.showHideDiv = false;
    
    vm.uploadClicked = function () {
        console.log("uploadClicked");  
        };
    vm.viewClicked = function () {
        let selection = scope.gridApi.selection;
        // console.log('viewClicked#vm.selection',vm.selection);
        let ndocs = selection.getSelectedCount();
        if (ndocs === 0) return;
        vm.docs = selection.getSelectedRows();
        vm.doc = vm.docs[0];
        U.tbl_log('viewClicked#vm.doc',vm.doc);
        selection.unSelectRow(vm.doc);   // unselect fifo 
        
        let a = document.createElement("a");
        let host = 'http://127.0.0.1:3000/';
        let path = '/UIGrid/store/data/';
        let file = vm.doc.Document;
        a.href   = host+path+file;
        a.target = "_blank";
        a.click();
        document.body.removeChild(a);
   };
    vm.onEdit = function() {
        vm.showHideDiv = !vm.showHideDiv;
    };
    vm.testClicked = function (size) {
        vm.selectedRows = scope.gridApi.selection.getSelectedRows();
        console.log("testClicked: " + vm.selectedRows.length + ' docs selected');
        
        // instantiate modal controller
        const modalInstance = $uibModal.open( { 
            animation: vm.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'modalEditContent.html',
            controller: 'modalController',
            controllerAs: '$modCtrl',
            size: size,
            resolve: {
                size: function() {
                  return size;
                    },
                selection: function() {
                    return vm.selectedRows;
                    }
                }
            });
        
        modalInstance.result.then(function (selectedItem) {
            vm.selected = selectedItem;
            // console.log(selectedItem);
            }, function () {
                // console.log('Modal dismissed at: ' + new Date());
            });
        };
    vm.ATSClicked = function () {
        console.log("ng-click=ATSClicked()");  
        };
}]);
