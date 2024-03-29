const http = require("http");
const fs = require("fs"); //prace se soubory
const url = require("url"); //prace s adresou požadavku, parametry,...

const zpracovaniChatu = require("./sluzba-chat.js").zpracovaniPozadavku;
const zpracovaniUzivatelu = require("./sluzba-uzivatele.js").zpracovaniPozadavku;

let pocetPozadavku = 0;

function zpracovaniPozadavku(pozadavek, odpoved) {
  pocetPozadavku++; //zvyseni o 1

  console.log("url: " + pozadavek.url);
  console.log("metoda: " + pozadavek.method);

  if (pozadavek.method == "POST") {
    let data = "";
    pozadavek.on('data', function (kusDat) {                       
      data += kusDat;                                              
    })                                                             
    pozadavek.on('end', function () {                              
      if (data) {                                                  
        let parametry = JSON.parse(data);                          
        console.log(parametry);                                    
        if (pozadavek.url.startsWith("/chat")) {
          zpracovaniChatu(pozadavek, parametry, odpoved);
        } else if (pozadavek.url.startsWith("/uzivatele")) {
          zpracovaniUzivatelu(pozadavek, parametry, odpoved);
        } else { //not found
          odpoved.writeHead(404);
          odpoved.end();
        }
      } else {                                                     
        //TODO
      }                                                            
    })
    
  } else if (pozadavek.url == "/") {
    odpoved.writeHead(200, {"Content-type": "text/html"});
    let s = fs.readFileSync("index.html").toString();
    odpoved.end(s);
  } else if (pozadavek.url == "/style.css") {
    odpoved.writeHead(200, {"Content-type": "text/css"});
    let s = fs.readFileSync("style.css").toString();
    odpoved.end(s);
  } else if (pozadavek.url == "/script.js") {
    odpoved.writeHead(200, {"Content-type": "application/javascript"});
    let s = fs.readFileSync("script.js").toString();
    odpoved.end(s);

    
    } else if (pozadavek.url == "/style.css") {
    odpoved.writeHead(200, {"Content-type": "text/css"});
    let s = fs.readFileSync("style.css").toString();

  } else { //not found
    odpoved.writeHead(404);
    odpoved.end();
  }

}

let srv = http.createServer(zpracovaniPozadavku);
srv.listen(8080);
console.log("Aplikace běží na http://localhost:8080...");
