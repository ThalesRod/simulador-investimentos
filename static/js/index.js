$(function() {

    start();

    function start(){
        $("#tela_2").hide();
        generateContribuitionDates();
    }

    function mudarTela(){
        $("#tela_1").toggle("slow");
        $("#tela_2").toggle("slow");
    }

    function generateContribuitionDates() {
        for (let i = 1; i <= 60; i++) {
            const value = i;
            const text = Math.floor(i / 12) != 0
                            ? Math.floor(i / 12) + " anos e " + i % 12 + " meses"
                            : i % 12 + " meses";
            
            const optionElement = $("<option></option>");
            optionElement.val(value);
            optionElement.text(text);

            $("#tempo").append(optionElement);
        }
    }

    $("#entradaForm").on("submit",function() { 

        const nome = $("#nome").val();
        const mensalidade = $("#mensalidade").val();
        const tempoContribuicao = $("#tempo").val();
        const tempoContribuicaoFormatado = $(`#tempo option[value='${tempoContribuicao}']`).text();
        const taxaJuros = 0.517 / 100;

        // Checking the input
        if (nome === "" || nome === undefined){
            return 0;
        }
        if (parseFloat(mensalidade) <= 0 || isNaN(parseFloat(mensalidade))){
            return 0;
        }

        const expressao = `${mensalidade} * (((1 + ${taxaJuros})
        ^ ${tempoContribuicao} - 1) / ${taxaJuros})`;

        function formataSaida(dados){
            // Formatting for float with 2 decimals places and
            // formatting periods to commas
            let resultado = parseFloat(dados["result"]);
            resultado = resultado.toFixed(2);
            resultado = resultado.replace(".", ",");

            let mensalidadeFormatada = parseFloat(mensalidade);
            mensalidadeFormatada = mensalidadeFormatada.toFixed(2);
            mensalidadeFormatada = mensalidadeFormatada.replace(".", ",");

            // Formatting the query of the output
            const saida = `Olá ${nome}, juntando R$ ${mensalidadeFormatada} todo mês,
            você terá R$ ${resultado} em ${tempoContribuicaoFormatado}.`;
    
            $("#saida").text(saida);
            $("#mensalidade").val("");    
        }

        $.ajax({
            type: 'POST',
            url: 'http://api.mathjs.org/v4/',
            dataType: 'json',
            contentType: 'application/json',

            data: JSON.stringify( { "expr": expressao } ),

            success: formataSaida,

            error: function (resp) {
                $("#saida").text("Parece que algo deu errado! Por favor, simule novamente.");
            }
        });

        mudarTela();
                                              
    });

    $("#simularNovamente").on("click", mudarTela);

})