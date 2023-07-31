import { useCallback, useState } from 'react'
import {MemorizedChoiceExtract} from './choiceExtract';
import {PDFDocument} from 'pdf-lib';
import './App.css'



function App() {

  const [file, setFile] = useState()
  const [numberOfPages, setNumberOfPages] = useState(null)
  const [pagesNumber, setPagesNumber] = useState('')
  const [choice, setChoice] = useState('')
  const [newChoice, setNewChoice] = useState('')

  const handleChangeScattred = (event) => {
    setPagesNumber(event.target.value)
  }

  const handleChangeRange = (event) => {
    setPagesNumber((event.target.value))
  }

  const handleChangeFile = (event) => {
    setFile(event.target.files[0]);
    setNumberOfPages(null);
    setPagesNumber('')
  }

  function range(start, end) {
    let length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i - 1);
  }

  const tableNumberRange = ( str ) => {
    let pattern = /^to|[^0-9]/g 
    let resultTest = pattern.test(str)
    console.log(resultTest)
    if (str.trim().length > 0 && choice && choice === "range"){
      const SplittedStr = str.split('to').map( x => Number(x))
      if (SplittedStr[1] > SplittedStr[0]){
      
        return range(SplittedStr[0],SplittedStr[1])
      }else{
        alert("You should  follow the example above \n and the second number should be greater than the first one")
        setPagesNumber('')  
      }
    
    }
    if (str.trim().length > 0 && choice && choice === "scattered"){
      const splittedStr = str.split(',').map( x => Number(x) - 1)
      const checkTab =function isAscending(arr) {
        return arr.every(function (x, i) {
            return i === 0 || x >= arr[i - 1];
        });
      }
      if ( checkTab(splittedStr) ){
        return splittedStr
      }else {
        alert("You should  follow the example above \n and the numbers should be Ascendent")
        setPagesNumber('')  
      }
    }
  }

   const handleDownloadedVersionClick = async (fil,tab) => {
    if (fil){
      const blob = new Blob([fil], { type: "application/pdf" })
      
      const srcPdf = await blob.arrayBuffer()
      const pdfDoc = await PDFDocument.create()
      const sourcePdfDoc = await PDFDocument.load(srcPdf)
      console.log(tab)
      const tableOne = tableNumberRange( tab )
      console.log(tableOne)
      if (tableOne !== undefined) {

        const copiedPages = await pdfDoc.copyPages(sourcePdfDoc, tableOne)
        copiedPages.forEach(page => pdfDoc.addPage(page))
        
        pdfDoc.setTitle(`Extracted part from ${fil.name}`)
        const pdfBytes = await pdfDoc.save()
       
        const newBlob= new Blob([pdfBytes], {type: "application/pdf"})
        // console.log('newBlob file pdf', newBlob)
  
        const imageFile= URL.createObjectURL(newBlob)
        setNumberOfPages(imageFile)
        
      }else {
        return;
      }
      
    }
  };

  const handlePageBehaviour = useCallback(() =>{
  
   if(choice == newChoice || choice == ''){
    return;
  }

  if(choice !== newChoice && numberOfPages === null){
    setNumberOfPages(null)
    setNewChoice(choice)
  }
 
  },[choice])

console.log('app is rendering')
  return (
    <div className="App">
      <h1>Extract Pdf App</h1>
      <div>
        <label htmlFor="inputSrc">
          <h2><strong>Select your PDF Document Source</strong></h2>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.7} stroke="currentColor" className="w-2 h-2 icon-doc">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>

        <input id='inputSrc' type="file" accept='.pdf' onChange={ (event) => handleChangeFile(event)}/>
        {/* <input id='inputSrc' type="file" accept='.pdf' onChange={(e)=>{setFile(e.target.files[0]);setNumberOfPages(null);setPagesNumber('')}}/> */}
        </label>
      </div>
      <div className='name'>{file && `${file.name}`}</div>
        <div style={{margin: '0 40px', }}>
          <div>
            <MemorizedChoiceExtract handlePageBehaviour={handlePageBehaviour} setNewChoice={setNewChoice} setPagesNumber={setPagesNumber} choice={choice} setChoice={setChoice} />
          </div>
          {choice && <div>{choice}</div>}
          { choice !== '' && choice=== 'range' &&
          <div>
          <p>Example: 6 to 25 </p>
          <input type="text" value={pagesNumber} name='range-start-end' placeholder='Enter the numbers of pages like the example above' onChange={(e)=> handleChangeRange(e)} />
          </div>}
          { choice !== '' && choice=== 'scattered' &&  
          <div>
            <p>Example: 6, 8, 25, 60 </p>
            <input type="text" value={pagesNumber} name='scattered' placeholder='Enter the numbers of pages like the example above' onChange={ (e) =>handleChangeScattred(e)} />
          </div>}
        </div>
        <p style={{margin: 0, display:'flex', placeItems:'start'}}><span style={{color:'#da8b8b', textDecoration: 'underline'}}>Notice: Page numbers start with 1</span></p>
        <button onClick={() => {handleDownloadedVersionClick(file,pagesNumber); console.log(pagesNumber)}} disabled={!file}>Upload</button>
        <div className='display-pdf'>
          {numberOfPages && <iframe src={numberOfPages} width={700} height={500} type="application/pdf"></iframe>}
        </div> 
    </div>
  )
}

export default App
