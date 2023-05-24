const { createWorker, PSM, OEM  } = require('tesseract.js');

let images = document.getElementsByTagName('img');

// (async () => {
//   const worker = await createWorker({
//     logger: m => console.log(m), // Add logger here
//   });
//   await worker.loadLanguage('eng');
//   await worker.initialize('eng');
//   await worker.setParameters({
//     tessedit_ocr_engine_mode: OEM.TESSERACT_LSTM_COMBINED,
//     tessedit_pageseg_mode: PSM.PSM_SPARSE_TEXT,
//     user_defined_dpi: "600"
//   });
//   const { data: { text, blocks } } = await worker.recognize(images[0].currentSrc);
//   console.log(text);
//   console.log(blocks);
//   await worker.terminate();
// })();

// for(let i = 0; i < images.length; i++){
//   chrome.runtime.sendMessage({msg: 'image', index: i}, function({data, index}){
//     images[index].src = data.link;
//   });
// }