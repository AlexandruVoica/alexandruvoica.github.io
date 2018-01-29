$('button').click(function (event) {
  event.preventDefault();
  $('.welcome').css('visibility', 'hidden');
});

// Global variables declaration
// By default, start with the color black
var selectedColor = '#000000';
// By default, start with a height and width of 0
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
  // Delete previous canvas in case function is called multiple times
  $('#pixel_canvas').children().remove();
  // Delete previous .cell_position element in case function is called multiple times
  $('.cell_position').remove();
  // Reset visual cues for active tool
  $('.tool_icon').removeClass('active');
  // Create canvas grid
  for(let row = 0; row < gridHeight; row ++) {
    $('#pixel_canvas').append('<tr data-position="' + row + '"></tr>');
  }
  for(let column = 0; column < gridWidth; column++) {
    $('#pixel_canvas > tr').append('<td data-position="' + column + '"></td>');
  }
  // After canvas is created export button becomes available
  $('#export_button').removeAttr('disabled');
  // After canvas is created, remove canvas space header
  $('#canvas_header').remove();
  // After canvas is created create .cell_position element
  $('#toolbox').children('h2').after('<p class="cell_position">0 x 0</p>')
  // Visual cues for paintbrush active
  $('.tool_icon[alt="Paint brush"]').toggleClass('active');
  // Initialize cursor when canvas was created
  $('.container').css('cursor', 'url(assets/icons/paintbrush.png) 0 32, auto');
};

// Code for coloring of the cells
// Disable default cursor dragging behaviour for canvas
$('table').on('dragstart', function(event) {
  event.preventDefault();
});

// Check if user is dragging mouse while clicked
var dragging = false;

// Event listener for clicking on a cell
$('table').on('mousedown', 'td', function(event) {
  // Mouse was clicked, make dragging possible
  dragging = true;
  useTool(event.target, selectedColor);
});

function useTool(cell, color) {
  let toolName = $('.active').attr('alt');
  switch (toolName) {
    case 'Paint brush': colorCell(cell, color); break;
    case 'Eraser tool': colorCell(cell, ''); break;
    case 'Fill tool': fillCells(cell);
  }
}

// Function for the coloring of a clicked cell
function colorCell (cell, color) {
  $(cell).css('background-color', color);
  $(cell).css('border', color);
};

// Function for filling a random area
function fillCells (cell) {
  let color = $(cell).css('background-color');
  let area = [];
  let temporaryArray = [];
  temporaryArray.push(cell);
  area = findArea(temporaryArray, [], color);

  function findArea (cellsArray, cellsCheckedArray, color) {
    if (cellsArray.length === 0)
      return cellsCheckedArray;
    else {
      let currentCell = cellsArray[0];
      cellsArray.shift();
      if (!(cellsCheckedArray.includes(currentCell))) {
        cellsCheckedArray.push(currentCell);
        let neighbourCellsArray = [];
        neighbourCellsArray = findNeighbours(currentCell).slice();
        neighbourCellsArray.forEach(function(neighbourCell) {
          if ($(neighbourCell).css('background-color') === color) {
            cellsArray.push(neighbourCell);
          }
        });
      }
      return findArea(cellsArray, cellsCheckedArray, color);
    };
  };

  function findNeighbours (cell) {
    let currentCellIndex = $(cell).attr('data-position');
    let neighbourCellsArray = [];
    // Up neighbour
    neighbourCellsArray[0] = $(cell).parent('tr').prev('tr').children('td').eq(currentCellIndex)[0];
    // Right neighbour
    neighbourCellsArray[1] = $(cell).next('td')[0];
    // Down neighbour
    neighbourCellsArray[2] = $(cell).parent('tr').next('tr').children('td').eq(currentCellIndex)[0];
    // Left neighbour
    neighbourCellsArray[3] = $(cell).prev('td')[0];
    return neighbourCellsArray;
  };

  area.forEach(function(cell) {
    colorCell(cell, selectedColor);
  });
};

// Event listener for releasing mouse
$('table').on('mouseup', 'td', function(event) {
  // Mouse is no longer clicked, dragging is disabled once again
  dragging = false;
});

// Event listener for when mouse enters a cell AND dragging is allowed
$('table').on('mouseenter', 'td', function(event) {
  let selectedCell = event.target;
  // If dragging is available then color cell
  if (dragging){
    useTool(event.target, selectedColor);
  }
  // Listen for updating current cell position
  let rowIndex = $(selectedCell).parent().attr('data-position');
  let columnIndex = $(selectedCell).attr('data-position');
  $('.cell_position').html(rowIndex + ' x ' + columnIndex);
});

// If cursor leaves table situation handling
$('table').on('mouseleave', function() {
  // If cursor leaves table, reset cell position
  $('.cell_position').html('0 x 0');
  // If cursor leaves table, dragging is disabled (solved bug)
  dragging = false;
});

// Event listener for switching to eraser tool
$('.tool_icon[alt="Eraser tool"]').on('click', function(event) {
  $('.tool_icon').removeClass('active');
  $(event.target).addClass('active');
  $('.container').css('cursor', 'url(assets/icons/eraser.png) 0 32, auto');
});

// Event listener for switching to paintbrush
$('.tool_icon[alt="Paint brush"]').on('click', function(event) {
  $('.tool_icon').removeClass('active');
  $(event.target).addClass('active');
  $('.container').css('cursor', 'url(assets/icons/paintbrush.png) 0 32, auto');
});

// Event listener for switching to fill tool
$('.tool_icon[alt="Fill tool"]').on('click', function(event) {
  $('.tool_icon').removeClass('active');
  $(event.target).addClass('active');
  $('.container').css('cursor', 'url(assets/icons/filltool.png) 0 32, auto');
});

// Export canvas by generating a string
$('#export_button').on('click', function(event) {
  event.preventDefault();
  $('#save_functionality').children('textarea').remove();
  $('#save_functionality').append('<textarea name="textarea" rows="10" cols="50" readonly="true"></textarea>');
  var exportString = gridWidth + '|' + gridHeight + '|';
  for (let rowIndex = 0; rowIndex < gridHeight; rowIndex ++) {
    let currentRow = $('#pixel_canvas').find('tr').eq(rowIndex);
    for (let columnIndex = 0; columnIndex < gridWidth; columnIndex ++) {
      let currentCell = '';
      let currentColor = '';
      currentCell = $(currentRow).find('td').eq(columnIndex);
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
    $('#save_functionality').append('<textarea name="textarea" rows="10" cols="50">Copy import string here and press the Import button again.</textarea>');
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
        if (currentColor !== 'rgba(0, 0, 0, 0)') {
          colorCell(currentCell, currentColor);
        }
        readIndex ++;
      }
    }
    isTextareaVisible = false;
  }
});

getTxt = function (){
  $.ajax({
    url:'text/html.txt',
    success: function (data){
      $('.show_code').html(data);
    }
  });
}

$('.buttoncode').click(getTxt);
