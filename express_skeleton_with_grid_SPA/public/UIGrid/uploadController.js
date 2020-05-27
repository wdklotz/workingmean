angular.module('ngApp')

.controller('uploadController', ['$scope','$log','uploadService',function($scope, $log, uploadService) {
    const vm = $scope;
    vm.nb_files_selected = 0;
    vm.files = [];

    vm.fileChanged = function($event) {
        const filelist = $event.target.files;
        vm.nb_files_selected = filelist.length;

        for (var i=0; i<filelist.length; i++) {
            vm.files[i] = filelist.item(i);
            vm.files[i].active = false;
            vm.files[i].humanSize = uploadService.getHumanSize(vm.files[i].size);
            uploadService.addFileList(vm.files);
            }
    }
    
    vm.btn_clean  = function() {
        vm.files = []
        vm.nb_files_selected = 0;
    };
    
    vm.btn_remove = function(file) {
        vm.files.splice(vm.files.indexOf(file), 1);
        vm.nb_files_selected = Object.entries(vm.files).length;
    }
    
    vm.btn_upload = function() {   // TBD
        $log.info('uploading...');
        uploadService.startUpload({
            url: 'http://127.0.0.1:3000/api/lib/post',
            concurrency: 2,
            onProgress: function(file) {
                // $log.info(file.name + '=' + file.humanSize);
                vm.$apply();
            },
            onCompleted: function(file, response) {
                // $log.info(file + 'response' + response);
            }
        });
    };
}]);
