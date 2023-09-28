//Dynamic display for the title
function typeText(elementId, nestedElementId, text) {
    let index = 0;

    function type() {
        if (index < text.length) {
            document.getElementById(nestedElementId).textContent += text.charAt(index);
            index++;
            setTimeout(type, 100); // 100ms delay for each character
        }
    }

    type();
}

// Call functions on page load
window.onload = function() {
    // Determine which page you're on
    if (document.getElementById('dynamicTitle')) {
        typeText('dynamicTitle', 'nestedTitleSpan', 'Halo! Welcome to AI Hunter');
    } else if (document.getElementById('productTitle')) {
        typeText('productTitle', 'nestedProductTitleSpan', 'Discover Your AI Expert!');
    }
};

//
// //Progress loading:
// $(document).ready(function() {
//     $('form').on('submit', function(event) {
//         event.preventDefault(); // Prevent traditional form submission
//
//         // Clear previous results from the result card body
//         $('#resultCardBody .text-left').remove();
//
//         $("#loadingBar").show(); // Show the loading bar
//
//         // Using AJAX to post the form data
//         $.post('/PromptPage', $(this).serialize(), function(data) {
//             $("#loadingBar").hide(); // Hide the loading bar
//
//             // Add new results to the result card body only
//             data.results.forEach(function(result) {
//                 let htmlContent = '<div class="my-2 text-left">' + result.trim() + '</div>';
//                 $('#resultCardBody').append(htmlContent);
//             });
//         });
//     });
// });


//Loading bar and reorgnaize the result:
$(document).ready(function() {
    $('form').on('submit', function(event) {
        event.preventDefault(); // Prevent traditional form submission

        // Clear previous results and tables from the result card body
        $('#resultCardBody .text-left').remove();
        $('#resultCardBody table').remove();

        $("#loadingBar").show(); // Show the gif

        // Using AJAX to post the form data
        $.post('/PromptPage', $(this).serialize(), function(data) {
            $("#loadingBar").hide(); // Hide the gif

            if (data.type === 'tableWithExplanation') {
                // Parse and display as table
                let tableHtml = '<table class="table table-bordered">';

                data.table.forEach(function(row) {
                    if (!row.includes('---')) { // Exclude dashed rows
                        tableHtml += '<tr>';
                        row.split('|').forEach(cell => {
                            if (cell.trim() !== "") {
                                tableHtml += '<td>' + cell.trim() + '</td>';
                            }
                        });
                        tableHtml += '</tr>';
                    }
                });

                tableHtml += '</table>';
                $('#resultCardBody').append(tableHtml);

                // Append the explanations
                data.explanations.forEach(function(exp) {
                    let htmlContent = '<div class="my-2 text-left">' + exp.trim() + '</div>';
                    $('#resultCardBody').append(htmlContent);
                });
            } else {
                // Handle 'text' type
                data.results.forEach(function(result) {
                    let htmlContent = '<div class="my-2 text-left">' + result.trim() + '</div>';
                    $('#resultCardBody').append(htmlContent);
                });
            }
        });
    });
});
