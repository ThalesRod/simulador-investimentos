$(function() {

    start();

    function start(){
        $("#screen2").hide();
        generateContribuitionTimeOptions();
    }

    function changeScreen(){
        $("#screen1").toggle("slow");
        $("#screen2").toggle("slow");
    }

    function generateContribuitionTimeOptions() {
        for (let months = 1; months <= 60; months++) {
            const value = months;
            const text = Math.floor(months / 12) != 0
                            ? Math.floor(months / 12) + " anos e " + months % 12 + " meses"
                            : months % 12 + " meses";
            
            const optionElement = $("<option></option>");
            optionElement.val(value);
            optionElement.text(text);

            $("#contributionTime").append(optionElement);
        }
    }

    $("#inputForm").on("submit", function() { 

        const name = $("#name").val();
        const payment = $("#payment").val();
        const contributionTime = $("#contributionTime").val();
        const contributionTime_formatted = $(`#contributionTime option[value='${contributionTime}']`).text();
        const interestRate = 0.517 / 100;

        // Validating the input
        if (name === "" || name === undefined){
            return 0;
        }
        if (parseFloat(payment) <= 0 || isNaN(parseFloat(payment))){ // Checking if payment it's a number and if it's positive
            return 0;
        }

        const expression = `${payment} * (((1 + ${interestRate})
        ^ ${contributionTime} - 1) / ${interestRate})`;

        function formatOutput(data){
            // Formatting for float with 2 decimals places and
            // formatting periods to commas
            let result = parseFloat(data["result"]);
            result = result.toFixed(2);
            result = result.replace(".", ",");

            let payment_formatted = parseFloat(payment);
            payment_formatted = payment_formatted.toFixed(2);
            payment_formatted = payment_formatted.replace(".", ",");

            // Formatting the query of the output
            const output = `Olá ${name}, juntando R$ ${payment_formatted} todo mês,
            você terá R$ ${result} em ${contributionTime_formatted}.`;
    
            $("#outputText").text(output);
            $("#payment").val("");    
        }

        $.ajax({
            type: 'POST',
            url: 'http://api.mathjs.org/v4/',
            dataType: 'json',
            contentType: 'application/json',

            data: JSON.stringify( { "expr": expression } ),

            success: formatOutput,

            error: function (resp) {
                $("#outputText").text("Parece que algo deu errado! Por favor, simule novamente.");
            }
        });

        changeScreen();
                                              
    });

    $("#simulateAgain").on("click", changeScreen);

})