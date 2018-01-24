// Global variables declaration

// By default, start with the color black
var selectedColor = '#000000';
var gridHeight = 0;
var gridWidth = 0;

// Select color event listener

$('#colorPicker').change(function(event) {
  selectedColor = event.target.value;
  $('#colorString').text(selectedColor.toUpperCase());
  $('#colorString').css('background', selectedColor);
});

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
  for(let row = 0; row < gridHeight; row ++) {
    $('#pixel_canvas').append('<tr></tr>');
  }
  for(let column = 0; column < gridWidth; column++) {
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
  $('#save_functionality').append('<textarea name="textarea" rows="10" cols="50" readonly="true"></textarea>');
  var exportString = gridWidth + '|' + gridHeight + '|';
  for (let i = 0; i < gridHeight; i ++) {
    let currentRow = $('#pixel_canvas').find('tr').eq(i);
    for (let j = 0; j < gridWidth; j ++) {
      let currentCell = '';
      let currentColor = '';
      currentCell = $(currentRow).find('td').eq(j);
      currentColor = $(currentCell).css('background-color');
      exportString += currentColor + '|';
    }
  }
  $('#save_functionality').children('textarea').html(exportString);
});

// Import canvas by parsing a string
var isTextareaVisible = false;
$('#import_button').on('click', function(event) {
  event.preventDefault();
  if (isTextareaVisible === false) {
    $('#save_functionality').children('textarea').remove();
    $('#save_functionality').append('<textarea name="textarea" rows="10" cols="50">Copy import string here...</textarea>');
    isTextareaVisible = true;
  } else {
    let importString = $('#save_functionality').children('textarea').val();
    let parseString = importString.split('|');
    gridWidth = parseString[0];
    gridHeight = parseString[1];
    let numberOfCells = parseString.length - 3;
    if (numberOfCells != (gridWidth * gridHeight)) {
      alert('Import string is not correct.');
      return true;
    }
    makeGrid();
    let readIndex = 2;
    for (let i = 0; i < gridHeight; i ++) {
      let currentRow = $('#pixel_canvas').find('tr').eq(i);
      for (let j = 0; j < gridWidth; j ++) {
        let currentCell = $(currentRow).find('td').eq(j);
        let currentColor = parseString[readIndex];
        $(currentCell).css('background-color', currentColor);
        $(currentCell).css('border', currentColor);
        $(currentCell).parent().css('border', currentColor);
        readIndex ++;
      }
    }
    isTextareaVisible = false;
  }
});
