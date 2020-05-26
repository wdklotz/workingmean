(function() {
'use strict';

var myApp = angular.module('ng-app',['ngRoute','ngTouch','ui.grid','ui.grid.pagination','ui.grid.resizeColumns','ui.grid.selection','ui.grid.cellNav','ngAnimate','ui.bootstrap','ngResource','ngSanitize','ui.select']);

myApp.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider) {
    $routeProvider.when('/first', {
        template: '<h1>this is the #/first hashtag route</h1>',
    }).when('/ats', {
        // template: "<h1>{{notice}}</h1><h3>click browser's <b>&larr;</b> arrow to go back</h3>",            
        templateUrl: 'ats.html',
        controller: 'ats-ctrl'
    }).when('/fileUpload', {
        templateUrl : 'fileUpload.html',
        controller : 'uploadCtrl'
    }).otherwise({ redirectTo: '/'});
    
    $locationProvider.hashPrefix('');
}]);

myApp.controller('ats-ctrl',        ['$scope',function($scope) {
    $scope.notice = "controller('ats-ctrl',...";
    console.log($scope.notice);
    $scope.contacts = [
        { name: 'Shuvro', number: '1234' },
        { name: 'Ashif', number: '4321' },
        { name: 'Anik', number: '2314' }
    ];
}]);
myApp.controller('ng-app-ctrl',     ['$scope', '$http', 'uiGridConstants', 'DocRes',function($scope, $http, uiGridConstants, DocRes) {  

    const scope = $scope;
    scope.grid1Options = {
        enableRowSelection: true,
        enableSelectAll: true,
        multiSelect: true,
        selectionRowHeaderWidth: 35,
        useCustomPagination: false,
        useExternalPagination : false,
        enableFiltering: true,
        paginationPageSizes: [10, 15, 20, 30, 50, 100],
        paginationPageSize: 20,
        enableGridMenu: true,
        enableColumnResizing: true,
        columnDefs: [
            { name: 'id',       enableSorting: true, width: '5%' },
            { name: 'Document', enableSorting: true, width: '25%', cellTooltip: true },
            { name: 'Author',   enableSorting: true, width: '10%'  },
            { name: 'Type',     enableSorting: true, width: '10%'  },
            { name: 'Shelf',    enableSorting: true, width: '10%'  },
            { name: 'Keywords', enableSorting: true, cellTooltip: true},
            { name: 'Favorite', enableSorting: true, width: 63, displayName: 'FAV'},
            { name: 'Trash',    enableSorting: true, width: 65, displayName: 'TR'}
        ]};

    scope.grid1Options.onRegisterApi = function(gridApi){
        // set gridApi on scope but ignore rowSelectionChanged event
        scope.gridApi = gridApi;
        
        // gridApi.selection.on.rowSelectionChanged($scope,function(row){
        // const msg = 'row changed ';
        // console.log(msg,row);
        // console.log(gridApi.selection.getSelectedRows()); 
        // });
    };

    // call DB-API via DocRes resource
    scope.grid1Options.data = DocRes.query();
/*
    // call DB-API via $http
    $http.get('/api/lib/38').then(function (response) {
        scope.grid1Options.data = response.data;
        console.log('$http response: ',scope.grid1Options.data);
    }, function(errResponse) {
        console.error('Error while fetching document');
    });
*/
}]);
myApp.controller('btns-ctrl',       ['$scope','$uibModal','$document','U',function ($scope,$uibModal,$document,U) {
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
            controller: 'modal-edit-ctrl',
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
myApp.controller('modal-edit-ctrl', ['$uibModalInstance','size','selection',function ($uibModalInstance,size,selection) {
    const vm = this;
    // console.log(size, selection);
    vm.selection = selection;
    
    // init selection with item[0]
    vm.selected = {
        item: vm.selection[0]
    };
    vm.ok = function () {
        $uibModalInstance.close(vm.selected.item);
    };
    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);
myApp.controller('doc-edit-ctrl',   ['$scope','DocRes','U',function($scope,DocRes,U) {
    const vm = this;
    const scope = $scope;
    
    function render() {
        // U.tbl_log("doc-edit-ctrl#render#vm.doc",vm.doc);
        scope.docInEditForm = vm.doc;
        vm.doc_submit = false;           // submit class btn-toggle
        vm.favChecked   = (vm.doc.Favorite == 'T')? true:false;
        vm.trashChecked = (vm.doc.Trash == 'T')? true:false;
    }
    function init(){
        // U.flow_log("doc-edit-ctrl#init");
        let ndocs;
            vm.selection = scope.gridApi.selection;
            ndocs = vm.selection.getSelectedCount();
            // console.log('ndocs: ',ndocs)
            if (ndocs === 0) {
                vm.doc = {'Author':"",'Type':"",'Shelf':""};
                vm.btns_hidden = true; 
            } else {
                vm.docs = vm.selection.getSelectedRows();
                vm.doc = vm.docs[0];
                vm.doc_0 = Object.assign({},vm.doc);
                vm.btns_hidden = false;
                vm.selection.unSelectRow(vm.doc);   // unselect fifo        
            }
        render();
    }
    init();
    
    vm.formReset = function() {
        vm.selection.selectRow(vm.doc);
        vm.doc.Author   = vm.doc_0.Author;
        vm.doc.Type     = vm.doc_0.Type;
        vm.doc.Shelf    = vm.doc_0.Shelf;
        vm.doc.author   = vm.doc_0.author;
        vm.doc.type     = vm.doc_0.type;
        vm.doc.shelf    = vm.doc_0.shelf;
        vm.doc.Keywords = vm.doc_0.Keywords;
        vm.doc.Favorite = vm.doc_0.Favorite;
        vm.doc.Trash    = vm.doc_0.Trash;
        render();              // <-- render the grid
        scope.AuthorChoice();  // <-- update the select2 controllers 
        scope.TypeChoice();
        scope.ShelfChoice();
    };

/*  // mock data
    const docs = [   
    {id: 24, 
        Document: 'ssc-138.pdf', 
        Author: 'Forest', 
        Type:'Article',
        Shelf:'Integrator',
        Keywords:'canonical, integrator, circular',
        F:'F',T:'F'},
    {id: 25, 
        Document: 'pramana_symplectic.pdf',
        Author: 'Rangarajan', 
        Type:'Article',
        Shelf:'Integrator',
        Keywords:'symplectic, integrator, runge-kutta, hamiltonian',
        F:'T',T:'F'},
    {id: 26, 
        Document: 'P_J_Channell_1990_Nonlinearity_3_001.pdf',
        Author: 'Diverse et.al', 
        Type:'Article',
        Shelf:'Accelerator',
        Keywords:'symplectic, integrator, runge-kutta, hamiltonian',
        F:'T',T:'F'},
    {id: 27, 
        Document: 'Generalized_Courant-Snyder...Quin.Davidson,Chung.Burby.pdf',
        Author: 'Choose...', 
        Type:'Article',
        Shelf:'Linear Theory',
        Keywords:'linear',
        F:'F',T:'F'}
    ];
*/    

    vm.formSubmit = function() {
        // update db with form-data
        vm.doc.Favorite = (vm.favChecked)? 'T':'F';
        vm.doc.Trash    = (vm.trashChecked)? 'T':'F';
        // U.tbl_log('doc-edit-ctrl#formSubmit:',vm.doc);
        vm.doc.$update();
        vm.doc_submit = true;  // btn toggle
    };

/*  // THE closure HACK!!! but it works !!!    
*   using a CLOSURE here is perhaps a too big hack that isn't worth it
*   choiceObjects: an array of {name:,id:} objects to select from
*   choice: the selected {name:,id:} object 
*   link: the link in doc-table that point to the corresponding entry in the linked table, i.e. one of doc-author,doc-shelf or doc-type
*
*   performs something equivalent like: SELECT * FROM choiceObjects AS c WHERE c.id = link
*/
    scope.setChoice = function (choiceObjects,choice,link) {
        // U.flow_log('doc-edit-ctrl#setChoice');
        let objects = choiceObjects;
        let ch = choice;
        let fn = function () {
        for(let [key,val] of Object.entries(objects)) {
            if(val.id === link) {
                ch.selectedValue = objects[key];
                // console.log('val.id',val.id);
                // console.log('objects[key]',objects[key]);
                break;
            }
        }};
        return fn;
    }; 
/*  function getKeyByValue(object,value) {
        return Object.keys(object).find(key => object[key] === value);
    }
*/
}]);
myApp.controller('AuthCtrl',        ['$scope','AuthorRes','Trafo','U', function ($scope,AuthorRes,Trafo,U) {
    const vm = this;
    const scope = $scope;

    vm.disabled = false;
    vm.searchEnabled = true;
    vm.authorObj = {};
    vm.choice = {};
    vm.authTable;
    const docInEditForm = scope.docInEditForm;
    // U.tbl_log('AuthCtrl#query#docInEditForm',docInEditForm);

    AuthorRes.query([],function(value) {
        vm.authTable = value;  //<-- that's the table from db
        // U.tbl_log('AuthCtrl#query#vm.authorObj',vm.authTable);
        vm.authorObj = Trafo.toSelect2(vm.authTable,'Author');  //<-- that's the object select2 wants to see
        // U.tbl_log('AuthCtrl#query#vm.authorObj',vm.authorObj);
        
        /* <-- SELECT * FROM authorObj AS c WHERE c.id = docInEditForm.author --> */
        let AuthorChoice = scope.$parent.AuthorChoice = scope.$parent.setChoice(vm.authorObj,vm.choice,docInEditForm.author); 
        AuthorChoice();
        // U.tbl_log(vm.choice);
    });
/*
    // function setChoice() {
        // for(let [key,val] of Object.entries(vm.authorObj)) {
            // if(val.id === docInEditForm.author) {
                // vm.choice.selectedValue = vm.authorObj[key];
                console.log('vm.choice.selectedValue: ',vm.choice.selectedValue);
                // break;
            // }
        // }
    // }

    // scope.$parent.AuthorChoice = setChoice;    // the hack!!! but it works
*/    
    vm.onSelect = function($item) {
        scope.docInEditForm.author = $item.id;
        scope.docInEditForm.Author = $item.name;
        // U.tbl_log('AuthCtrl#onSelect',scope.docInEditForm);
    };
}]);
myApp.controller('TypeCtrl',        ['$scope','TypeRes','Trafo','U', function ($scope,TypeRes,Trafo,U) {
    const vm = this;
    const scope = $scope;

    vm.disabled = false;
    vm.searchEnabled = true;
    vm.typeObj = {};
    vm.choice = {};
    vm.typeTable;
    const docInEditForm = scope.docInEditForm;

    TypeRes.query([],function(value) {
        vm.typeTable = value;
        vm.typeObj = Trafo.toSelect2(vm.typeTable,'Type');
        let TypeChoice = scope.$parent.TypeChoice = scope.$parent.setChoice(vm.typeObj,vm.choice,docInEditForm.type); 
        TypeChoice();
    });

    vm.onSelect = function($item) {
        scope.docInEditForm.type = $item.id;
        scope.docInEditForm.Type = $item.name;
    };
}]);
myApp.controller('ShelfCtrl',       ['$scope','ShelfRes','Trafo','U', function ($scope,ShelfRes,Trafo,U) {
    const vm = this;
    const scope = $scope;

    vm.disabled = false;
    vm.searchEnabled = true;
    vm.shelfObj = {};
    vm.choice = {};
    vm.shelfTable;
    const docInEditForm = scope.docInEditForm;

    ShelfRes.query([],function(value) {
        vm.shelfTable = value;
        vm.shelfObj = Trafo.toSelect2(vm.shelfTable,'Shelf');
        let ShelfChoice = scope.$parent.ShelfChoice = scope.$parent.setChoice(vm.shelfObj,vm.choice,docInEditForm.shelf); 
        ShelfChoice();
    });

    vm.onSelect = function($item) {
        scope.docInEditForm.shelf = $item.id;
        scope.docInEditForm.Shelf = $item.name;
    };
}]);
myApp.controller('uploadCtrl',      ['$scope','$log','uiUploader',function($scope, $log, uiUploader) {
    $scope.nb_files_selected = 0;
    $scope.fileChanged = function($event) {
        const filelist = $event.target.files;
        $scope.nb_files_selected = filelist.length;
        uiUploader.addFileList(filelist);
        uiUploader.logFileList();
    }
    
    $scope.btn_clean  = function() {
        uiUploader.removeAll();
        const filelist = uiUploader.getFileList();
        $scope.nb_files_selected = Object.entries(filelist).length;
    };
    
    $scope.btn_upload = function() {   // TBD
        $log.info('uploading...');
        uiUploader.startUpload({
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
myApp.controller('form1Ctrl',['$scope',function($scope){
    const scope = $scope;
}]);  // form1Ctlr

myApp.factory('DocRes',     ['$resource', function($resource) {
    return $resource('/api/lib/:id',
        {id:'@id'},
        {update: {method: 'PUT'}} // there is no HTTP PUT support available per default !!!
        );
}]);
myApp.factory('AuthorRes',  ['$resource', function($resource) {
    return $resource('/api/authors/:id',{});
}]);
myApp.factory('TypeRes',    ['$resource', function($resource) {
    return $resource('/api/types/:id',{});
}]);
myApp.factory('ShelfRes',   ['$resource', function($resource) {
    return $resource('/api/shelfs/:id',{});
}]);
myApp.factory('Trafo',      [function() {
    const fn = function(items, label) {
        let out = [];
        for (let i=0; i < items.length; i++) {
           out[i] = {name: items[i][label], id:items[i].id};
       }
       return out;
    };
    return {
        toSelect2: fn
    };
}]);
myApp.factory('U',          [function() {
// Utilities service
    function app_log() {
        if(true) {
            for(let i=0; i<arguments.length; i++) {
                console.log(arguments[i]);
            }
        }
    };
    function tbl_log(t,o){
        if(true) {
            console.log(t);
            console.table(o);
        }
    };
    function flow_log(name) {
        if(true) console.log("============================< "+name+" >");
    };
    return {
        app_log:  app_log,
        tbl_log:  tbl_log,
        flow_log: flow_log
    };
}]);

myApp.filter('propsFilter', [function() {
// a NO-filter filter
  return function(items, props) {
    let out = [];
    // Let the output be the input untouched
    out = items;
    return out;
  };
}]);

myApp.directive("ngUploadChange",function(){
    return{
        scope:{
            ngUploadChange:"&"
            },
        link: function($scope, $element, $attrs) {
            // NOTE: $element.on() adds an ebvent listener, here 'change'
            $element.on("change",function(event) {
                $scope.$apply(function(){
                    // NOTE: ngUploadChange() is bound to uploadCtrl filechanged($event) in HTML-template
                    $scope.ngUploadChange({$event: event})
                })
            })
            $scope.$on("$destroy",function() {
                // NOTE: jQuery: remove event handlers
                $element.off();
            });
        }
    }
});  

myApp.service('uiUploader', ['$log',function($log)
 {
    const self = this;
    self.files = [];
    self.filelist = {};
    self.options = {};
    self.activeUploads = 0;
    self.uploadedFiles = 0;
    $log.info('uiUploader loaded');

    self.addFileList  = function (filelist) { 
        let list = self.filelist = filelist; 
        for (var i=0; i<list.length; i++) {
            list.item(i).active = false;
        }
    };
    self.getFileList  = function() { return self.filelist; };    
    self.logFileList  = function() {
        let list = self.filelist;
        for (var i=0; i<list.length; i++) {
            $log.info(list.item(i));
            }
    };
    self.removeAll    = function() {
        self.filelist = {};
    };
    self.removeFile   = function(file) {
        delete self.fileList.file;  //????? TBD
        // self.files.splice(self.files.indexOf(file), 1);
    };
    self.getHumanSize = function(bytes) {
        var sizes = ['n/a', 'bytes', 'KiB', 'MiB', 'GiB', 'TB', 'PB', 'EiB', 'ZiB', 'YiB'];
        var i = (bytes === 0) ? 0 : +Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0) + ' ' + sizes[isNaN(bytes) ? 0 : i + 1];
    }
    self.startUpload  = function(options) {
        self.options = options;

        //headers are not shared by requests
        var headers = options.headers || {};
        var xhrOptions = options.options || {};
        // let list = self.filelist;

        // for (var i=0; i<list.length; i++) {
            // if (self.activeUploads == self.options.concurrency) {
                // break; }
            // if (list.item(i).active) continue;
            
            // let file = list.item(i);
            
            // self.ajaxUpload(file, options.url, options.data, options.paramName, headers, xhrOptions);
        // }
        self.ajaxUpload1(options.url);
    }
/*
    NOTE: das Prinzip....
        var pdf = doc.output(); 
        var data = new FormData();
        data.append("data" , pdf);
        var xhr = new XMLHttpRequest();
        xhr.open( 'post', 'inc/test.php', true ); 
        xhr.send(data);
*/
    self.ajaxUpload1 = function(url) {
        console.log('ajaxUpload1#1url',url);
        var txt = "Hello ajax calling from ajaxUpload1()";
        for(let i=0;i<5;i++) txt += txt;
        var data = new FormData();
        data.append('data',txt);
        var xhr = new XMLHttpRequest();
        xhr.open('POST',url,false);
        xhr.send(data);
    };
    
    self.ajaxUpload = function(file, url, data, key, headers, xhrOptions) {
        // const path = 'C:/Users/wdklotz/workingmean/express_skeleton_with_grid_SPA/public/UIGrid/store/data/';
       var xhr, formData, prop;
        data = data || {};
        key = key || 'file';

        self.activeUploads += 1;
        file.active = true;
        xhr = new window.XMLHttpRequest();

        // To account for sites that may require CORS
        if (xhrOptions.withCredentials === true) {
            xhr.withCredentials = true;
        }

        formData = new window.FormData();
        xhr.open('POST', url);
        if (headers) {
            for (var headerKey in headers) {
                if (headers.hasOwnProperty(headerKey)) {
                    xhr.setRequestHeader(headerKey, headers[headerKey]);
                }
            }
        }

        // Triggered when upload starts:
        xhr.upload.onloadstart = function() {
        };

        // Triggered many times during upload:
        xhr.upload.onprogress = function(event) {
            if (!event.lengthComputable) {
                return;
            }
            // Update file size because it might be bigger than reported by
            // the fileSize:
            //$log.info("progres..");
            //console.info(event.loaded);
            file.loaded = event.loaded;
            file.humanSize = getHumanSize(event.loaded);
            if (angular.isFunction(self.options.onProgress)) {
                self.options.onProgress(file);
            }
        };

        // Triggered when the upload is successful (the server may not have responded yet).
        xhr.upload.onload = function() {
            if (angular.isFunction(self.options.onUploadSuccess)) {
                self.options.onUploadSuccess(file);
            }
        };

        // Triggered when upload fails:
        xhr.upload.onerror = function(e) {
            if (angular.isFunction(self.options.onError)) {
                self.options.onError(e);
            }
        };

        // Triggered when the upload has completed AND the server has responded. Equivalent to listening for the readystatechange event when xhr.readyState === XMLHttpRequest.DONE.
        xhr.onload = function () {
            self.activeUploads -= 1;
            self.uploadedFiles += 1;

            self.startUpload(self.options);  // next file

            if (angular.isFunction(self.options.onCompleted)) {
                self.options.onCompleted(file, xhr.responseText, xhr.status);
            }
            if (self.activeUploads === 0) {
                self.uploadedFiles = 0;
                if (angular.isFunction(self.options.onCompletedAll)) {
                    self.options.onCompletedAll(self.files);
                }
            }
        };
        // Append additional data if provided:
        if (data) {
            for (prop in data) {
                if (data.hasOwnProperty(prop)) {
                    formData.append(prop, data[prop]);
                }
            }
        }

        // Append file data:
        formData.append(key, file, file.name);
        
        // for(var element of formData) console.log('formData.entries()',element);

        // Initiate upload:
        xhr.send(formData);

        return xhr;
    }
 }]);
  
})();

/* NOTES
* for reduce see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
* for ui-bootstrap see: https://angular-ui.github.io/bootstrap/
* for uibModal see: https://github.com/angular-ui/bootstrap/tree/master/src/modal
* for <script type="text/ng-template> a.k.a. inlined template see :
*   https://docs.angularjs.org/api/ng/directive/script
* for AngularJS-native version of Select2 see: https://github.com/angular-ui/ui-select 
*   in relation: jQuery Select2: https://select2.org/
* for CommonJs and ES modules: https://flaviocopes.com/commonjs/
* for download pdf file with $http.get() see:
*   https://stackoverflow.com/questions/14215049/how-to-download-file-using-angularjs-and-calling-mvc-api
* and/or: 
*   https://gist.github.com/MarkLavrynenko/5b763e36b128170cdb77   
* for ui-uploader see:  https://github.com/angular-ui/ui-uploader
* for server-side filesystem actions see: https://nodejs.org/api/fs.html and https://dev.to/mrm8488/from-callbacks-to-fspromises-to-handle-the-file-system-in-nodejs-56p2
* for server-side MD5 creation see: https://www.npmjs.com/package/md5-file
* for multiple file input with ngUploadChange directive see:
*   https://stackoverflow.com/questions/20146713/ng-change-on-input-type-file/41557378
*/
