async function poNacteni() {
  document.getElementById("zprava").addEventListener("keydown", stiskKlavesyDolu);

  ukazPrihlaseni();
}

function stiskKlavesyDolu(udalost) {
  //console.log(udalost);
  if (udalost.key == "Enter") {
    odesliZpravu();
  }
}

async function nactiZpravy() {
  //sestaveni url vcetne parametru
  let url = location.href + "chat/nacti";
  let body = {};
  body.token = tokenUzivatele;
  let response = await fetch(url,{method: "POST", body: JSON.stringify(body)});
  let data = await response.json();
  //console.log(data);

  if (data.stav != "ok") {
    console.error(data.chyba);
    return;
  }


  let s = "";
  for (let zprava of data.zpravy) {
    let dt = new Date(zprava.cas); //nastavi datum a cas podle ms v parametru
    let radek = "";
    radek = "<tr><td>" + dt.toLocaleDateString() + "</td><td>"
      + zprava.prezdivka + "</td><td>"
      + "<a href='"+zprava.odkaz+ "' target='_blank'>"+zprava.text+"</a>" + "</td><td style='text-align: center;'>"
      + zprava.ho 
    if (zprava.prezdivka == plnejmeno) {
      radek = radek + "</td><td style='text-align: center;'>" 
      + "<i class='material-icons' style='color: #16a085; cursor: pointer; font-size: 16px;' onclick='upravZaznam(`" + zprava.id + "`,`" + zprava.text + "`,`" + zprava.odkaz + "`,`" + zprava.ho + "`)'>edit</i>"
      + "<i class='material-symbols-outlined'style='color: #16a085; cursor: pointer; font-size: 16px;' onclick='upravZaznam(`" + zprava.id + "`,`" + zprava.text + "`,`" + zprava.odkaz + "`,`" + zprava.ho + "`)'>task__alt</i>"
      + " "
      + "<i class='material-icons' style='color: #16a085; cursor: pointer; font-size: 16px;' onclick='smazZaznam(" + zprava.id + ")'>delete</i>"
      +" </td></tr>";  
      +  "<i class='material-icons' style='color: #16a085; cursor: pointer; font-size: 16px;' onclick='upravZaznam(`" + zprava.id + "`,`" + zprava.text + "`,`" + zprava.odkaz + "`,`" + zprava.ho + "`)'>edit</i>"
         
    } 
   
    else {
      radek = radek + "</td><td style='text-align: center;'></td></tr>";
    }
    s = radek + s;
  }
  s = "<th></th><table id='seznam'><tr><th>Datum</th><th>Jméno</th><th>Přání</th><th>Priorita</th><th>Úpravy</th>" + s + "</table>"
  document.getElementById("zpravy").innerHTML = s;
}

async function odesliZpravu() {
  //nacteni vstupu ze stranky
  let z = document.getElementById("zprava").value;
  let odkaz = document.getElementById("odkaz").value;
  let ho = document.getElementById("hodnoceni").value;
  let id = Math.floor(Math.random() * 1000000);
  document.getElementById("zprava").value = "";
  document.getElementById("hodnoceni").value = "";
  document.getElementById("zprava").focus();
  alert("Zpráva je odeslána.");

  if (z == "") return; //pri prazdne zprave se funkce hned ukonci

  //sestaveni url vcetne parametru
  let url = location.href + "chat/pridej";
  let body = {};
  body.token = tokenUzivatele;
  body.prezdivka = plnejmeno;
  body.text = z;
  body.odkaz = odkaz;
  body.ho = ho;
  body.id = id;
  
  
  let response = await fetch(url,{method: "POST", body: JSON.stringify(body)});
  let data = await response.json();
  
  console.log(data);

  //vysledek
  //document.getElementById("vysledek").innerHTML = data.vysledek;
}
x 
async function registruj() {
  //nacteni vstupu ze stranky
  let plnejm = document.getElementById("plnejmeno").value;
  let prihljm = document.getElementById("prihljmeno").value;
  let heslo = document.getElementById("heslo").value;
  let heslo2 = document.getElementById("heslo2").value;

  if (prihljm == "") {
    alert("Prazdne prihlasovaci jmeno!");
    return;
  }
  if (heslo == "") {
    alert("Prazdne heslo!");
    return;
  }
  if (heslo != heslo2) {
    alert("Chybne zopakovane heslo!");
    return;
  }

  //sestaveni url vcetne parametru
  let url = location.href + "uzivatele/registruj";
  let body = {};
  body.plnejmeno = plnejm;
  body.prihljm = prihljm;
  body.heslo = heslo;
  let response = await fetch(url,{method: "POST", body: JSON.stringify(body)});
  let data = await response.json();
  console.log(data);

  if (data.stav != "ok") {
    alert(data.chyba);
    return;
  }

  ukazPrihlaseni();

  //vysledek
  //document.getElementById("vysledek").innerHTML = data.vysledek;
}

let tokenUzivatele;
let plnejmeno;
async function prihlas() {
  //nacteni vstupu ze stranky
  let prihljm = document.getElementById("loginprihljmeno").value;
  let heslo = document.getElementById("loginheslo").value;

  //sestaveni url vcetne parametru
  let url = location.href + "uzivatele/prihlas";
  let body = {};
  body.prihljm = prihljm;
  body.heslo = heslo;
  let response = await fetch(url,{method: "POST", body: JSON.stringify(body)});
  let data = await response.json();
  console.log(data);

  if (data.stav != "ok") {
    alert(data.chyba);
    return;
  }
  
  //vysledek
  tokenUzivatele = data.token;
  plnejmeno = data.plnejmeno;
  setInterval(nactiZpravy, 1000);
  ukazKomunikaci();
}

async function smazZaznam(id) {
  //nacteni vstupu ze stranky
  
  //sestaveni url vcetne parametru
  let url = location.href + "chat/smaz";
  let body = {};
  body.token = tokenUzivatele;
  body.id = id;
  let response = await fetch(url,{method: "POST", body: JSON.stringify(body)});
  let data = await response.json();

  if (data.stav != "ok") {
    alert(data.chyba);
    return;
  }
  //vysledek
  
  //ukazKomunikaci();
}

async function zmenZpravu() {
  //nacteni vstupu ze stranky
  
  //sestaveni url vcetne parametru
  let z = document.getElementById("zprava").value;
  let odkaz = document.getElementById("odkaz").value;
  let ho = document.getElementById("hodnoceni").value;
  let id = document.getElementById("zpravaid").value;
  let url = location.href + "chat/uprav";
  let body = {};
  body.token = tokenUzivatele;
  body.prezdivka = plnejmeno;
  body.text = z;
  body.odkaz = odkaz;
  body.ho = ho;
  body.id = id;
  
  zrusit();
  let response = await fetch(url,{method: "POST", body: JSON.stringify(body)});
  let data = await response.json();
  if (data.stav != "ok") {
    alert(data.chyba);
    return;
  }
}
  function rezrvace(id, text, odkaz,){
  document.getElementById("zprava").value = text;
  document.getElementById("odkaz").value = odkaz;
  document.getElementById("zpravaid").value = id;
  document.getElementById("vlozit").style.display = "none";
  document.getElementById("upravit").style.display = "block";
  document.getElementById("zprava").focus();
  }

  function upravZaznam(id, text, odkaz, ho) {
  document.getElementById("zprava").value = text;
  document.getElementById("odkaz").value = odkaz;
  document.getElementById("hodnoceni").value = ho;
  document.getElementById("zpravaid").value = id;
  document.getElementById("vlozit").style.display = "none";
  document.getElementById("upravit").style.display = "block";
  document.getElementById("zprava").focus();
}

async function zrusit() {
  document.getElementById("zprava").value = "";
  document.getElementById("odkaz").value = "";
  document.getElementById("hodnoceni").value = "";
  document.getElementById("vlozit").style.display = "block";
  document.getElementById("upravit").style.display = "none";
  document.getElementById("zprava").focus();
}

function ukazRegistraci() {
  document.getElementById("oblast_registrace").style.display = "block";
  document.getElementById("oblast_prihlaseni").style.display = "none";
  document.getElementById("oblast_komunikace").style.display = "none";
  document.getElementById("zpravy").style.display = "none";
}

function ukazPrihlaseni() {
  document.getElementById("oblast_registrace").style.display = "none";
  document.getElementById("oblast_prihlaseni").style.display = "block";
  document.getElementById("oblast_komunikace").style.display = "none";
  document.getElementById("zpravy").style.display = "none";
}

function ukazKomunikaci() {
  document.getElementById("oblast_registrace").style.display = "none";
  document.getElementById("oblast_prihlaseni").style.display = "none";
  document.getElementById("oblast_komunikace").style.display = "block";
  document.getElementById("vlozit").style.display = "block";
  document.getElementById("upravit").style.display = "none";
  document.getElementById("zpravy").style.display = "block";
}

function odhasitse(){
  document.getElementById("oblast_registrace").style.display = "none";
  document.getElementById("oblast_prihlaseni").style.display = "block";
  document.getElementById("oblast_komunikace").style.display = "none";
  document.getElementById("zpravy").style.display = "none";
}

