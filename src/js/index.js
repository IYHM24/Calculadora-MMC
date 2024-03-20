document.addEventListener("DOMContentLoaded", function() {
    //ocultar boton de arriba
    $("#top-button").hide();
    //Ocultar contenedor de resultados
    ocultarResultados();
    //listeners
    configurarListeners();
});

window.addEventListener('scroll', function() {
    let botonRegresarArriba = document.getElementById('top-button');

    // Mostrar el botón cuando el usuario hace scroll hacia abajo
    if (window.scrollY > 100) { // Puedes ajustar el valor según sea necesario
        botonRegresarArriba.style.display = 'block';
    } else {
        botonRegresarArriba.style.display = 'none';
    }
});

const configurarListeners = () => {

    //Vaciar inputs
    for (const input in calculoObject) {
        $("#"+input).val("");
    }   

    //inputs
    for (const input in calculoObject) {
       $("#"+input).keyup(function (e) { 
            handleValue(e);
       });
    }   
    //Botones
    $("#calcular").click(function (e) { 

        if(calculoObject.lambda == 0 || isNaN(calculoObject.lambda))
        {
            simpleAlert("corriga el campo de lambda debe ser numerico y no estar vacio",true);
            return;
        }

        if(calculoObject.mu == 0 || isNaN(calculoObject.mu))
        {
            simpleAlert("corriga el campo de mu debe ser numerico y no estar vacio",true);
            return;
        }

        if(calculoObject.numero_clientes == 0 || isNaN(calculoObject.numero_clientes))
        {
            simpleAlert("corriga el campo de numero de clientes debe ser numerico y no estar vacio",true);
            return;
        }

        if(calculoObject.numero_servidores == 0 || isNaN(calculoObject.numero_servidores))
        {
            simpleAlert("corriga el campo de numero servidores debe ser numerico y no estar vacio",true);
            return;
        }


        calcularMMC();
    });

    $("#top-button").click(function (e) { 
        e.preventDefault();
        var scrollStep = -window.scrollY / (10 / 15); // Controla la velocidad del scroll
        var scrollInterval = setInterval(function(){
            if (window.scrollY != 0) {
                window.scrollBy(0, scrollStep);
            } else {
                clearInterval(scrollInterval);
            }
        }, 15);
    });

    $("#license-button").click(function (e) { 
        $("#modal-license").modal("show");
    });

    $("#close-modal").click(function (e) { 
        $("#modal-license").modal("hide");
    });
}

const calcularMMC = (second) => {

    calculoObject.lambda = parseInt(calculoObject.lambda)
    calculoObject.mu = parseInt(calculoObject.mu)
    calculoObject.numero_clientes = parseInt(calculoObject.numero_clientes)
    calculoObject.numero_servidores = parseInt(calculoObject.numero_servidores)

    //1 paso

    //obtener rho
    const rho = (calculoObject.lambda)/(calculoObject.numero_servidores*calculoObject.mu)

    //calcular r
    const r = calculoObject.lambda/calculoObject.mu
    //calcular Po
    let sumador = 0;

    if(calculoObject.numero_servidores -1 == 0)
    {
        sumador = 2
    }
    else
    {
        for (let n = 0; n < calculoObject.numero_servidores -1; n++) {
            sumador = sumador + ((r**n)/factorial(n) + ((r**calculoObject.numero_servidores)/(factorial(calculoObject.numero_servidores)*(1-rho)))) 
        }
    }

    const Po = 1/sumador;

   //3 paso

   debugger
    //calcular Lq
    const Lq = ((r**calculoObject.numero_servidores)*rho)/(factorial(parseInt(calculoObject.numero_servidores))*(1-rho)**2)
    //calcular Wq
    const Wq = Lq/calculoObject.lambda;

   //4 paso
    
   //calcular W
   W = Wq + 1/calculoObject.mu;

    //setear spans
    $("#resultado1r").html(formatoNotacionCientifica(r));
    $("#resultado1Po").html(formatoNotacionCientifica(Po));
    $("#resultado2").html(formatoNotacionCientifica(rho));
    $("#resultado3").html(formatoNotacionCientifica(Wq));
    $("#resultado4").html(formatoNotacionCientifica(W));

   //mostrar resultados
   $("#results").removeClass("display-none");
}

function formatoNotacionCientifica(numero) {
    // Verificar si el número es suficientemente pequeño para convertirse en notación científica
    if (Math.abs(numero) < 0.001) {
        // Convertir el número a notación científica
        return numero.toExponential(3);
    } else {
        // Tomar los últimos tres decimales del número
        const tresDecimales = numero.toFixed(3);
        return tresDecimales;
    }
}

function factorial(n) {
    let resultado = 1;
    for (let i = 2; i <= n; i++) {
        resultado *= i;
    }
    return resultado;
}

const handleValue = (e) => { 
    const {id, value} = e.target; 
    calculoObject = {...calculoObject, [id]: value}; 
}

const ocultarResultados = () => {
    $("#results").addClass("display-none");
    $("#resultado2").append("0");
}