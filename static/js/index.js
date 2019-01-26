$(function() {

    $("#tela_1").show();

    function mudarTela(){
        $("#tela_1").toggle("slow");
        $("#tela_2").toggle("slow");
    }

    $("#simular").on("click",function() { 

        const nome = $("#nome").val();
        // Using replace() method to convert commas to dots
        const mensalidade = $("#mensalidade").val().replace(",", ".");
        const tempoContribuicao = $("#tempo").val();
        const tempoContribuicaoFormatado = $("#tempo option[value='24']").text();
        const taxaJuros = 0.517 / 100;

        if (nome === "" || nome === undefined){
            return 0;
        }
        if (parseFloat(mensalidade) <= 0 || isNaN(parseFloat(mensalidade))){
            return 0;
        }

        const expressao = `${mensalidade} * (((1 + ${taxaJuros})
        ^ ${tempoContribuicao} - 1) / ${taxaJuros})`;

        function formataSaida(dados){
            // TRATAR A STRING DO RESULTADO COM , . E TAMANHO E ARREDONDAR
            resultado = dados["result"];
            resultado = resultado.substring(6,0);
            resultado = resultado.replace(".", ",");

            const saida = `Olá ${nome}, juntando R$ ${mensalidade} todo mês,
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