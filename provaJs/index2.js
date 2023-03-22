var express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 8080;
const path = require("path")
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const cors = require('cors');

app.use(cors())
const { Pool, Client } = require('pg');
const pool = new Pool({
	host: "10.121.172.33",
	port: 5431,
	user: "admin",
	password: "almawave",
	database: "project_review"
});



/********************************************/
/*				  WEB SOCKET	 		    */
/********************************************/

io.on("connection",async(socketEnt) => {
   
	socketEnt.on("disconnect", (arg) =>{
	  console.log("Server disconnesso")
	})
  
	socketEnt.on("esegui-query", (arg) =>{
	  var dati = JSON.parse(arg);
	  console.log("richiesta numero: "+dati.richiesta)
	  console.log("esecuzione 'esegui-query'  query : "+ dati.query )
	  pool.query(dati.query, function (err, res2) {
		  if(err)console.log(err),  socketEnt.emit("esegui-query-errore",err)
		  else {
			res2["richiesta"] = dati.richiesta
			console.log(res2) ; socketEnt.emit("esegui-query-response",res2)}
		  
	  });
	})
	console.log("connesso")
	socketEnt.emit("connesso", "true")
	socketEnt.on("esegui-query-update", (arg) =>{
		var dati = JSON.parse(arg);
	    
		console.log("esecuzione 'esegui-query'  query : "+ dati.query )
		pool.query(dati.query, function (err, res2) {
			if(err)console.log("errore " + err),err["richiesta"] = dati.richiesta,  socketEnt.emit("esegui-query-update-errore",err)
			else {
				
				  console.log(res2) ; res2["richiesta"] = dati.richiesta; 
			      
			      socketEnt.emit("esegui-query-update-response",res2)
				
				
				}
			
		});
	  })

	  socketEnt.on("esegui-query-delete", (arg) =>{
		var dati = JSON.parse(arg);
	   
		console.log("esecuzione 'esegui-query'  query : "+ dati.query )
		pool.query(dati.query, function (err, res2) {
			if(err)console.log("errore"),console.log(err),err["richiesta"] = dati.richiesta,  socketEnt.emit("esegui-query-delete-errore",err)
			else {console.log(res2)  ;
				 res2["richiesta"] = dati.richiesta;
				 res2["id_t"]  = dati.id_t 
				 res2["riga"] = dati.riga
				 socketEnt.emit("esegui-query-delete-response",res2)
				}
			
		});
	  })

	  
	  
	  
	
  })
  
/********************************************/
/*				  API INTERNE	 		    */
/********************************************/

app.get("/", function (request , response){ 
	//response.sendFile(path.join(__dirname,"/pagine_statiche/inserimento_livello_risorsa/inserimento_livello_risorse.html"))
	//response.sendFile(path.join(__dirname,"/pagine_statiche/inserisci_risorse/inserisciRisorse.html"))
	//response.sendFile(path.join(__dirname,"/pagine_statiche/inserimento_ruolo_risorsa/inserimento_ruolo_risorse.html"))
	//response.sendFile(path.join(__dirname,"/pagine_statiche/inserimento_practice/inserimento_practice.html"))
	//response.sendFile(path.join(__dirname,"/pagine_statiche/inserimento_practice_risorsa_responsabile/inserimento_practice_risorse.html"))
	//response.sendFile(path.join(__dirname,"/pagine_statiche/inserimento_practice_risorsa/inserimento_practice_risorse.html"))
	//response.sendFile(path.join(__dirname,"/pagine_statiche/inserimento_commessa/inserimento_commessa.html"))
	//response.sendFile(path.join(__dirname,"/pagine_statiche/inserimento_commessa_risorsa/inserimento_commessa_risorse.html"))
	console.log(path.join(__dirname,"/pagine_statiche/home/home.html"))
	response.sendFile(path.join(__dirname,"/pagine_statiche/home/home.html"))
})

app.post('/esegui/sql/total', async (req , res) => {
	
	var query = req.body.query
	console.log(query)

	  
	
	pool.query(query , function (err, res2) {
	   
		if (err){ console.log("errore: " + err); res.send(err)}
		else {
		if (res2) console.log("ok: " + res2);res.send(res2)
		}
		
	});

  })



  server.listen(port, function() {
	console.log(`Listening on port ${port}`);
  });
  


  
/********************************************/
/*				 DA ELIMINARE	 		    */
/********************************************/

app.get('/testRest', async (req, res) => {

	
	res.send({"prova" : "prova"})
  
  })
  
