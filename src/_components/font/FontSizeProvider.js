import React, { createContext, useContext, useState, useEffect } from 'react';

   const FontSizeContext = createContext();

   export const useFontSize = () => useContext(FontSizeContext);

    const FontSizeProvider = ({ children }) => {
       const [fontSize, setFontSize] = useState('medium'); // Default font size

       useEffect(() => {
           document.body.classList.remove('font-small', 'font-medium', 'font-large');
           document.body.classList.add(`font-${fontSize}`);
       }, [fontSize]);

       const value = {
           fontSize,
           setFontSize,
       };

       return (
           <FontSizeContext.Provider value={value}>
               {children}
           </FontSizeContext.Provider>
       );
   };

   export default FontSizeProvider;