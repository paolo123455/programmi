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


var setup3 = function() {
  var miarichista = richiesta
  jsonVar = {"query" : "Select codice, id_progetto from rilatt.progetti" , "richiesta" : richiesta++}
  socket.emit("esegui-query",JSON.stringify(jsonVar))
  socket.on("esegui-query-response", (arg) => {
    console.log(arg.richiesta)
    if (arg.richiesta === miarichista)
    {
    var listaRows = []
    listaRows = arg.rows
    console.log(listaRows)
    listaRows.forEach(element => {
          $('#com').append(' <option>'+element.id_progetto+":"+element.codice +'</option>')

      
    });
  }
  console.log("setup3 eseguito")

  })
  socket.on("esegui-query-errore", (arg) => {
    
    swal({
      title: "ERRORE",
      text: "errore nel setup della pagina, controllare i log per ulteriori dettagli",
      icon: "error",
      dangerMode: true,
    })
    console.log("errore di setup:")
    console.log(arg)

  })

}
var setup2 = function() {
  var miarichista = richiesta
  jsonVar = {"query" : "Select CONCAT(nome, '_', cognome , '_', email) , id_risorsa from rilatt.risorse", "richiesta" : richiesta++}
  socket.emit("esegui-query",JSON.stringify(jsonVar))
  socket.on("esegui-query-response", (arg) => {
    console.log(arg.richiesta + "provaaaaaaa")
    if (arg.richiesta === miarichista)
    {
    var listaRows = []
    listaRows = arg.rows
    console.log(listaRows)
    listaRows.forEach(element => {
          $('#ris').append(' <option>'+element.id_risorsa+":"+element.concat+'</option>')
    })
    console.log("setup1 eseguito")
  }

      
    
   

  })
  socket.on("esegui-query-errore", (arg) => {
    
    swal({
      title: "ERRORE",
      text: "errore nel setup della pagina, controllare i log per ulteriori dettagli",
      icon: "error",
      dangerMode: true,
    })
    console.log("errore di setup:")
    console.log(arg)

  })

}


var setup = function() {
 
   
    var listaMesi = [1,2,3,4,5,6,7,8,9,10,11,12]
    var listaAnni = [22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55]
  
    listaMesi.forEach(element => {
          $('#mes').append(' <option>'+element+'</option>')
    })
    listaAnni.forEach(element => {
      $('#ann').append(' <option>20'+element+'</option>')
    })

    console.log("setup1 eseguito")
  }

      
    




socket.on("esegui-query-delete-response", (arg) => {
  //ListaValori.splice(riga, 1)
  console.log(arg.id_t)
  ListaValori.splice(arg.riga, 1)
  gridOptions.api.applyTransaction({remove:[{id_attivita : arg.id_t }]});
 



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
  
    var id_attivita = ListaValori[riga].id_attivita

    richiesta = contatoreDelete

    var jsonVar = {"query" : "delete  from rilatt.attivita_risorsa  where true and  id_attivita = '" +id_attivita + "'"
    ,richiesta : contatoreDelete++ ,id_t : id_attivita , riga : riga}
    console.log(contatoreDelete)

    socket.emit("esegui-query-delete",JSON.stringify(jsonVar))
}


 var verificaDati = function () {
     let risorsa = $('#ris').val()
    
     let commessa = $('#com').val()

     let giornate = $('#gio').val()

     let  budget = $('#bud').is(":checked")

     let anno = $('#ann').val()

     let mese = $('#mes').val()

     $('#ris').val('')
     $('#com').val('')
     $('#gio').val('')
     $('#bud').val('')
     $('#ann').val('')
     $('#mes').val('')

     var com = commessa.split(":")[0]
     var ris_id = risorsa.split(":")[0]

  
      
     
  
     sendInsert(ris_id , com , giornate, budget , anno , mese )
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

  var aggiugniDatiLista = function(nome, cognome, email)
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
    gridOptions.api.applyTransaction({add:[{id : contatore,  nome : nome, cognome : cognome , email : email, livello : livello }], addIndex:contatore});
    contatore = contatore +1 
   }
  }
    
 function sendInsert(ris_id , com , giornate, budget , anno , mese ) {


     jsonVar = {"query" : "insert into rilatt.attivita_risorsa  (id_progetto, id_risorsa , giornate, flag_budget, flag_attivita , anno ,mese) values ('"+com+"','"+ris_id+"','"+giornate+"',"+budget+","+
                 false+",'"+anno+"','"+mese+"' ) "}
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
      let risorsa = $('#ris').val()
    
      let commessa = $('#com').val()
 
      let giornate = $('#gio').val()
 
      let  budget = $('#bud').is(":checked")
 
      let anno = $('#ann').val()
 
      let mese = $('#mes').val()
    
    if (risorsa != "")var ris = risorsa.split(":")[1].split("_")
    else var ris = risorsa.split("_")
    var com = commessa.split(":")
    console.log(ris)
    //console.log(risorsa+ " " + livello + " " + data)
    sendInsertSelect(ris[0],ris[1],ris[2], com[1] , giornate,budget,anno,mese)

     }

     function sendInsertSelect(nome , cognome , email , commessa, giornate , budget , anno , mese) {

       var condition1 = ""
       var condition2 = ""
       var condition3 = ""
       var condition4 = ""
       var condition5 = ""
       var condition6 = ""
       var condition7 = ""
       var condition8 = ""
       console.log(budget)
       console.log("esecuzione")
       
       
       if (mese != "" && mese != undefined )
       {
              condition8 = " and mese = '" + mese+"' "
       }
       if (anno != "" && anno != undefined )
       {
              condition7 = " and anno = '" + anno+"' "
       }
       if (budget == true  || budget == false)
       {       console.log(budget)
              condition6 = " and flag_budget is  " + budget+" "
       }
      if (commessa != "" && commessa != undefined )
       {
              condition4 = " and codice = '" + commessa+"' "
       }
       if (giornate != ""  && giornate != undefined)
       {
              condition5 = " and giornate = '" + giornate+"' "
       }
       if (nome != "" && nome != undefined )
       {
              condition1 = " and nome = '" + nome+"' "
       }
       if (cognome != "" && cognome != undefined )
       {
              condition2 = " and cognome = '" + cognome+"' "
       }
       if (email != "" && email != undefined )
       {
              condition3 = " and email = '" + email+"' "
       }
         jsonVar = {"query" : "Select * from rilatt.attivita_risorsa  rl " +
         "inner join  rilatt.risorse r on  r.id_risorsa  = rl.id_risorsa " +   
         "inner  join  rilatt.progetti l  on l.id_progetto  = rl.id_progetto  where true " + condition1 + condition2 + condition3 + condition4+condition5 +condition6+condition7+condition8+''}
        
        console.log(jsonVar.query)
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