
$(document).ready(function(){

    const grid = new Grid(".grid")

    let flag = false;
    let moves = [];
    let totalGames = 0;
    let playerWins, aiWins, tie = 0;
    gameStart();

    //detect player click
    $(".grid div").on("click", function() {
        if ( !$(this).closest(".grid").hasClass("disabled") ) {
            if ( flag == false ) {
                playerSelect( $(this) )
            }
        }
    })

    $("button#new-game").on("click",clear);

    function gameStart() {
        //disable grid on page load
        $(".grid").off('click')

        //button interactions
        $("button").on("click",function() {
            totalGames++;
            $(this).addClass("active")
            $(this).siblings().attr("disabled","disabled")
            if ( $(this).attr("id") == "ai-first" ) {
                getAiMove(moves)
            }
            //enable clicking on grid
            $(".grid").removeClass("disabled")
        })
    }

    function playerSelect(elem) {
        flag = true;
        let col = $(elem).attr('data-col');
        let circles = $(".grid div[data-col="+col+"]").not(".red").not(".blue").toArray();
        circles[circles.length-1].classList.add("red")
        let row = circles[circles.length-1].getAttribute("data-row");
        moves.push(col)
        if ( grid.checkForWinner(row, col,"red") != true ) {
            getAiMove(moves)
        }
        else {
            endCondition("red wins")
        }
    }

    function getAiMove(arr) {
        $.ajax({
            url: "https://w0ayb2ph1k.execute-api.us-west-2.amazonaws.com/production?moves=[" + arr + "]",
            type: "GET",
            success: function(response) {
                //parse response to get last integer to indicate ai move
                let str = response.replace("[","").replace("]","")
                moves = str.split(",");
                let move = moves[moves.length-1];
                let circles = $(".grid div[data-col="+move+"]").not(".red").not(".blue").toArray();
                circles[circles.length-1].classList.add("blue")
                let row = circles[circles.length-1].getAttribute("data-row")
                $("#moves").attr("value",moves)
                if ( grid.checkForWinner(row, move,"blue") == true ) {
                    endCondition("blue wins")
                }
                if ( $(".grid div").not(".red, .blue").length == 0 ) {
                    endCondition("tie");
                    tie++;
                }
                flag = false;
            },
            error: function(err) {
                //test if there is a tie
                if ( err.status = 400 && $(".grid div").not(".red, .blue").length == 0 ) {
                    endCondition("tie");
                    tie++;
                }
                //otherwise, move isn't acceptable so recurse method
                else {
                    console.log("invalid placement");
                    getAiMove(moves)
                }
            }
        });
    }

    //end game condition
    function endCondition(result) {
        moves = [];
        $("#moves").attr("value","")
        $("div.hidden").removeClass("hidden");
        if ( result == "tie" ) {
            $("#results span").html("TIE...")
        }
        else if ( result == "red wins" ) {
            $("#results span").addClass("red-text").html("Red wins!")
        }
        else if ( result == "blue wins" ) {
            $("#results span").addClass("blue-text").html("Blue wins!")
        }
        $(".grid").addClass("disabled")
        $(".grid").off("click")
        winCheck = false;
        flag = false;
        $("html, body").animate({ scrollTop: 0 }, "slow");
    }

    //clear state of board
    function clear() {
        $("button").removeAttr("disabled").removeClass("active");
        $(".grid").addClass("disabled")
        $(".grid div").removeClass("red blue")
        $(".end-game").addClass("hidden")
        $("#results span").removeClass("blue-text red-text")
    }
})