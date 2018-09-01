$(document).ready(function() {
  var win = [
    0b111000000, // 448
    0b000111000, // 56
    0b000000111, // 7
    0b100100100, // 292
    0b010010010, // 146
    0b001001001, // 73
    0b100010001, // 273
    0b001010100 // 84
  ];

  var moves = [
    0b100000000, // 256
    0b010000000, // 128
    0b001000000, // 64
    0b000100000, // 32
    0b000010000, // 16
    0b000001000, // 8
    0b000000100, // 4
    0b000000010, // 2
    0b000000001 // 1
  ];

  var yourMoves = 0b000000000; // 0
  var oppsMoves = 0b000000000; // 0

  var com = 1;
  var turn = 0;

  var points = [0,0];
  var markers = ["X", "O"];
  var you = "";
  var opp = "";

  // Choose Type of player
   $(".choice0").click(function() {
    $(".choice0").removeClass("is-dark").addClass("is-dark");
    $(this).toggleClass("is-dark");
    com = parseInt(this.id[1]);
  });

  // Choose your marker and start game
  $(".choice2").click(function() {
    you = markers[parseInt(this.id[1])];
    $(".choice2").removeClass("is-dark").addClass("is-dark");
    $(this).toggleClass("is-dark");

    if (parseInt(this.id[1])) opp = markers[0];
    else opp = markers[1];

    setTimeout(function() {
      $("#game").css("display", "block");
      $("#settings").css("display", "none");
      $("#text").html("Let the games begin!" + "<br>score: " + points[0] + " vs " + points[1]);
    }, 500);
  });

  // Resets game
  function reset() {
    yourMoves = 0b000000000;
    oppsMoves = 0b000000000;

    $(".choice0").removeClass("is-dark").addClass("is-dark");
    $("#p1").toggleClass("is-dark");
    $(".square").html("<p style='visibility:hidden;'>e</p>");
  }
  reset();

  // Restarts game
  $("#restart").click(function() {
    com = 1;
    turn = 0;
    game = 0;
    points = [0,0];
    markers = ["X", "O"];
    $("#game").css("display", "none");
    $("#settings").css("display", "block");
    reset()
  });


  // Checks if someone won
  function check() {
    if ((yourMoves | oppsMoves) == 0b111111111) {
      // 511
      $("#text").html("It's a tie!<br>score: " + points[0] + " vs " + points[1]);
      return reset();
    }
    for (var i in win) {
      if ((win[i] & yourMoves) == win[i]) {
        points[0]++
        if (com) $("#text").html("You Win!<br>score: " + points[0] + " vs " + points[1]);
        else $("#text").html("Player #1 Wins!<br>score: " + points[0] + " vs " + points[1]);
        return reset();
      }
      if ((win[i] & oppsMoves) == win[i]) {
        points[1]++
        if (com) $("#text").html("You Lose!<br>score: " + points[0] + " vs " + points[1]);
        else $("#text").html("Player #2 Wins!<br>score: " + points[0] + " vs " + points[1]);
        return reset();
      }
    }
  }

  function computer() {
      var oppsArr = moves.filter(function(item) {
        return ((yourMoves & item) | (oppsMoves & item)) === 0b000000000;
      });
      index = Math.floor(Math.random() * oppsArr.length);
      oppsMoves += oppsArr[index];
      $("#" + moves.indexOf(oppsArr[index])).text(opp);
  }

  // Places a marker where you want it
  $(".square").click(function() {
    var index = $(this).attr("id");
    // Only execute everything if that square is empty.
    if (
      ((yourMoves & moves[index]) | (oppsMoves & moves[index])) ===
      0b000000000
    ) {
      if (turn) {   
        oppsMoves += moves[index];
        $(this).text(opp);
        turn = 0;
      } else {
        yourMoves += moves[index];
        $(this).text(you);
        if (!com) turn = 1;
      }
      if (!com) {
        $("#tictactoe").toggleClass("is-warning");
        $(".square").toggleClass("is-dark");
      }

      setTimeout(function() {
        check();
        if (com) computer();
      }, 500);

      setTimeout(function() {
        check();
      }, 1000);

    }
  });
});