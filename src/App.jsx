import { useState } from 'react'
import './App.css'
import {PDFDocument} from 'pdf-lib';

function App() {

  const [file, setFile] = useState()
  const [numberOfPages, setNumberOfPages] = useState()
  console.log('hi file', file)

   const handleDownloadedVersionClick = async (fil) => {
    if (fil){
      const blob = new Blob([fil], { type: "application/pdf" })
      
      const srcPdf = await blob.arrayBuffer()
      const pdfDoc = await PDFDocument.create()
      const sourcePdfDoc = await PDFDocument.load(srcPdf)
      console.log(srcPdf)
      console.log(sourcePdfDoc)
      const copiedPages = await pdfDoc.copyPages(sourcePdfDoc, [0, 3, 89])
const [, , ninetiethPage] = copiedPages;
      console.log(ninetiethPage)
      pdfDoc.addPage(ninetiethPage)
      pdfDoc.setTitle(`Extracted part the from ${fil.name}`)
      const pdfBytes = await pdfDoc.save()
      // setFinalFile(pdfBytes)
    
      console.log('final file pdf', pdfBytes)
      const newBlob= new Blob([pdfBytes], {type: "application/pdf"})
      console.log('newBlob file pdf', newBlob)

      const imageFile= URL.createObjectURL(newBlob)
      setNumberOfPages(imageFile)
      
    }else{console.log('hi yhe file dosen\'t exist')}
  };

  return (
    <div className="App">
      <h1>Extract Pdf App</h1>
      <div>
        <label htmlFor="inputSrc">
          <h2><strong>Select your PDF Document Source</strong></h2>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.7} stroke="currentColor" className="w-2 h-2 icon-doc">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>

        <input id='inputSrc' type="file" accept='.pdf' onChange={(e)=>{setFile(e.target.files[0]);setNumberOfPages(null)}}/>
        </label>
      </div>
      <div className='name'>{file && `${file.name}`}</div>
        <button onClick={() => handleDownloadedVersionClick(file)} disabled={!file  ? true : false}>Upload</button>
        <div className='display-pdf'>
          {numberOfPages && <iframe src={numberOfPages} width={700} height={500} type="application/pdf"></iframe>}
        </div> 
    </div>
  )
}

export default App
