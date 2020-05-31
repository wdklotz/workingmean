angular.module('ngApp')

.controller('uploadController', ['$scope','$log',function($scope, $log) {
    const vm = $scope;
    vm.nb_files_selected = 0;
    vm.files = [];
    vm.nb_files_toggle = !vm.nb_files_selected;

    vm.fileChanged = function($event) {
        const filelist = $event.target.files;
        vm.nb_files_selected = filelist.length;

        for (var i=0; i<filelist.length; i++) {
            vm.files[i] = filelist.item(i);
            vm.files[i].active = false;
            vm.files[i].humanSize = vm.getHumanSize(vm.files[i].size);
            }
        vm.nb_files_toggle = !vm.nb_files_selected;
    }
    
    vm.btn_clean  = function() {
        vm.files = []
        vm.nb_files_selected = 0;
        vm.nb_files_toggle = !vm.nb_files_selected;
    };
    
    vm.btn_remove = function(file) {
        vm.files.splice(vm.files.indexOf(file), 1);
        vm.nb_files_selected = Object.entries(vm.files).length;
        vm.nb_files_toggle = !vm.nb_files_selected;
    }

    vm.getHumanSize = function(bytes) {
        var sizes = ['n/a', 'bytes', 'KiB', 'MiB', 'GiB', 'TB', 'PB', 'EiB', 'ZiB', 'YiB'];
        var i = (bytes === 0) ? 0 : +Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0) + ' ' + sizes[isNaN(bytes) ? 0 : i + 1];
    }
    
    vm.btn_upload = function() {
        console.log('Upload clicked...');
        var formData = new FormData();
        var file = document.getElementById("files").files;
        console.log(file);
        formData.append('files',files);
        formData.append('xxx','xxxxx');
        var xhr = new XMLHttpRequest();
        xhr.open('post','/multiupload',true);
        xhr.send(formData);
    }
}]);
