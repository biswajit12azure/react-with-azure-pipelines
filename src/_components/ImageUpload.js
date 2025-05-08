import React, { useState } from 'react';
import axios from 'axios';
import Blob from 'blob';
import FormData from 'form-data';
import { Files } from '_utils';
import Link from "@material-ui/core/Link";
//import DocumentViewer from './DocumentViewer';

const ImageUpload = () => {
   const [files, setFiles] = useState([]);
   //const [open,setOpen]= useState(false);
   const handleChange = (newFiles) => {
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
      //  setOpen(true);
   }

   const handleFileRemove = (fileId) => {
      setFiles(prevFiles => prevFiles.filter(prevFile => prevFile.id !== fileId))
   }

   const handleClearFiles = () => {
      setFiles([])
   }

   //    const handleClose=()=>{
   //     setOpen(false);
   //   };

   const handleUploadFiles = () => {
      const formData = new FormData()
      files.forEach((file) => {
         formData.append(file.id, new Blob([file], { type: file.type }), file.name || 'file')
      })

      axios.post('/files', formData).then(() => {
         window.alert(`${files.length} files uploaded succesfully!`)
         setFiles([])
      }).catch((err) => {
         window.alert(`Error uploading files: ${err.message}`)
      })
   }

   const handleOpen = (fileUrl) => {
      window.open(fileUrl, '_blank');
   }

   return (
      <div>
         <h1>File Upload</h1>
         <Files
            className="files-dropzone-list"
            dragActiveClassName="files-dropzone-active"
            style={{ height: '100px' }}
            onChange={handleChange}
            multiple
            maxFiles={5}
            maxFileSize={10000000}
            minFileSize={0}
            clickable>
            Drop files here or click to upload
         </Files>

         <button onClick={handleClearFiles}>Remove All Files</button>
         <button onClick={handleUploadFiles}>Upload</button>
         {files.length > 0 && (
            <div className="files-list">
               <ul>
                  {files.map(file => (
                     <li key={file.id} className="files-list-item">
                        <div className="files-list-item-preview">

                           {/* <DocumentViewer open={open} handleClose={handleClose} file={file.preview.url} type={file.extension}></DocumentViewer> */}
                        </div>
                        <div className="files-list-item-content">
                           {/* <div className="files-list-item-content-item files-list-item-content-item-1">{file.name}</div>
                           <div className="files-list-item-content-item files-list-item-content-item-2">{file.sizeReadable}</div> */}
                           <Link onClick={() => handleOpen(file.preview.url)} >
                              {file.name}
                           </Link>
                        </div>
                        <div
                           className="files-list-item-remove"
                           onClick={() => handleFileRemove(file.id)}
                        />
                     </li>
                  ))}
               </ul>
            </div>
         )}
      </div>
   )
}

export default ImageUpload