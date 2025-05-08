import React, { useEffect, useState } from "react";

const PasswordCheck = ({ password,userName, onValidationChange }) => {
    const [validations, setValidations] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
        fullname:false
    });

    useEffect(() => {
        validatePassword(password,userName);
    }, [password]);

    const validatePassword = (password,userName) => {
        const newValidations = {
            length: password?.length >= 8 && password?.length <= 16,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>']/.test(password),
            fullname: password && !password.toLowerCase().includes(userName.toLowerCase()),
        };
        setValidations(newValidations);

        const isPasswordValid = Object.values(newValidations).every(Boolean);
        onValidationChange(isPasswordValid);
    };

    return (
        <div className="passwordselect">
            <p>Your password must contain</p>
            <ul>
                <li >
                    <label className="passwordselectli">
                        <input type="checkbox" checked={validations.length} readOnly />
                        <span style={{ color: validations.length ? 'green' : 'red' }} className="checkmark"></span>8 to 16 characters
                    </label>
                </li>
                <li >
                    <label className="passwordselectli">
                        <input type="checkbox" checked={validations.uppercase} readOnly />
                        <span style={{ color: validations.uppercase ? 'green' : 'red' }} className="checkmark"></span>Upper case letter (A-Z).
                    </label>
                </li>
                <li >
                    <label className="passwordselectli">
                        <input type="checkbox" checked={validations.lowercase} readOnly />
                        <span style={{ color: validations.lowercase ? 'green' : 'red' }} className="checkmark"></span>Lower case letters (a-z).
                    </label>
                </li>
                <li >
                    <label className="passwordselectli">
                        <input type="checkbox" checked={validations.number} readOnly />
                        <span style={{ color: validations.number ? 'green' : 'red' }} className="checkmark"></span>Numbers (0-9)
                    </label>
                </li>
                <li >
                    <label className="passwordselectli">
                        <input type="checkbox" checked={validations.special} readOnly />
                        <span style={{ color: validations.special ? 'green' : 'red' }} className="checkmark"></span>Symbols (!@#$%^&*?/\|"':;+)
                    </label>
                </li>
                <li >
                    <label className="passwordselectli">
                        <input type="checkbox" checked={validations.fullname} readOnly />
                        <span style={{ color: validations.fullname ? 'green' : 'red' }} className="checkmark"></span>Password should not contain your FullName
                    </label>
                </li>
            </ul>
        </div>
    );
};

export default PasswordCheck;