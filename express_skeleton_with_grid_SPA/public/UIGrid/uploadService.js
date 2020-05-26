angular.module('ngApp').service('uploadService', ['$log',function($log) {
    const self = this;
    self.filelist = {};
    self.options = {};
    self.activeUploads = 0;
    self.uploadedFiles = 0;
    $log.info('uploadService loaded');

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

 /*    self.removeFile   = function(file) {
        delete self.fileList.file;  //????? TBD
        // self.files.splice(self.files.indexOf(file), 1);
    };
*/
    self.getHumanSize = function(bytes) {
        var sizes = ['n/a', 'bytes', 'KiB', 'MiB', 'GiB', 'TB', 'PB', 'EiB', 'ZiB', 'YiB'];
        var i = (bytes === 0) ? 0 : +Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0) + ' ' + sizes[isNaN(bytes) ? 0 : i + 1];
    }
    self.startUpload  = function(options) {
        self.options  = options;

        // headers are not shared by requests
        var headers    = options.headers || {};
        var xhrOptions = options.options || {};
        let list       = self.filelist;

        for (var i=0; i<list.length; i++) {
            if (self.activeUploads == self.options.concurrency) break;
            if (list.item(i).active) continue;
            let file = list.item(i);
            self.ajaxUpload(file, options.url, options.data, options.paramName, headers, xhrOptions);
        }
        // self.ajaxUpload1(options.url);
    }
/*    NOTE: das Prinzip....
        var pdf = doc.output(); 
        var data = new FormData();
        data.append("data" , pdf);
        var xhr = new XMLHttpRequest();
        xhr.open( 'post', 'inc/test.php', true ); 
        xhr.send(data);
 */
/*    self.ajaxUpload1 = function(url) {
        console.log('ajaxUpload1#1url',url);
        var txt = "Hello ajax calling from ajaxUpload1()";
        for(let i=0;i<5;i++) txt += txt;
        var data = new FormData();
        data.append('data',txt);
        var xhr = new XMLHttpRequest();
        xhr.open('POST',url,false);
        xhr.send(data);
    };
*/
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
            file.humanSize = self.getHumanSize(event.loaded);
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
