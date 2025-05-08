import React from 'react';
import { useFontSize } from './FontSizeProvider';

const FontSizeSelector = () => {
    const { setFontSize } = useFontSize();

    return (
        <div>
            <button onClick={() => setFontSize('small')}>Small</button>
            <button onClick={() => setFontSize('medium')}>Medium</button>
            <button onClick={() => setFontSize('large')}>Large</button>
        </div>
    );
};

export default FontSizeSelector;