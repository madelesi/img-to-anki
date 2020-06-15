import { saveAs } from 'file-saver';
import AnkiExport from "anki-apkg-export";


function main(){
	let inputElement = document.getElementById("input");
	inputElement.addEventListener("change", handleFiles, false);

	function handleFiles() {
		let selectedFiles = document.getElementById('input').files;
		let apkg = filesToAnkiPkg(selectedFiles);
		downloadApkg(apkg)
	}

}

function filesToAnkiPkg(fileList) {
	// Returns a .apkg file from a fileList or an array of file
   
	// Sort Files by modified date
	let sortedArray = sortFileListModified(fileList)

	// Check that length is even
	if (sortedArray.length % 2 != 0) {
		throw "there must be an even number of files "
	}

	// Pair files
	let q_a_pairs = arrayToPairs(sortedArray)

	// Add Pairs to AnkiDeck?
	let apkg = filePairsToAnkiPkg(q_a_pairs);
	return apkg;
}
function downloadApkg(apkg) {

	apkg.save().then(zip => {  saveAs(zip, 'output.apkg');}).catch(err => console.log(err.stack || err));
}


function sortFileListModified(fileList) {
	// stackoverflow.com/questions/10123953/how-to-sort-an-array-by-a-date-property
	let filesArray = Array.prototype.slice.call(fileList)
	filesArray.sort((a, b) => a.lastModified - b.lastModified)
	return filesArray
}

function arrayToPairs(a) {
	// Pairs up an array (Ex. arrayToPairs([1,2,3,4]) -> [[1,2], [3,4]] )
	let pairsArr = []
	for (var i = 0; i < a.length-1; i+=2) {
		let pair = [a[i], a[i+1]]
		pairsArr.push(pair)
	}
	return pairsArr
}

function filePairsToAnkiPkg(filePairs) {
	// Takes in 2-d array of file pairs (Ex. [[Question1, Ans1], [Question2, Ans2]] )
	// Returns an AnkiExport apkg object.

	let apkg = new AnkiExport("AnkiDeck")

	// Add all files to media & cards
	for (var i = filePairs.length - 1; i >= 0; i--) {
		let pair = filePairs[i]
		let fileQ = pair[0]
		let fileA = pair[1]
		apkg.addMedia(fileQ.name, fileQ)
		apkg.addMedia(fileA.name, fileA)
		apkg.addCard('<img src=' + fileQ.name + ' />', '<img src=' + fileA.name + ' />')
	}
	return apkg;
    

}

main()
