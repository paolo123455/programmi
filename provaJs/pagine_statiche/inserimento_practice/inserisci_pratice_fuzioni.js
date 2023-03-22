var socket = io.connect("http://localhost:8080",{
  withCredentials: true,
})

socket.on("connesso", (arg) => {
  console.log('connesso: ' + arg)
})
socket.on("disconnect", (arg) => {
  console.log("disconnesso")
})

var richiesta = 0
var ListaValori = []
var ListaValori2 = []
var contatore = 0
var contatoreDelete = 0

    
   



socket.on("esegui-query-delete-response", (arg) => {
  //ListaValori.splice(riga, 1)
  console.log(arg.id_t)
  ListaValori.splice(arg.riga, 1)
  gridOptions.api.applyTransaction({remove:[{id_practice : arg.id_t }]});
 



})
socket.on("esegui-query-delete-errore", (arg) => {
  
  
  swal({
    title: "ERRORE",
    text: arg.detail,
    icon: "error",
    dangerMode: true,
  })
 

})





var drop = function(riga)
{    console.log(ListaValori)
  console.log(riga)
    console.log(ListaValori[riga]) 
    var practice = ListaValori[riga].practice
    var id_practice = ListaValori[riga].id_practice
  

    //console.log(nome + cognome + email + id_risorsa + " " + id_livello + livello + data_validita)
    var jsonVar = {"query" : ("delete  from rilatt.practice  where true and  descrizione = '" +practice + "'").replace("= 'null'"," is NULL"), richiesta : contatoreDelete++ ,id_t : id_practice , riga : riga}
   
     
    socket.emit("esegui-query-delete",JSON.stringify(jsonVar))
}


 var verificaDati = function () {
     let descrizione = $('#nom').val()
     $('#nom').val('')
     sendInsert(descrizione)
    // aggiugniDatiLista(nome , cognome, email)

    // inviaDati(codice,risorsa,giorni)
    
 }

 /*var modificaDati = function(params){
   
    var nuovoValore = params.value
    var row = params.node.rowIndex
   

    var column = params.column.colId
    var columnId = params.column.instanceId
    var rowValue = params.data
  
    console.log(params)

    console.log(rowValue)
    console.log(row)
    console.log(columnId)
    console.log(column)
    console.log(vecchioV)
    console.log(nuovoValore)
    var email = rowValue.email 
    var nome = rowValue.nome
    var cognome = rowValue.cognome
    var livello = rowValue.livello
    var data = rowValue.data_validita

    console.log(nome + email+cognome+livello+data)
    if (column === "email")
    {

      email = vecchioV
    }
    if (column === "nome")
    {
      nome = vecchioV
    }
    if (column === "cognome")
    {
      cognome = vecchioV
    }
    if (column === "livello")
    {

      livello = vecchioV
    }
    if (column === "data_validita")
    {
      data_validita = vecchioV
    }
   
  
    jsonVar = {"query" : ("update rilatt.risorse set "+column +" = '" + nuovoValore + "' where true and email = '" + email + "' and nome = '"+
     nome + "' and cognome = '"+ cognome + "'").replace("= 'null'"," is NULL")}
   //socket.emit("esegui-query-update",JSON.stringify(jsonVar))
    
    socket.on("esegui-query-update-response", (arg) => {
     
      console.log("update")
      console.log(ListaValori)


    })
    socket.on("esegui-query-update-errore", (arg) => {
      
      swal({
        title: "ERRORE",
        text:  arg.detail,
        icon: "error",
        dangerMode: true,
      })
      console.log("errore update")
    
      gridOptions.api.applyTransaction({update:[{id_risorsa : id_risorsa ,  nome : nome, cognome : cognome , email : email, livello : livello,data_validita : data_validita }]});
  

    })
 }
*/
var stampaCoordCella = function(){
    var focusedCell = gridOptions.api.getFocusedCell();
    console.log(focusedCell.column.colId)
    if(focusedCell.column.colId === "0" )
    {  console.log("drop start " + focusedCell.rowIndex + " " + ListaValori.length)
       drop(focusedCell.rowIndex)
    }
  }

  var aggiugniDatiLista = function(descrizione)
  { 

   var flag = true

   gridOptions.api.getRenderedNodes().forEach((Element) => {

     if(Element.data.descrizione === descrizione)
     { flag = false
    
       swal({
         title: "ERRORE",
         text: "hai già inserito questa risorsa, il  campo non verrà inserito",
         icon: "error",
         dangerMode: true,
       })
     }

   })
   if(flag)
   {
    const d = new Date();
    let month = d.getMonth() +1 ;
    let year = d.getFullYear() ;
    gridOptions.api.applyTransaction({add:[{descrizione : descrizione }], addIndex:contatore});
    contatore = contatore +1 
   }
  }
    
 function sendInsert(descrizione ) {


     jsonVar = {"query" : "insert into rilatt.practice (descrizione) values ('"+descrizione+"' ) "}
    var richiesta3 = new XMLHttpRequest()
    richiesta3.open("post", "http://localhost:8080/esegui/sql/total" , true)
    richiesta3.setRequestHeader("Content-Type", "application/json");
    richiesta3.onload =  function(){
      console.log(richiesta3.response)
      dati = JSON.parse(richiesta3.response)
      if (dati.name === "error")
      {
        
       swal({
        title: "ERRORE",
        text: dati.detail,
        icon: "error",
        dangerMode: true,
      })
      ListaValori = ListaValori2 
      gridOptions.api.setRowData(ListaValori);
      }
      else { 
        aggiornaFiltro()
      }
      

      

  }  
  var t = JSON.stringify(jsonVar)
      richiesta3.send(JSON.parse(JSON.stringify(t)))
      aggiornaFiltro()
  
  
 }


    
 
   
    function aggiornaFiltro() {
      let descrizione = $('#nom').val()
      
    
      console.log(descrizione)
      sendInsertSelect(descrizione )

     }

     function sendInsertSelect(descrizione) {

       var condition1 = ""
    

  
       if (descrizione != "" && descrizione != undefined )
       {
              condition1 = " and descrizione = '" + descrizione+"' "
       }
      
         jsonVar = {"query" : "Select id_practice,  descrizione as practice from rilatt.practice where true " + condition1 +''}
        var richiesta3 = new XMLHttpRequest()
        richiesta3.open("post", "http://localhost:8080/esegui/sql/total" , true)
        richiesta3.setRequestHeader("Content-Type", "application/json");
        richiesta3.onload =  function(){
          console.log(JSON.parse(richiesta3.response))

          var listaRisorse = []
          listaRisorse = JSON.parse(richiesta3.response).rows 
          ListaValori = listaRisorse
          ListaValori2 = listaRisorse
       
          gridOptions.api.setRowData(ListaValori);
         
         

      }  
      var t = JSON.stringify(jsonVar)
      richiesta3.send(JSON.parse(JSON.stringify(t)))
      
     }