// Select color input
var selectedColor = '#000000';
$('#colorPicker').change(function(event) {
  selectedColor = event.target.value;
  $('#colorString').text(selectedColor.toUpperCase());
  $('#colorString').css('background', selectedColor);
});

var gridHeight = 0;
var gridWidth = 0;

// When size is submitted by the user, call makeGrid()
$('#submit_button').click(function(event) {
  event.preventDefault();
  gridHeight = $('#input_height').val();
  $('#get_height').text(gridHeight);
  gridWidth = $('#input_width').val();
  $('#get_width').text(gridWidth);
  // Check if dimensions are not too big
  if (gridHeight > 45 || gridHeight > 45)  {
    // Delete previous canvas
    $('#canvas_header').children().remove();
    $('#canvas_header').append('<p>Requested canvas is too big. Please choose a dimension less than 45.</p>');
    // Stop function from executing the makeGrid call
    return true;
  }
  makeGrid();
});

function makeGrid() {
  // Delete previous canvas
  $('#pixel_canvas').children().remove();
  // Create canvas grid
  for(var row = 0; row < gridHeight; row ++) {
    $('#pixel_canvas').append('<tr></tr>');
  }
  for(var column = 0; column < gridWidth; column++) {
    $('#pixel_canvas > tr').append('<td></td>');
  }
  $('#export_button').removeAttr('disabled');
  $('#canvas_header').remove();
}

$('table').on('dragstart', function(event) {
  event.preventDefault();
});

var dragging = false;
$('table').on('mousedown', 'td', function(event) {
  dragging = true;
  var selectedCell = event.target;
  $(selectedCell).css('background-color', selectedColor);
  $(selectedCell).css('border', selectedColor);
  $(selectedCell).parent().css('border', selectedColor);
});

$('table').on('mouseup', 'td', function(event) {
  dragging = false;
});

$('table').on('mouseenter', 'td', function(event) {
  if (dragging){
    var selectedCell = event.target;
    $(selectedCell).css('background-color', selectedColor);
    $(selectedCell).css('border', selectedColor);
    $(selectedCell).parent().css('border', selectedColor);
  }
});

// Export canvas by generating a string
$('#export_button').on('click', function(event) {
  event.preventDefault();
  $('#save_functionality').children('textarea').remove();
  $('#save_functionality').append('<textarea name="textarea" rows="10" cols="50"></textarea>');
  var exportString = gridWidth + ' ' + gridHeight + ' ';
  for (var i = 0; i < gridHeight; i ++) {
    var row = $('#pixel_canvas').find('tr').eq(i);
    for (var j = 0; j < gridWidth; j ++) {
      var currentCell = '';
      var currentColor = '';
      currentCell = $(row).find('td').eq(j);
      currentColor = $(currentCell).css('background-color');
      exportString += currentColor + ' ';
    }
  }
  $('#save_functionality').children('textarea').html(exportString);
});
