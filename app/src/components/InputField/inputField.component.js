import React from 'react';
import './inputField.scss';

export default function InputField({
    value,
    label,
    name,
    placeholder,
    type,
    onChange,
    valid,
    validMessage,
    required,
    disabled
}) {
    return (
        <div className="form-group">
            {label && (
                <label htmlFor="input-field">
                    {label}
                    {required && <span>*</span>}
                </label>
            )}
            <input
                type={type}
                value={value}
                name={name}
                className="form-control"
                placeholder={placeholder}
                onChange={onChange}
                disabled={disabled}
            />
            {!valid && <label className="error">{validMessage}</label>}
        </div>
    );
}
