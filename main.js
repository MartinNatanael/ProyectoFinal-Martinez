// ------------------------------------variables-globales----------------------------------------

const consultas = [];
let resultadoInicial ='';
let resultadoFinal ='';
let resultadoFinalDecimal =''; 
let formulario = document.getElementById("formulario");
let consultar = document.getElementById('consultar');
let consultaNueva =document.getElementById('consultarNueva');
let borrar = document.getElementById('borrar');
let contenedor = document.getElementById('contenedor');
let conversion1 = document.getElementById('conversion-data-1');
let conversion2 = document.getElementById('conversion-data-2');


/* ------------------------------------Evento----------------------------------------*/

formulario.addEventListener("submit", (e) => {
  e.preventDefault();
// Calculos sobre los valores ingresados por el usuario
  let valor = document.getElementById("monto").value;
  let plan = Number(document.querySelector('input[name="plan"]:checked').value);
  function interestsCalculator(valor, plan) {
    switch (plan) {
      case 12:
        return valor * 2.25;
        break;
      case 24:
        return valor * 2.5;
        break;
      case 36:
        return valor * 2.75;
        break;
    }
  }
resultadoInicial = interestsCalculator(valor, plan);
function amountCalculator(plan, resultadoInicial) {
       return resultadoInicial/plan
  }
resultadoFinal = amountCalculator(plan, resultadoInicial);
resultadoFinalDecimal = parseInt(resultadoFinal.toFixed(2)); //reducir a numero con 2 decimales
//   console.log(finalResultDecimal);

//mostrar la consulta relizada


Swal.fire(`<p class="h5 mt-3">Resultado de su consulta:</p>
<ul class="list-group list-group-flush list-inline-item" style="width:100%;">
<li class="list-group-item list-inline-item">EL monto total es a pagar es $${resultadoInicial}</li>
<li class="list-group-item list-inline-item">En un plan de ${plan} cuotas</li>
<li class="list-group-item list-inline-item">Pagara $${resultadoFinalDecimal} por mes</li>
</ul>`)
formulario.reset();
//almacenar consultas realizadas en el localStorage
consultas.push({ resultadoInicial, plan, resultadoFinalDecimal});
consultas.forEach(() => {
    localStorage.setItem('datos', JSON.stringify(consultas));
  });
  formulario.reset(); 
});

console.log(consultas);



/* ------------------------------------Evento----------------------------------------*/

consultar.addEventListener('click',(e)=>{
    e.preventDefault();

let datosObtenidos =JSON.parse(localStorage.getItem('datos'));
contenedor.innerHTML="";
datosObtenidos.forEach((item)=>{
    let div = document.createElement('div');
    div.innerHTML=`
    <p class="h5 mt-3">Resultado de su consulta:</p>
    <ul class="list-group list-group-flush" style="width:100%;">
  <li class="list-group-item list-inline-item">EL monto total es $${item.resultadoInicial}.</li>
  <li class="list-group-item list-inline-item">En un plan de ${item.plan} cuotas.</li>
  <li class="list-group-item list-inline-item">Pagara $${item.resultadoFinalDecimal} por mes.</li>
</ul>
    `;
    contenedor.append(div);
    consultaNueva.classList.remove('button-display')  
});


});
/* ------------------------------------Evento----------------------------------------*/
consultaNueva.addEventListener('click',(e)=>{
  e.preventDefault();
  contenedor.innerHTML="";
  formulario.reset();
  consultaNueva.classList.add('button-display') 
})


/* ------------------------------------Evento----------------------------------------*/
borrar.addEventListener('click',()=>{
localStorage.clear();
formulario.reset();
contenedor.innerHTML='';
Swal.fire({
  icon: 'success',
  title: 'Su Historial Fue Borrado',
  showConfirmButton: false,
  timer: 2500,
  position: 'top'
})
})

/* ------------------------------------API----------------------------------------*/

//detectamos de que zona es el usuario

fetch(
  "https://ipgeolocation.abstractapi.com/v1/?api_key=6bc8f1e29a764e45830e158c743a3dd5")
  .then((response) => response.json())
  .then(data=> {
    localStorage.setItem("bandera",JSON.stringify(data.flag))
    localStorage.setItem("ciudad",JSON.stringify(data.city))
    localStorage.setItem('moneda',JSON.stringify(data.currency.currency_code))
    localStorage.setItem('bandera',JSON.stringify(data.flag.png))
    console.log(data);
    console.log();
})
.catch((err) => console.log(err));

//Devolvemos mostramos valor de moneda locar comparadas con EURO y DOLAR
fetch(`https://api.exchangerate.host/convert?from=EUR&to=${JSON.parse(localStorage.getItem('moneda'))}&places=2`)
  .then((response) => response.json())
  .then(data=>{
    console.log(data);
    conversion1.innerHTML=`  
  <ul class="conversion">
  <li class="from"><img class="bandera" src="${JSON.parse(localStorage.getItem('bandera'))}" alt="">${JSON.parse(localStorage.getItem('moneda'))} </li>
  <li class="to"><img class="bandera" src="./assets/union-europea.png" alt="">EUR</li>
  <li class="value">${data.result}</li>
</ul>`})
.catch((err) => {
  conversion1.innerHTML=`<p>Las conversiones no estan disponibles</p>
  `})

fetch(`https://api.exchangerate.host/convert?from=USD&to=${JSON.parse(localStorage.getItem('moneda'))}&places=2`)
  .then((response) => response.json())
  .then(data=>{
    console.log(data);
    conversion2.innerHTML=`  
  <ul class="conversion">
  <li class="from"><img class="bandera" src="${JSON.parse(localStorage.getItem('bandera'))}" alt="">${JSON.parse(localStorage.getItem('moneda'))} </li>
  <li class="to"><img class="bandera" src="./assets/estados-unidos.png" alt="">USD</li>
  <li class="value">${data.result}</li>
</ul>`})
.catch((err) => {
  conversion2.innerHTML=`<p>Las conversiones no estan disponibles</p>
  `
})


