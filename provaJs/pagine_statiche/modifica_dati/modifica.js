

   const columnDefs = [

    {field : "Risorse" ,filter: 'agTextColumnFilter', filterParams : {debounceMs : 0}},
    {field : "totale" },
    {field : "totale_previsto_mese"},
    {field : "assenza/mese"},
    {field : "mese" ,filter: 'agTextColumnFilter' , filterParams : {debounceMs : 0}}
    
     
   ];
   var persone = []
  
   var rowData = [
     
     
   ];
 
 
   var gridOptions = {
     columnDefs: columnDefs,
     rowData: rowData,
     onCellClicked: function (event) { console.log("funziona!!!");// stampaCoordCella()
     },
     onCellValueChanged: function(event) {console.log("evento modifica"); modificaDati(event)}
    
   };
 
  var modificaDati = function(params){
    var nuovoValore = params.value
    var row = params.node.rowIndex
    var column = params.column.colId
    var columnId = params.column.instanceId
    console.log( "1 : ")
    console.log(persone)
    console.log(columnId)
    var flag = true
    var prova =  persone[row].listaCodici.forEach(element => {

        console.log("entrato1 " + element.codice + " " + column)

       if (element.codice.replace('.','_') === column) 
       {   console.log("entrato")
           element.giorni = nuovoValore
           element.editato = true 
           flag = false
       }
    })
    if (flag)
    {   console.log("entrato2")
        persone[row].listaCodici.push({codice : column, giorni : nuovoValore, editato : false, creato : true})
    }
  
    console.log(persone)
  }



 document.addEventListener('DOMContentLoaded', () => {
    var richiestaDati = new XMLHttpRequest()
        richiestaDati.open("get", "http://localhost:8080/dati/commesse" , true)
        richiestaDati.setRequestHeader("Content-Type", "application/json");
        richiestaDati.onload =  function(){
        var responseChiamata = JSON.parse(richiestaDati.response)
        //  console.log(responseChiamata)
         
                for(var i in responseChiamata)
                 {   //console.log(responseChiamata[i])
                    var columnDefs = gridOptions.columnDefs;
                    fieldValue = responseChiamata[i].codice.replace('.','_')
                    columnDefs.push({ field: fieldValue , editable : true});
                    gridOptions.api.setColumnDefs(columnDefs);
                     

                  }  
                }
     
      console.log("fatto "+ gridOptions.columnDefs)
    richiestaDati.send()

    var richiestaDati2 = new XMLHttpRequest()
    richiestaDati2.open("get", "http://localhost:8080/dati/risorse" , true)
    richiestaDati2.setRequestHeader("Content-Type", "application/json");
    richiestaDati2.onload =  function(){
    var responseChiamata2 = JSON.parse(richiestaDati2.response)
      console.log(responseChiamata2)
            var contatore = -1
            for(var i in responseChiamata2)
             {  
          
                var risorsa  = responseChiamata2[i].risorsa
                if(persone.some(item => item.risorsa === risorsa))
                {   var giornate = responseChiamata2[i].giornate_pianificate
                    var codice = responseChiamata2[i].codice
                    persone[contatore].listaCodici.push({codice : codice, giorni : giornate, editato : false, creato : false})
                }
                else 
                {   var giornate = responseChiamata2[i].giornate_pianificate
                    console.log(giornate)
                    console.log(responseChiamata2[i])
                    var codice2 = responseChiamata2[i].codice
                    persone.push({id : contatore , risorsa : risorsa , listaCodici : [{codice : codice2 , giorni : giornate, editato : false, creato : false}] })
                    contatore = contatore +1
                }
                

                //gridOptions.api.applyTransaction({add:[{Risorse : risorsa, totale : 0 , totale_previsto_mese : 0 , "assenza/mese" : 0, mese : 2 }]});
                
                 

              }  
              console.log("testttt"  +persone)
              persone.forEach(element => {
                var codici = []
                var nome = element.risorsa
                codici = element.listaCodici
                var jsonV = {Risorse : nome, totale : 0 , totale_previsto_mese : 0 , "assenza/mese" : 0, mese : 2}
                codici.forEach(element2 => { 
                     
                      codice = element2.codice.replace('.','_')
                      jsonV[codice] = element2.giorni
                })
                console.log(JSON.parse(JSON.stringify(jsonV)))
                gridOptions.api.applyTransaction({add:[jsonV]});
               
               // console.log(element.listaCodici)
                
              });
            }
 
  
    richiestaDati2.send()

    const gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions) 
  
    })




$(document).ready(function () {
   
   var inviaStruttura = function() 
   {

    var inviaS = new XMLHttpRequest()
    inviaS.open("post", "http://localhost:8080/insert/update/dati" , true)
    inviaS.setRequestHeader("Content-Type", "application/json");
    inviaS.onload =  function(){
        console.log(JSON.parse(JSON.stringify(inviaS.response)))
        if (inviaS.response == "ok") {window.location.reload();}
    }
    inviaS.send(JSON.parse(JSON.stringify('{"listaPersone" : ' + JSON.stringify(persone)+ '}')))
   }
   
   
   
   
   
   
    

    $('#bottone').on('click', inviaStruttura)
   
});