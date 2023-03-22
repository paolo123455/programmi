var socket = io.connect("http://localhost:8080",{
  withCredentials: true,
})

socket.on("connesso", (arg) => {
  console.log('connesso: ' + arg)
})
socket.on("disconnect", (arg) => {
  console.log("disconnesso")
})


var ListaValori = []
var ListaValori2 = []
var contatore = 0





var drop = function(riga)
{    console.log(ListaValori)
  console.log(riga)
    console.log(ListaValori[riga]) 
    var nome = ListaValori[riga].nome
    var cognome = ListaValori[riga].cognome 
    var email = ListaValori[riga].email
    var id = ListaValori[riga].id_risorsa

    console.log(nome + cognome + email + id)
    var jsonVar = {"query" : ("delete  from rilatt.risorse   where true and email = '" +email + "' and nome = '"+
     nome + "' and cognome = '"+ cognome + "'").replace("= 'null'"," is NULL")}
   
     socket.on("esegui-query-delete-response", (arg) => {
      ListaValori.splice(riga, 1)
      gridOptions.api.applyTransaction({remove:[{ id_risorsa : id }]});
   


    })
    socket.on("esegui-query-delete-errore", (arg) => {
      
      swal({
        title: "ERRORE",
        text: arg.detail,
        icon: "error",
        dangerMode: true,
      })
     

    })
    socket.emit("esegui-query-delete",JSON.stringify(jsonVar))
}


 var verificaDati = function () {
     let nome = $('#nom').val()
    
     let cognome = $('#cog').val()

     let email = $('#eme').val()

     $('#nom').val('')
     $('#cog').val('')
     $('#eme').val('')
     
  
     sendInsert(nome , cognome , email)
    // aggiungiDatiLista(nome , cognome, email)

    // inviaDati(codice,risorsa,giorni)
    
 }

 var modificaDati = function(params){
   
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
    var id_risorsa =rowValue.id_risorsa
    console.log(nome + email+cognome+id_risorsa)
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
  
    jsonVar = {"query" : ("update rilatt.risorse set "+column +" = '" + nuovoValore + "' where true and email = '" + email + "' and nome = '"+
     nome + "' and cognome = '"+ cognome + "'").replace("= 'null'"," is NULL")}
    socket.emit("esegui-query-update",JSON.stringify(jsonVar))
    
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
    
      gridOptions.api.applyTransaction({update:[{id_risorsa : id_risorsa ,  nome : nome, cognome : cognome , email : email }]});
  

    })
 }

var stampaCoordCella = function(){
    var focusedCell = gridOptions.api.getFocusedCell();
    console.log(focusedCell.column.colId)
    if(focusedCell.column.colId === "0" )
    {  console.log("drop start " + focusedCell.rowIndex + " " + ListaValori.length)
       drop(focusedCell.rowIndex)
    }
  }

  var aggiungiDatiLista = function(nome, cognome, email)
  { 

   var flag = true

   gridOptions.api.getRenderedNodes().forEach((Element) => {

     if(Element.data.nome === nome && Element.data.cognome === cognome && Element.data.email === email )
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
    gridOptions.api.applyTransaction({add:[{id : contatore,  nome : nome, cognome : cognome , email : email }], addIndex:contatore});
    contatore = contatore +1 
   }
  }
    
 function sendInsert(nome , cognome , email ) {


     jsonVar = {"query" : "insert into rilatt.risorse (nome, cognome , email) values ('"+nome+"','"+cognome+"','"+email+"' ) "}
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
    nome =  $('#nom').val()
    cognome =  $('#cog').val()
    email = $('#eme').val()
    
    console.log(nome + " " + cognome + " " + email)
    sendInsertSelect(nome, cognome , email)

     }

     function sendInsertSelect(nome , cognome , email ) {

       var condition1 = ""
       var condition2 = ""
       var condition3 = ""
        
       if (nome != "" )
       {
              condition1 = " and nome = '" + nome+"' "
       }
       if (cognome != "" )
       {
              condition2 = " and cognome = '" + cognome+"' "
       }
       if (email != "" )
       {
              condition3 = " and email = '" + email+"' "
       }
         jsonVar = {"query" : "Select * from rilatt.risorse where  true " + condition1 + condition2 + condition3 + ' order by id_risorsa'}
        var richiesta3 = new XMLHttpRequest()
        richiesta3.open("post", "http://localhost:8080/esegui/sql/total" , true)
        richiesta3.setRequestHeader("Content-Type", "application/json");
        richiesta3.onload =  function(){
          console.log(JSON.parse(richiesta3.response))

          var listaRisorse = []
          listaRisorse = JSON.parse(richiesta3.response).rows 
          ListaValori = listaRisorse
          ListaValori2 = listaRisorse
          console.log( ListaValori)
          gridOptions.api.setRowData(ListaValori);
         
          listaRisorse.forEach((Element) => {
               console.log(Element)
              // aggiugniDatiLista(Element.nome, Element.cognome, Element.email)

          })

      }  
      var t = JSON.stringify(jsonVar)
      richiesta3.send(JSON.parse(JSON.stringify(t)))
      
     }