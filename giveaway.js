var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
console.log('code runing...');
var fs = require('fs');
var dir = './words';
var totalCodeStart = new Date().getTime();
console.log(' dir = ', dir);
var getFiles = function () {
    //find out how many files are there in words folder 
    var fileCount = fs.readdirSync(dir).length;
    var arraysOfWords = [];
    for (var i = 0; i < fileCount; i++) {
        var fileWords = fs.readFileSync("".concat(dir, "/out").concat(i, ".txt")).toString().split('\n');
        arraysOfWords.push(fileWords);
    }
    return arraysOfWords;
};
var deleteByIndexes = function (list, wordsList) {
    list.reverse().forEach(function (index) {
        wordsList.splice(index, 1);
    });
    return wordsList;
};
var binarySearch = function (word, arr) {
    var lowerBound = 0;
    var upperBound = arr.length - 1;
    var counter = 0;
    while (lowerBound <= upperBound) {
        counter++;
        var midpoint = Math.floor((lowerBound + upperBound) / 2);
        var guess = arr[midpoint];
        if (guess > word) {
            upperBound = midpoint - 1;
        }
        else if (guess < word) {
            lowerBound = midpoint + 1;
        }
        else {
            return midpoint;
        }
    }
    return -1;
};
var findUniqueInArray = function (array) {
    var uniqueWords = [];
    while (array.length) {
        var wordToSearch = array[0];
        var indexOfWord = void 0;
        var isUnique = true;
        indexOfWord = binarySearch(wordToSearch, array);
        //cound rest of word encounters in the first part of array
        if (array[indexOfWord - 1] === wordToSearch || array[indexOfWord + 1] === wordToSearch) {
            isUnique = false;
        }
        //find end of group of the same words
        for (var iUp = indexOfWord + 1; iUp < array.length; iUp++) {
            if (array[iUp] !== wordToSearch) {
                wordToSearch = array[iUp];
                array.splice(0, iUp);
                break;
            }
        }
        if (isUnique) {
            uniqueWords.push(wordToSearch);
        }
        if (wordToSearch === array[array.length - 1]) {
            break;
        }
    }
    return uniqueWords;
};
var uniqueValues = function () {
    var files = getFiles();
    //combine all files into one array
    var allWords = files.flat();
    //sort array
    allWords.sort();
    var uniquePerFile = [];
    files.forEach(function (file) {
        var uniqueWords = findUniqueInArray(__spreadArray([], file, true));
        uniquePerFile.push(__spreadArray([], uniqueWords, true));
    });
    var uniqueWords = findUniqueInArray(uniquePerFile.flat());
    console.log("there are ".concat(uniqueWords.length, " unique words in all given files"));
};
//One of this two removeDuplicates functions is wrong. Both seem to be correct but give different results  
var removeDuplicates = function (arr) {
    arr.forEach(function (word) {
        var indexOfWord = binarySearch(word, arr);
        var lowerBound = indexOfWord;
        var upperBound = indexOfWord;
        for (var i = indexOfWord - 1; i >= 0; i--) {
            if (arr[i] !== word) {
                lowerBound = i + 1;
                break;
            }
        }
        for (var i = indexOfWord + 1; i < arr.length; i++) {
            if (arr[i] !== word) {
                upperBound = i - 1;
                break;
            }
        }
        if (upperBound !== lowerBound) {
            arr.splice(lowerBound, upperBound - lowerBound);
        }
    });
};
// const removeDuplicates = (arr: string[]): void => {
//     arr.forEach(word => {
//         const indexOfWord = binarySearch(word, arr);
//         let duplicatesIndexes: number[] = [];
//         for (let i = indexOfWord - 1; i >=0; i--) {
//             if (arr[i] === word) {
//                 duplicatesIndexes.push(i);
//             } else break;
//         }
//         for (let i = indexOfWord + 1; i < arr.length; i++) {
//             if (arr[i] === word) {
//                 duplicatesIndexes.push(i);
//             } else break;
//         }
//         deleteByIndexes(duplicatesIndexes, arr);
//         duplicatesIndexes = [];        
//     });
// };
//get files with words
var files = getFiles();
//sort each file
files.forEach(function (file) { return file.sort(); });
//remove duplicates in files and shorten the lists
files.forEach(function (file) { return removeDuplicates(file); });
var existInAllFiles = function () {
    var existsEverywhere = [];
    //go through and search each word in each file (without duplicates now)
    files.forEach(function (file) {
        files[0].forEach(function (word) {
            var existsInEachFile = true;
            for (var i = 0; i < files.length; i++) {
                var indexOfWord = binarySearch(word, files[i]);
                if (indexOfWord === -1) {
                    existsInEachFile = false;
                    break;
                }
            }
            var isUnique = binarySearch(word, existsEverywhere) === -1;
            if (existsInEachFile && isUnique) {
                existsEverywhere.push(word);
            }
        });
    });
    console.log("there are ".concat(existsEverywhere.length, " words that exist in all given files"));
};
var existInAtLeastTen = function () {
    var existsInTen = [];
    //go through and search each word in each file (without duplicates now)
    files.forEach(function (file) {
        file.forEach(function (word) {
            var counter = 0;
            for (var i = 0; i < files.length; i++) {
                var indexOfWord = binarySearch(word, files[i]);
                if (indexOfWord !== -1) {
                    counter++;
                }
                else
                    break;
            }
            var isUnique = binarySearch(word, existsInTen) === -1;
            if (counter >= 10 && isUnique) {
                existsInTen.push(word);
            }
        });
    });
    console.log("there are ".concat(existsInTen.length, " words that exist in at least 10 of given files"));
};
var totalProgramStart = new Date().getTime();
var uniqueValuesStart = new Date().getTime();
uniqueValues();
var uniqueValuesEnd = new Date().getTime();
console.log("uniqueValues took ".concat((uniqueValuesEnd - uniqueValuesStart) / 1000, " seconds"));
console.log('__________________________________________________');
var existInAllFilesStart = new Date().getTime();
existInAllFiles();
var existInAllFilesEnd = new Date().getTime();
console.log("existInAllFiles took ".concat((existInAllFilesEnd - existInAllFilesStart) / 1000, " seconds"));
console.log('__________________________________________________');
var existInAtLeastTenStart = new Date().getTime();
existInAtLeastTen();
var existInAtLeastTenEnd = new Date().getTime();
console.log("existInAtLeastTen took ".concat((existInAtLeastTenEnd - existInAtLeastTenStart) / 1000, " seconds"));
console.log('__________________________________________________');
var totalProgramEnd = new Date().getTime();
console.log("Three functions took ".concat((totalProgramEnd - totalProgramStart) / 1000, " seconds in total"));
console.log("Program took ".concat((totalProgramEnd - totalCodeStart) / 1000, " seconds in total"));
