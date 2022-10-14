import React from 'react';
import './inputField.scss';

export default function InputField({
    value,
    label,
    name,
    placeholder,
    type,
    onChange,
    required
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
            />
        </div>
    );
}
