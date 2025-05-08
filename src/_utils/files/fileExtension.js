const fileExtension = (file) => {
    const extensionSplit = file.name.split('.')
    if (extensionSplit.length > 1) {
       const extension= extensionSplit[extensionSplit.length - 1];
       return extension.toLowerCase();
    }
 
    return 'none'
 }
 
 export default fileExtension