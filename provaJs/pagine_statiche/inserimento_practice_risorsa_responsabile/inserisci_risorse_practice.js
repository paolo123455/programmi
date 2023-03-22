
      
   const columnDefs = [
    {field: '' ,
    cellRenderer: (params) => {return '<div> <button ><i class="bi bi-trash-fill" style = "color:red"></i></button></div>'}},
    {field : "id_responsabile_practice"} , 
     {field : "id_risorsa"} , 
     { field: "nome"  },
     { field: "cognome" } ,
     { field: "email"  } ,
     {field : "id_practice"},
     {field : "practice"  },
     {field : "data_validita"}
   ];
  
  var vecchioV = ""
  var contatore2 = 0
   var rowData = [
   ];
 
 
   var gridOptions = {
     columnDefs: columnDefs,
     getRowId: params => params.data.id_responsabile_practice ,
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