import React from 'react';
import './radioButton.scss';

export default function RadioButtonField({
    value,
    label,
    name,
    type,
    options,
    onChange,
    valid,
    validMessage,
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
            {options.map((option, index) => {
                return (
                    <div className="form-check" key={index}>
                        <input
                            className="form-check-input"
                            type={type}
                            name={name}
                            id={option}
                            onChange={onChange}
                            value={option}
                            checked={value === option ? true : false}
                        />
                        <label className="form-check-label" htmlFor={option}>
                            {option}
                        </label>
                    </div>
                );
            })}

            {!valid && <label className="error">{validMessage}</label>}
        </div>
    );
}
