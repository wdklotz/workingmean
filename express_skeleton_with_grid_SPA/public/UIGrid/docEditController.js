angular.module('ngApp').controller('docEditController',   ['$scope','DocRes','U',function($scope,DocRes,U) {
    const vm = this;
    const scope = $scope;
    
    function render() {
        // U.tbl_log("docEditController#render#vm.doc",vm.doc);
        scope.docInEditForm = vm.doc;
        vm.doc_submit = false;           // submit class btn-toggle
        vm.favChecked   = (vm.doc.Favorite == 'T')? true:false;
        vm.trashChecked = (vm.doc.Trash == 'T')? true:false;
    }
    function init(){
        // U.flow_log("docEditController#init");
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
        // U.tbl_log('docEditController#formSubmit:',vm.doc);
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
        // U.flow_log('docEditController#setChoice');
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
