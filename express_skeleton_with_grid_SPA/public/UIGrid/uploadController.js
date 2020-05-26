angular.module('ngApp').controller('uploadController',      ['$scope','$log','uploadService',function($scope, $log, uploadService) {
    $scope.nb_files_selected = 0;
    $scope.fileChanged = function($event) {
        const filelist = $event.target.files;
        $scope.nb_files_selected = filelist.length;
        uploadService.logFileList();
        uploadService.addFileList(filelist);
        $scope.filelist = filelist;
    }
    
    $scope.btn_clean  = function() {
        uploadService.removeAll();
        const filelist = uploadService.getFileList();
        $scope.nb_files_selected = Object.entries(filelist).length;
    };
    
    $scope.btn_upload = function() {   // TBD
        $log.info('uploading...');
        uploadService.startUpload({
            url: 'http://127.0.0.1:3000/api/lib/post',
            concurrency: 2,
            onProgress: function(file) {
                $log.info(file.name + '=' + file.humanSize);
                $scope.$apply();
            },
            onCompleted: function(file, response) {
                $log.info(file + 'response' + response);
            }
        });
    };
}]);
