import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const BackButtonHandler = () => {
    const navigate = useNavigate();
    const isClicked = useRef(false); // To prevent multiple clicks

    useEffect(() => {
        const handleBackButton = () => {
            if (!isClicked.current) {
                isClicked.current = true;
                navigate(-1); // Go back
                setTimeout(() => (isClicked.current = false), 500); // Prevent double-clicks
            }
        };

        window.addEventListener('popstate', handleBackButton);

        return () => {
            window.removeEventListener('popstate', handleBackButton);
        };
    }, [navigate]);

    return null; // No UI component needed
};

export default BackButtonHandler;
