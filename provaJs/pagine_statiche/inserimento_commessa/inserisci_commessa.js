
      
   const columnDefs = [
    {field: '' ,
    cellRenderer: (params) => {return '<div> <button ><i class="bi bi-trash-fill" style = "color:red"></i></button></div>'}},
    {field : "id_progetto"} , 
     {field : "descrizione", editable : true } , 
     { field: "codice" , editable : true },
     { field: "tipologia" , editable : true },
     { field: "effort_totale" , editable : true} ,
     { field: "effort_pregresso"  , editable : true} ,
     {field : "flag_istituto", editable : true},
     {field : "flag_stato" , editable : true },
     {field : "note", editable : true}
   ];
  
  var vecchioV = ""
  var contatore2 = 0
   var rowData = [
     
     
   ];
 
 
   var gridOptions = {
     columnDefs: columnDefs,
     getRowId: params => params.data.id_progetto ,
     rowData: rowData,

     onCellClicked: function (event) { console.log("funziona!!!"); stampaCoordCella();
     },
     onCellEditingStarted: function(event) {
      vecchioV = event.value; // save this value by attaching it to button or some variable
      console.log('cellEditingStarted');
      },
     onCellValueChanged: function(event) {console.log("evento modifica"); modificaDati(event)}
   }

   

 
   document.addEventListener('DOMContentLoaded', () => {

   
 
    setup()
    setup2()
    aggiornaFiltro()
    
   const gridDiv = document.querySelector('#myGrid');
   new agGrid.Grid(gridDiv, gridOptions) 
 
   })
   contatore = 0; 
   $(document).ready(function () {


     
 
     $('#bottone').on('click', verificaDati)
    
 });