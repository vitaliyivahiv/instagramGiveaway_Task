console.log('code runing...');
const fs = require('fs');
const dir = './words';

const getFiles = (): string[][] => {
    //find out how many files are there in words folder 
    const fileCount =  fs.readdirSync(dir).length;

    const arraysOfWords: string[][] = [];
    for (let i = 0; i < fileCount; i ++) {
        const fileWords = fs.readFileSync(`words/out${i}.txt`).toString().split('\n');
        arraysOfWords.push(fileWords);
    }
    return arraysOfWords;
}

const deleteByIndex = ( list:number[], wordsList: string[] ): string[] => {
    list.reverse().forEach(index => {
        wordsList.splice(index, 1);
    });

    return wordsList;
};

const copyArray = (original: string[] | string[][]) => {
    const copy = [];
    for (let i = 0; i < original.length; i++) {
        copy.push(original[i].slice());
    }
    return copy;
}

const findUniqueInArray = (arrayInput: string[]): string[] => {
    let arrayCopy: string[] = copyArray(arrayInput);

    const uniqueWords: string[] = [];
    do {
        //get first word of arrayCopy
        const buff: {
            word: string,
            index: number,
        }[] = [
            {
                word: arrayCopy[0],
                index: 0,
            },
        ];

        //compare it to other words and get duplicates
        for (let i = 1; i < arrayCopy.length; i ++ ) {
            if (arrayCopy[i] === buff[0].word) {
                buff.push({
                    word: arrayCopy[i],
                    index: i,
                });
            }
        }

        //if buffer word is unique push it to array for unique words
        if (buff.length === 1) {
            uniqueWords.push(buff[0].word);
        }
        
        //remove duplicates from arrayCopy or at least first element of array
        arrayCopy = deleteByIndex(buff.map((item) => item.index).sort((a, b) => a - b), arrayCopy);
    } while (arrayCopy.length > 1 && arrayCopy.length !== 0);
    
    //add last word of the arrayCopy if it's unique
    if (arrayCopy.length === 1) {
        uniqueWords.push(arrayCopy[0]);
    }

    return uniqueWords;
}

const findDuplicatesAcross = (wordArrays: string[][]): string[] => {
    const wordArraysCopy: string[][] = copyArray(wordArrays);

    const duplicates: string[] = [];
    for (let k = 0; k < wordArraysCopy.length - 1; k ++) {
        let array1 = wordArraysCopy[k];
        for (let i = k + 1; i < wordArraysCopy.length; i ++) {
            const array2 = wordArraysCopy[i];
            for(let arr1Index = 0; arr1Index < array1.length; arr1Index++) {
                for(let arr2Index = 0; arr2Index < array2.length; arr2Index++) {
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
}

const uniqueValues = () => {
    const files = getFiles();

    //read all files and get unique words of each file
    const uniquePerFile: string[][] = [];
    for (let i = 0; i < files.length; i ++) {
        const fileWords = fs.readFileSync(`words/out${i}.txt`).toString().split('\n');
        uniquePerFile.push(findUniqueInArray(fileWords));
    }

    //get duplicates acros arrays of unique words
    const duplicates = findDuplicatesAcross(uniquePerFile.slice());

    //remove duplicates from arrays with unique word
    const uniqueWordsArrays = [];
    for (let wordsArrayIndex = 0; wordsArrayIndex < uniquePerFile.length; wordsArrayIndex ++) {
        const wordsArray = uniquePerFile[wordsArrayIndex];
        let duplicatesIdexes: number[] = [];
        for (let i = 0; i < duplicates.length; i ++) {
            const duplicateIndex = wordsArray.indexOf(duplicates[i]);
            if (duplicateIndex !== -1 && duplicatesIdexes.indexOf(duplicateIndex) === -1) {
                duplicatesIdexes.push(duplicateIndex);
            }
        }
        if (duplicatesIdexes.length) {
            const wordsToPush = deleteByIndex(duplicatesIdexes.sort((a, b) =>  a - b), wordsArray);
            uniqueWordsArrays.push(wordsToPush);
            duplicatesIdexes = [];
        }
    }

    const uniqueWords = uniqueWordsArrays.flat();
    console.log('unique words in all given files = ', uniqueWords.length, uniqueWords);
}

const getAllWordsWithoutDuplicates = (arrayInput: string[]): string[] => {
    const uniqueWords: string[] = [];
    for (let i = 0; i < arrayInput.length; i++) {
        if (uniqueWords.indexOf(arrayInput[i]) !== 1) {
            uniqueWords.push(arrayInput[i])
        }
    }

    return uniqueWords;
}

// const findInFile

const existInAllFiles = () => {
    //get files with words
    const files = getFiles();

    //get words without repeat
    const withoutDuplicates = [];
    for (let i = 0; i < files.length; i ++) {
        withoutDuplicates.push(getAllWordsWithoutDuplicates(files[i]));
    }

    //get words that exist in all files
    const existsEverywhere = [];
    for (let i = 0; i < withoutDuplicates.length; i ++) {
        const currentFile = withoutDuplicates[i];
        for (let j = 0; j < currentFile.length; j++) {
            let existsInFile = true;
            const wordToSearch = currentFile[j];
            for (let k = 0; k < withoutDuplicates.length; k ++) {
                if (withoutDuplicates[k].indexOf(wordToSearch) === -1) {
                    existsInFile = false;
                    break;
                }
            }
            if (existsInFile && existsEverywhere.indexOf(wordToSearch) ) {
                existsEverywhere.push(wordToSearch);
            }
        }
    }

    console.log(`there are ${existsEverywhere.length} words that exist in all given files`)
}

const existInAtLeastTen = () => {
    //get files with words
    const files = getFiles();

    //get words without repeat
    const withoutDuplicates = [];
    for (let i = 0; i < files.length; i ++) {
        withoutDuplicates.push(getAllWordsWithoutDuplicates(files[i]));
    }

    const existsIn10 = [];
    for (let i = 0; i < withoutDuplicates.length; i ++) {
        const currentFile = withoutDuplicates[i];
        let counder = 10;
        for (let j = 0; j < currentFile.length; j++) {
            let existsInAtLeast10 = true;
            const wordToSearch = currentFile[j];
            for (let k = 0; k < withoutDuplicates.length; k ++) {
                if (withoutDuplicates[k].indexOf(wordToSearch) === -1) {
                    counder--;
                }
                if (counder === 0) {
                    break;
                    existsInAtLeast10 = false;
                }
            }
            if (existsInAtLeast10 && existsIn10.indexOf(wordToSearch) ) {
                existsIn10.push(wordToSearch);
            }
        }
    }

    console.log(`there are ${existsIn10.length} words that exist in at least 10 of given files`)
}

uniqueValues();
existInAllFiles();
existInAtLeastTen();
