$("h1").css("color", "red")

$("h1").addClass("big-title")

$(document).keypress(function(event) {
  $("h1").text(event.key);
});
