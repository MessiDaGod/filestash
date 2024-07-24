import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { nop } from "../helpers/";
import "./input.scss";

export const Input = ({ type, onMouseDown, onMouseUp, onChange, ...props }) => {
    const inputRef = useRef(null);

    const handleMouseDown = onMouseDown ? onMouseDown.bind(this) : null;
    const handleMouseUp = onMouseUp ? onMouseUp.bind(this) : null;

    return type === "checkbox" ? (
        <div
            className="component_checkbox"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}>
            <input
                type="checkbox"
                {...props}
                onChange={onChange || nop}
                ref={inputRef} />
            <span className="indicator"></span>
        </div>
    ) : (
        <input
            className="component_input"
            onChange={onChange || nop}
            {...props}
            ref={inputRef} />
    );
};

Input.propTypes = {
    type: PropTypes.string,
    placeholder: PropTypes.string,
    onMouseDown: PropTypes.func,
    onMouseUp: PropTypes.func,
    onChange: PropTypes.func,
};

export const Select = ({ choices = [], id, onChange, name, value, placeholder }) => {
    const selectId = id ? { id } : {};

    return (
        <select className="component_select joe" onChange={onChange} {...selectId} name={name} defaultValue={value}>
            <option hidden>{placeholder}</option>
            {choices.map((choice, index) => (
                <option key={index} value={choice}>{choice}</option>
            ))}
        </select>
    );
};

Select.propTypes = {
    choices: PropTypes.array,
    id: PropTypes.string,
    onChange: PropTypes.func,
    name: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
};

export const Enabler = ({ target = [], defaultValue, onChange }) => {
    const inputRef = useRef(null);

    useEffect(() => {
        requestAnimationFrame(() => {
            toggle(defaultValue || false);
        });
    }, [defaultValue]);

    const toggle = (value) => {
        target.forEach((t) => {
            const $el = document.getElementById(t);
            if (!$el) return;

            const parentElement = $el.parentElement.parentElement.parentElement.parentElement;
            if (value === true) {
                parentElement.style.display = "block";
                parentElement.style.opacity = "1";
            } else {
                parentElement.style.display = "none";
                parentElement.style.opacity = "0";

                // reset value
                if ($el.value) {
                    $el.value = null;
                    const event = new Event("input", { bubbles: true });
                    event.simulated = true;
                    $el.dispatchEvent(event);
                }
            }
        });
    };

    const handleChange = (e) => {
        toggle(e.target.checked);
        if (onChange) {
            onChange(e);
        }
    };

    return (
        <Input type="checkbox" onChange={handleChange} defaultChecked={defaultValue} ref={inputRef} />
    );
};

Enabler.propTypes = {
    target: PropTypes.array,
    defaultValue: PropTypes.bool,
    onChange: PropTypes.func,
};
