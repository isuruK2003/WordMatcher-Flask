const wordsApi = "/words";
let words = [];

async function loadData() {
    try {
        const response = await fetch(wordsApi, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ /* Any necessary data to be sent with POST */ })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        words = await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
}

function sortObjectArray(arrayOfObjects, key) {
    return arrayOfObjects.sort((a, b) => {
        const item1 = a[key];
        const item2 = b[key];

        if (item1 > item2) {
            return 1;
        } else if (item1 < item2) {
            return -1;
        } else {
            return 0;
        }
    });
}

// function myDis(str1, str2, charNum) {
//     let str1Len = str1.length;
//     let str2Len = str2.length;
    
//     // Base Case
//     if (charNum > str1Len - 1 || charNum > str2Len - 1) {
//         return Math.abs(str1Len - str2Len);
//     }
    
//     let str1Char = str1[charNum];
//     let str2Char = str2[charNum];
    
//     let val = 0;
//     if (str1Char != str2Char) {
//         val = 1;
//     }

//     return val + myDis(str1, str2, charNum + 1);
// }

function levDis(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;
    const dp = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(null));

    for (let i = 0; i <= len1; i++) {
        dp[i][0] = i;
    }
    for (let j = 0; j <= len2; j++) {
        dp[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,       // deletion
                dp[i][j - 1] + 1,       // insertion
                dp[i - 1][j - 1] + cost // substitution
            );
        }
    }
    return dp[len1][len2];
}

function getClosestWords(wordList, word) {
    const closestWords = wordList.map(w => ({
        word: w,
        distance: levDis(word, w)
    }));
    return sortObjectArray(closestWords, 'distance');
}

function main() {
    loadData().then(() => {
        const wordInput = document.getElementById("input");
        const outputElem = document.getElementById("suggestions");

        const debounce = (func, delay) => {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => func(...args), delay);
            };
        };

        const addToInput = (word) => {
            wordInput.value = word;
        };

        const handleInput = () => {
            const word = wordInput.value || "";

            // Clear previous suggestions
            outputElem.innerHTML = "";

            // Calculate closest words
            const closestWords = getClosestWords(words, word);

            for (let i = 0; i < Math.min(closestWords.length, 5); i++) {
                const suggestion = document.createElement('span');
                suggestion.className = 'suggestion';
                suggestion.textContent = closestWords[i].word;
                suggestion.addEventListener('click', () => addToInput(closestWords[i].word));
                outputElem.appendChild(suggestion);
            }
        };

        wordInput.addEventListener("keyup", debounce(handleInput, 300));
    });
}

document.addEventListener("DOMContentLoaded", main);
