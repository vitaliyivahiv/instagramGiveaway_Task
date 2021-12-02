console.log('code runing...');
var fs = require('fs');
var dir = './words';
var getFiles = function () {
    //find out how many files are there in words folder 
    var fileCount = fs.readdirSync(dir).length;
    var arraysOfWords = [];
    for (var i = 0; i < fileCount; i++) {
        var fileWords = fs.readFileSync("words/out".concat(i, ".txt")).toString().split('\n');
        arraysOfWords.push(fileWords);
    }
    return arraysOfWords;
};
var deleteByIndex = function (list, wordsList) {
    list.reverse().forEach(function (index) {
        wordsList.splice(index, 1);
    });
    return wordsList;
};
var copyArray = function (original) {
    var copy = [];
    for (var i = 0; i < original.length; i++) {
        copy.push(original[i].slice());
    }
    return copy;
};
var findUniqueInArray = function (arrayInput) {
    var arrayCopy = copyArray(arrayInput);
    var uniqueWords = [];
    do {
        //get first word of arrayCopy
        var buff = [
            {
                word: arrayCopy[0],
                index: 0
            },
        ];
        //compare it to other words and get duplicates
        for (var i = 1; i < arrayCopy.length; i++) {
            if (arrayCopy[i] === buff[0].word) {
                buff.push({
                    word: arrayCopy[i],
                    index: i
                });
            }
        }
        //if buffer word is unique push it to array for unique words
        if (buff.length === 1) {
            uniqueWords.push(buff[0].word);
        }
        //remove duplicates from arrayCopy or at least first element of array
        arrayCopy = deleteByIndex(buff.map(function (item) { return item.index; }).sort(function (a, b) { return a - b; }), arrayCopy);
    } while (arrayCopy.length > 1 && arrayCopy.length !== 0);
    //add last word of the arrayCopy if it's unique
    if (arrayCopy.length === 1) {
        uniqueWords.push(arrayCopy[0]);
    }
    return uniqueWords;
};
var findDuplicatesAcross = function (wordArrays) {
    var wordArraysCopy = copyArray(wordArrays);
    var duplicates = [];
    for (var k = 0; k < wordArraysCopy.length - 1; k++) {
        var array1 = wordArraysCopy[k];
        for (var i = k + 1; i < wordArraysCopy.length; i++) {
            var array2 = wordArraysCopy[i];
            for (var arr1Index = 0; arr1Index < array1.length; arr1Index++) {
                for (var arr2Index = 0; arr2Index < array2.length; arr2Index++) {
                    if (array1[arr1Index] === array2[arr2Index] && duplicates.indexOf(array1[arr1Index]) === -1) {
                        duplicates.push(array1[arr1Index]);
                        array2.splice(arr2Index, 1);
                        break;
                    }
                }
            }
        }
    }
    return duplicates;
};
var uniqueValues = function () {
    var files = getFiles();
    //read all files and get unique words of each file
    var uniquePerFile = [];
    for (var i = 0; i < files.length; i++) {
        var fileWords = fs.readFileSync("words/out".concat(i, ".txt")).toString().split('\n');
        uniquePerFile.push(findUniqueInArray(fileWords));
    }
    //get duplicates acros arrays of unique words
    var duplicates = findDuplicatesAcross(uniquePerFile.slice());
    //remove duplicates from arrays with unique word
    var uniqueWordsArrays = [];
    for (var wordsArrayIndex = 0; wordsArrayIndex < uniquePerFile.length; wordsArrayIndex++) {
        var wordsArray = uniquePerFile[wordsArrayIndex];
        var duplicatesIdexes = [];
        for (var i = 0; i < duplicates.length; i++) {
            var duplicateIndex = wordsArray.indexOf(duplicates[i]);
            if (duplicateIndex !== -1 && duplicatesIdexes.indexOf(duplicateIndex) === -1) {
                duplicatesIdexes.push(duplicateIndex);
            }
        }
        if (duplicatesIdexes.length) {
            var wordsToPush = deleteByIndex(duplicatesIdexes.sort(function (a, b) { return a - b; }), wordsArray);
            uniqueWordsArrays.push(wordsToPush);
            duplicatesIdexes = [];
        }
    }
    var uniqueWords = uniqueWordsArrays.flat();
    console.log('unique words in all given files = ', uniqueWords.length, uniqueWords);
};
var getAllWordsWithoutDuplicates = function (arrayInput) {
    var uniqueWords = [];
    for (var i = 0; i < arrayInput.length; i++) {
        if (uniqueWords.indexOf(arrayInput[i]) !== 1) {
            uniqueWords.push(arrayInput[i]);
        }
    }
    return uniqueWords;
};
// const findInFile
var existInAllFiles = function () {
    //get files with words
    var files = getFiles();
    //get words without repeat
    var withoutDuplicates = [];
    for (var i = 0; i < files.length; i++) {
        withoutDuplicates.push(getAllWordsWithoutDuplicates(files[i]));
    }
    //get words that exist in all files
    var existsEverywhere = [];
    for (var i = 0; i < withoutDuplicates.length; i++) {
        var currentFile = withoutDuplicates[i];
        for (var j = 0; j < currentFile.length; j++) {
            var existsInFile = true;
            var wordToSearch = currentFile[j];
            for (var k = 0; k < withoutDuplicates.length; k++) {
                if (withoutDuplicates[k].indexOf(wordToSearch) === -1) {
                    existsInFile = false;
                    break;
                }
            }
            if (existsInFile && existsEverywhere.indexOf(wordToSearch)) {
                existsEverywhere.push(wordToSearch);
            }
        }
    }
    console.log("there are ".concat(existsEverywhere.length, " words that exist in all given files"));
};
var existInAtLeastTen = function () {
    //get files with words
    var files = getFiles();
    //get words without repeat
    var withoutDuplicates = [];
    for (var i = 0; i < files.length; i++) {
        withoutDuplicates.push(getAllWordsWithoutDuplicates(files[i]));
    }
    var existsIn10 = [];
    for (var i = 0; i < withoutDuplicates.length; i++) {
        var currentFile = withoutDuplicates[i];
        var counder = 10;
        for (var j = 0; j < currentFile.length; j++) {
            var existsInAtLeast10 = true;
            var wordToSearch = currentFile[j];
            for (var k = 0; k < withoutDuplicates.length; k++) {
                if (withoutDuplicates[k].indexOf(wordToSearch) === -1) {
                    counder--;
                }
                if (counder === 0) {
                    break;
                    existsInAtLeast10 = false;
                }
            }
            if (existsInAtLeast10 && existsIn10.indexOf(wordToSearch)) {
                existsIn10.push(wordToSearch);
            }
        }
    }
    console.log("there are ".concat(existsIn10.length, " words that exist in at least 10 of given files"));
};
uniqueValues();
existInAllFiles();
existInAtLeastTen();
