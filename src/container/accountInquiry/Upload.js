//import ImageUpload from "_components/ImageUpload";
import React, { useState,useRef } from 'react';
import axios from 'axios';
import Blob from 'blob';
import FormData from 'form-data';
import { Grid, TextField, Typography, Button } from "@material-ui/core";
import fileExtension from "_utils/files/fileExtension";
import fileSizeReadable from '_utils/files/fileSizeReadable';
import fileTypeAcceptable from '_utils/files/fileTypeAcceptable';
import Link from "@material-ui/core/Link";


const Upload = () => {
    // return <ImageUpload></ImageUpload>;
    const idCounter = useRef(1)
    const multiple = true;
    const maxFiles = 5;
    const maxFileSize = 10000000;
    const minFileSize = 0;
    const [singleFile,setSingleFile] = useState({});
    const [files, setFiles] = useState([]);
    const accepts='';

    const handleError = (error, file) => {
        console.log(`error code ${error.code}: ${error.message}`);
     }  

   const handleChange = (event) => {
    event.preventDefault()
    //handleDragLeave(event)

    // Collect added files, perform checking, cast pseudo-array to Array,
    // then return to method
    let filesAdded = event.dataTransfer
       ? event.dataTransfer.files
       : event.target.files

    // Multiple files dropped when not allowed
    if (multiple === false && filesAdded.length > 1) {
       filesAdded = [filesAdded[0]]
    }

    const fileResults = []
    for (let i = 0; i < filesAdded.length; i += 1) {
       const file = filesAdded[i]

       // Assign file an id
       file.id = `files-${idCounter.current}`
       idCounter.current += 1

       // Tell file it's own extension
       file.extension = fileExtension(file)

       // Tell file it's own readable size
       file.sizeReadable = fileSizeReadable(file.size)

       // Add preview, either image or file extension
       if (file.type && file.type.split('/')[0] === 'image') {
          file.preview = {
             type: 'image',
             url: window.URL.createObjectURL(file)
          }
       } else {
          file.preview = {
             type: 'file',
             url: window.URL.createObjectURL(file)
          }
       }

       // Check max file count
       if (fileResults.length >= maxFiles) {
          handleError({
             code: 4,
             message: 'maximum file count reached'
          }, file)

          break
       }

       // Check if file is too big
       if (file.size > maxFileSize) {
          handleError({
             code: 2,
             message: `${file.name} is too large`
          }, file)

          break
       }

       // Check if file is too small
       if (file.size < minFileSize) {
          handleError({
             code: 3,
             message: `${file.name} is too small`
          }, file)

          break
       }

       // Ensure acceptable file type
       if (!fileTypeAcceptable(accepts, file)) {
          handleError({
             code: 1,
             message: `${file.name} is not a valid file type`
          }, file)

          break
       }

       fileResults.push(file)
    }

    setSingleFile(fileResults[0]);
   // setFiles(prevFiles => [...prevFiles, ...fileResults]);
 }

   const handleFileRemove = (fileId) => {
      setFiles(prevFiles => prevFiles.filter(prevFile => prevFile.id !== fileId))
   }

   const handleClearFiles = () => {
      setFiles([])
   }

   const handleUploadFiles = () => {
    //   const formData = new FormData();
    //   files.forEach((file) => {
    //     console.log(file);
    //      formData.append(file.id, new Blob([file], { type: file.type }), file.name || 'file');
    //      console.log(formData);
    //   });

      setFiles(prevFiles => [...prevFiles, singleFile]);
    //   axios.post('/files', formData).then(() => {
    //      window.alert(`${files.length} files uploaded succesfully!`);
    //      setFiles([]);
    //   }).catch((err) => {
    //      window.alert(`Error uploading files: ${err.message}`);
    //   });
   }

   const handleOpen = (fileUrl) => {
      window.open(fileUrl, '_blank');
   }


    return (
        <form className="Upload-containerlist">
            <Grid item xs={12} className="UploadContainer">
                <Typography component="h2"> Attach Non-diclosure Agreement</Typography>
                <Typography component="p">Please download the NDA from this link. Then upload the signed version of this NDA in PDF, PNG, or JPG format </Typography>
                <Grid container >
                    <Grid item xs={4}>
                        <Typography component="p">Signed Non-disclosure Agreement</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField type="file" onChange={handleChange}/>
                    </Grid>
                    <Grid item xs={4}>
                        <Button variant="contained" color="primary" component="span" onClick={handleUploadFiles}>
                            Upload
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} className="UploadContainer">
                <Typography component="h2"> Attach Non-diclosure Agreement</Typography>
                <Typography component="p">Please download the NDA from this link. Then upload the signed version of this NDA in PDF, PNG, or JPG format </Typography>

                <Typography component="div">
                    <Grid container >
                        <Grid item xs={4}>
                            <Typography component="p">Front</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField type="file" onChange={handleChange}/>
                        </Grid>
                        <Grid item xs={4}>
                            <Button variant="contained" color="primary" component="span" onClick={handleUploadFiles}>
                                Upload
                            </Button>
                        </Grid>
                    </Grid>
                </Typography>
                <Typography component="div">
                    <Grid container >
                        <Grid item xs={4}>
                            <Typography component="p">Back</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField type="file" onChange={handleChange}/>
                        </Grid>
                        <Grid item xs={4}>
                            <Button variant="contained" color="primary" component="span" onClick={handleUploadFiles}>
                                Upload
                            </Button>
                        </Grid>
                    </Grid>
                </Typography>
                {files.length > 0 && (
            <div className="files-list">
               <ul>
                  {files.map(file => (
                     <li key={file.id} className="files-list-item">
                        
                        <div className="files-list-item-content">
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
            </Grid>
        </form>
    );
}

export default Upload;