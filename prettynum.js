/*
    @copyright Daily Raisin LLC 2013
    @role Format number strings to be more human readable

    Example:
    Format a number string of 1351228730175872514071381605242325140811 where the first five digits are highlighted and all digits are grouped in four digits, with a line break every four groups.

    Filter returns:
    <span class="highlighted">1351</span>‑<span class="highlighted">2</span>287‑3017‑5872‑<br>5140‑7138‑1605‑2423‑<br>2514‑0811‑
*/
'use strict';

angular.module('edge.app.filters').filter('prettynum', function () {
    return function(string, smallChunk, bigChunk, smallSeparator, bigSeparator, startOffset, endOffset) {
        var chars = string.split('');
        var chunks = [];

        var addRow = function(chunks, row, newRow) {
            if(newRow) {
                chunks.push(row); //add new row
            }
            else {
                chunks[chunks.length - 1] = row; //replace current row if already in chunks?
            }
        };

        var getChunks = function() {
            var newRow = false;

            //what row am I on?
            var row = _.last(chunks);

            //if this is the first row or we've exceeded the small chunks for this row, then new row
            if(_.isUndefined(row) || row.length >= bigChunk) {
                newRow = true;
                row = [];
            }

            //new small chunk
            if(chars.length > smallChunk) {
                row.push(_.first(chars, smallChunk));
                var leave = chars.length - smallChunk;
                chars = _.last(chars, leave);
                addRow(chunks, row, newRow);
                getChunks();
            }
            else if(chars.length > 0) { //if not enough chars for a small chunk, then tack on the remainder to the row
                row.push(chars);
                addRow(chunks, row, newRow);
                chars = [];
            }
        };

        getChunks();
        //console.log(chunks);

        var position = 0;
        var output = '';
        var spanOpen = false;
        var openBackUp = false;

        _.each(chunks, function(row) {
            _.each(row, function(chunk) {
                _.each(chunk, function(chr) {
                    if(startOffset === position || openBackUp) {
                        spanOpen = true;
                        openBackUp = false;
                        output += '<span class="highlighted">';
                    }
                    if(endOffset === position) {
                        spanOpen = false;
                        openBackUp = false;
                        output += '</span>';
                    }
                    output += chr;
                    position++;
                });

                if(chunk.length >= smallChunk) {
                    if(spanOpen) { //close before adding separator
                        output += '</span>';
                        openBackUp = true;
                    }
                    output += smallSeparator;
                }
            });
            if(spanOpen) { //close before adding separator
                output += '</span>';
                openBackUp = true;
            }
            output += bigSeparator;
        });

        //clean up output string
        if(output.slice(-1) === bigSeparator) {
            output = output.slice(0, -1);
        }
        if(output.slice(-1) === smallSeparator) {
            output = output.slice(0, -1);
        }

        return output;
    };
});
