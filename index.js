const { parse, stringify } = require('subtitle');
const unique = require('unique-words');
const cambridgeDictionary = require('cambridge-dictionary');

const msToTime = (duration) => {
  let milliseconds = parseInt((duration % 1000) / 1);
  let seconds = parseInt((duration / 1000) % 60);
  let minutes = parseInt((duration / (1000 * 60)) % 60);
  let hours = parseInt((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}


const ffmpeg = require('ffmpeg');

if (process.argv.length < 3) {
  console.log('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

var fs = require('fs'), filename = process.argv[2];

let cleanedArray = [];
let parsedSubs = [];
let phrase = [];
let forOutCleanArray = [];

fs.readFile(filename, 'utf8', function (err, data) {
  if (err) throw err;
  parsedSubs = parse(data);

  let wordsFromSub = [];

  for (let i = 0; i < parsedSubs.length; i += 1) {

    phrase = parsedSubs[i].text;
    const arrayOfWords = phrase.split(/[' '|'\n']/i);
    
    wordsFromSub = arrayOfWords.map((el) => {
      el = el.replace(/[\,\.\/\!\<\?\>\"\♪\-]/gi, '').toLowerCase();
      if(el != '' & el != 's' & el != 'a' & el != 'i' & el != 'll' & el != 't' ){
          return el;
      };
    });
    wordsFromSub = unique(wordsFromSub);
    cleanedArray[i] = wordsFromSub;
  }

  cleanedArray = unique(cleanedArray);
  let sortCleanedArray = cleanedArray;
  
  sortCleanedArray.sort(function(a, b){
    // ASC  -> a.length - b.length
    // DESC -> b.length - a.length
    return b.length - a.length;
  });
  console.log(sortCleanedArray);
  // sortCleanedArray.length

  for (let i = 0; i < sortCleanedArray.length; i += 1) {
    fs.appendFileSync('sortCleanedArray.txt', `${sortCleanedArray[i]} `);
    fs.appendFileSync('mylist.txt', `file '${sortCleanedArray[i]}.wav' \n`);
    fs.appendFileSync('mylist.txt', `file '${sortCleanedArray[i]}_s.wav' \n`);
  }
  
  const cambridgeDictionary = require('cambridge-dictionary');

  var path = require('path');
  let mp3 = [];
  function fromDir(startPath,filter){
  
     // console.log('Starting from dir '+startPath+'/');
  
      if (!fs.existsSync(startPath)){
          console.log("no dir ",startPath);
          return;
      }

      // const mp3Duration = require('mp3-duration');
      var audioconcat = require('audioconcat')

      let files=fs.readdirSync(startPath);
      //console.log(files.length);
      for(let i=0;i<files.length;i++){
          let filename=path.join(startPath,files[i]);
          let stat = fs.lstatSync(filename);
          if (stat.isDirectory()){
              fromDir(filename,filter); //recurse
          }
          else if (filename.indexOf(filter)>=0) {
            
            lastSpace = filename.indexOf(' ');
            fileRename = filename.substring(0, lastSpace) + '.mp3';
            fs.renameSync(filename, fileRename );
            mp3.push(fileRename);
            //fs.appendFileSync('mp3list.txt', `file ${filename} `  );
            console.log(fileRename);
            // mp3Duration('out 123.mp3', function (err, duration) {
            //   if (err) return console.log(err.message);
            //   console.log('Your file is ' + duration + ' seconds long');
            // });
          };
      };
  };
  
  fromDir('./','.mp3');

  mp3.sort(function(a, b){
    // ASC  -> a.length - b.length
    // DESC -> b.length - a.length
    return b.length - a.length;
  });
  
  for(let i = 0; i < mp3.length; i+=1){
    for( let t = 1; t < 3; t += 1 ){
    fs.appendFileSync('mylistMP3.txt', `file '${mp3[i]}' \n`  );
    fs.appendFileSync('mylistMP3.txt', `file 'silence3sec.mp3' \n`  );
  }
  }
  
  console.log(mp3);
  

  // test it out on home directory 
  findFile(process.env.HOME);
  console.log(jsFiles);
   
})

// for (let i = 0; i < cleanedArray.length; i += 1) {
//     //fs.appendFileSync('uniqueWords.txt', `${cleanedArray[i]}\n`)
//     let start = msToTime(parsedSubs[i].start);
//     //console.log(start);
//     let end = msToTime(parsedSubs[i].end);
//     let phrase = parsedSubs[i].text, index = 0;

//     fs.appendFileSync('out.srt', `${i + 1}`);
//     fs.appendFileSync('out.srt', `\n${start} \-\-\> `);
//     fs.appendFileSync('out.srt', `${end}\n`);
//     fs.appendFileSync('out.srt', `${phrase}\n\n`);

//     for (let j = 0; j < cleanedArray.length; j += 1) {
//       cambridgeDictionary.getExplanation(cleanedArray[j])
//         .then(
//           res => {
//             let word =res.word;
//             let wordPos = res.explanations[0].pos;
//             let guideWord = res.explanations[0].senses[0].guideWord;
//             let level = res.explanations[0].senses[0].definations[0].level;
//             let expText = res.explanations[0].senses[0].definations[0].text;
//             let wordExample = res.explanations[0].senses[0].definations[0].examples[0];

//            // if (word.test(phrase) === true) {

//               fs.appendFileSync('out.srt', `${word}`);
//               fs.appendFileSync('out.srt', ` \(${guideWord}\)`);
//               fs.appendFileSync('out.srt', ` \<${level}\>`);
//               fs.appendFileSync('out.srt', ` ${wordPos}`);
//               fs.appendFileSync('out.srt', `\n${expText}`);
//               fs.appendFileSync('out.srt', `\n${wordExample}\n\n`);
//             //}
//           },

//           error => {
//             console.log(error);
//           }
