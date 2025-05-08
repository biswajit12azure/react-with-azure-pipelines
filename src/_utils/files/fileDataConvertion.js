const fileDataConvertion =(file)=>{

    const filePromise= new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({
            DocumentTypeID: '',
            FileName: file.name,
            Format: file.type,
            Size: `${file.size} bytes`,
            Portalkey: '',
            File: reader.result.split(',')[1] // Get Base64 string
        });
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });

    const fileData =  Promise.all(filePromise);

    return fileData;
}

export default fileDataConvertion;