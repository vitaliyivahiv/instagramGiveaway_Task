console.log('code runing...');
const fs = require('fs');
const dir = './words';

const totalCodeStart = new Date().getTime();
console.log(' dir = ', dir)

const getFiles = (): string[][] => {
    //find out how many files are there in words folder 
    const fileCount =  fs.readdirSync(dir).length;

    const arraysOfWords: string[][] = [];
    for (let i = 0; i < fileCount; i ++) {
        const fileWords = fs.readFileSync(`${dir}/out${i}.txt`).toString().split('\n');
        arraysOfWords.push(fileWords);
    }
    return arraysOfWords;
};

const deleteByIndexes = ( list:number[], wordsList: string[] ): string[] => {
    list.reverse().forEach(index => {
        wordsList.splice(index, 1);
    });

    return wordsList;
};

const binarySearch = (word: string, arr: string[]): number => {
    let lowerBound = 0;
    let upperBound = arr.length - 1;
    let counter = 0;
    while (lowerBound <= upperBound) {
        counter++;
        const midpoint = Math.floor((lowerBound + upperBound)/2);
        const guess = arr[midpoint];
        if (guess > word) {
            upperBound = midpoint - 1;
        } else if (guess < word) {
            lowerBound = midpoint + 1;
        } else {
            return midpoint;
        }
    }

    return -1;
};

const findUniqueInArray = (array: string[]) => {
    const uniqueWords: string [] = [];

    while (array.length) {
        let wordToSearch = array[0];
        let indexOfWord: number;
        let isUnique:boolean = true;
        indexOfWord = binarySearch(wordToSearch, array);
        //cound rest of word encounters in the first part of array
        if (array[indexOfWord-1] === wordToSearch || array[indexOfWord+1] === wordToSearch) {
            isUnique = false;
        }
        //find end of group of the same words
        for (let iUp = indexOfWord + 1; iUp < array.length; iUp++) {
            if (array[iUp] !== wordToSearch) {
                wordToSearch = array[iUp];
                array.splice(0, iUp);
                break;
            }
        }
        if (isUnique) {
            uniqueWords.push(wordToSearch);
        }
        if (wordToSearch === array[array.length-1]) {
            break;
        }
    }

    return uniqueWords;
};

const uniqueValues = () => {
    const files = getFiles();

    //combine all files into one array
    const allWords = files.flat();

    //sort array
    allWords.sort();
    const uniquePerFile: string[][] = [];
    files.forEach(file => {
        const uniqueWords: string [] = findUniqueInArray([...file]);
        uniquePerFile.push([...uniqueWords]);
    });
    const uniqueWords = findUniqueInArray(uniquePerFile.flat());
    console.log(`there are ${uniqueWords.length} unique words in all given files`);
};

//One of this two removeDuplicates functions is wrong. Both seem to be correct but give different results  
const removeDuplicates = (arr: string[]): void => {
    arr.forEach(word => {
        const indexOfWord = binarySearch(word, arr);

        let lowerBound: number = indexOfWord;
        let upperBound: number = indexOfWord;
        for (let i = indexOfWord - 1; i >= 0; i--) {
            if (arr[i] !== word) {
                lowerBound = i+1;
                break;
            }
        }
        for (let i = indexOfWord + 1; i < arr.length; i++) {
            if (arr[i] !== word) {
                upperBound = i-1;
                break;
            }
        }

        if (upperBound !== lowerBound) {
            arr.splice(lowerBound, upperBound-lowerBound);
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
const files = getFiles();

//sort each file
files.forEach(file => file.sort());

//remove duplicates in files and shorten the lists
files.forEach(file => removeDuplicates(file));

const existInAllFiles = () => {
    const existsEverywhere = [];

    //go through and search each word in each file (without duplicates now)
    files.forEach(file => {
        files[0].forEach(word => {
            let existsInEachFile: boolean = true;
            for (let i = 0; i < files.length; i++) {
                const indexOfWord = binarySearch(word, files[i]);
                if(indexOfWord === -1) {
                    existsInEachFile = false;
                    break;
                }
            }
            const isUnique:boolean = binarySearch(word, existsEverywhere) === -1;
            if (existsInEachFile && isUnique) {
                existsEverywhere.push(word);
            }
        });
    });

    console.log(`there are ${existsEverywhere.length} words that exist in all given files`);
};

const existInAtLeastTen = () => {
    const existsInTen = [];

    //go through and search each word in each file (without duplicates now)
    files.forEach(file => {
        file.forEach(word => {
            let counter: number = 0;
            for (let i = 0; i < files.length; i++) {
                const indexOfWord = binarySearch(word, files[i]);
                if(indexOfWord !== -1) {
                    counter++;
                } else break;
            }
            const isUnique:boolean = binarySearch(word, existsInTen) === -1;
            if (counter >=10 && isUnique) {
                existsInTen.push(word);
            }
        });
    });

    console.log(`there are ${existsInTen.length} words that exist in at least 10 of given files`);
}

const totalProgramStart = new Date().getTime();

const uniqueValuesStart = new Date().getTime();
uniqueValues();
const uniqueValuesEnd = new Date().getTime();
console.log(`uniqueValues took ${(uniqueValuesEnd - uniqueValuesStart)/1000} seconds`);
console.log('__________________________________________________');

const existInAllFilesStart = new Date().getTime();
existInAllFiles();
const existInAllFilesEnd = new Date().getTime();
console.log(`existInAllFiles took ${(existInAllFilesEnd - existInAllFilesStart)/1000} seconds`);
console.log('__________________________________________________');

const existInAtLeastTenStart = new Date().getTime();
existInAtLeastTen();
const existInAtLeastTenEnd = new Date().getTime();
console.log(`existInAtLeastTen took ${(existInAtLeastTenEnd - existInAtLeastTenStart)/1000} seconds`);
console.log('__________________________________________________');

const totalProgramEnd = new Date().getTime();

console.log(`Three functions took ${(totalProgramEnd - totalProgramStart)/1000} seconds in total`);

console.log(`Program took ${(totalProgramEnd - totalCodeStart)/1000} seconds in total`);
