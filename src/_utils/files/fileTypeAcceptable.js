// eslint-disable-next-line
const mimeTypeRegexp = /^(application|audio|example|image|message|model|multipart|text|video|\*)\/[a-zA-Z0-9\.\+\*-]+$/
const extRegexp = /\.[a-zA-Z0-9]+$/

const fileTypeAcceptable = (accepts, file) => {
   if (!accepts) {
      return true
   }

   return accepts.some((accept) => {
     // console.log('Checking accept:', accept);
      if (file.type && accept.match(mimeTypeRegexp)) {
         const [typeLeft, typeRight] = file.type.split('/')
         const [acceptLeft, acceptRight] = accept.split('/')

         // console.log('File type:', file.type);
         // console.log('Accept type:', accept);

         if (acceptLeft && acceptRight) {
            if (acceptLeft === '*' && acceptRight === '*') {
               return true
            }

            if (acceptLeft === typeLeft && acceptRight === '*') {
               return true
            }

            if (acceptLeft === typeLeft && acceptRight === typeRight) {
               return true
            }
         }
      } else if (file.extension && accept.match(extRegexp)) {
         const ext = accept.substr(1)
         // console.log('File extension:', file.extension);
         // console.log('Accept extension:', ext);

         return file.extension.toLowerCase() === ext.toLowerCase()
      }

      return false
   })
}

export default fileTypeAcceptable
