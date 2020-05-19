import React from "react";
import { css } from "../util/css";

import { IReadonlyObservableValue, Observer } from "emerald-observable";
import { Validation, ValidationDelegate } from "emerald-validation";

import "./input.css";

export interface IButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLInputElement>, "disabled"> {
    disabled?: IReadonlyObservableValue<boolean> | boolean;
}

export function Button(props: IButtonProps): React.ReactElement {
    const { disabled, type = "button", ...buttonProps } = props;

    return (
        <Observer disabled={disabled}>
            {({ disabled }: { disabled?: boolean }) => <input {...buttonProps} disabled={disabled} type={type} />}
        </Observer>
    );
}

let checkboxId = 0;

export interface ICheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "checked"> {
    checked: IReadonlyObservableValue<boolean> | boolean;
    className?: string;
    label?: string;
    validateOnChange?: boolean;
    validation?: ValidationDelegate;
}

export function Checkbox(props: ICheckboxProps): React.ReactElement {
    const [id] = React.useState(() => `checkbox_${++checkboxId}`);

    const { validateOnChange = true, validation, ...checkboxProps } = props;

    let checkbox = (
        <span className={css(props.className, "checkbox")}>
            <Observer checked={props.checked}>
                {({ checked }: { checked?: boolean }): React.ReactNode => (
                    <input id={id} {...checkboxProps} checked={checked} type="checkbox" />
                )}
            </Observer>
            {props.label && <label htmlFor={id}>{props.label}</label>}
        </span>
    );

    if (validation || validateOnChange) {
        checkbox = (
            <Validation validation={validation} value={validateOnChange ? props.checked : undefined}>
                {checkbox}
            </Validation>
        );
    }

    return checkbox;
}

export interface ITextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value"> {
    className?: string;
    value?: IReadonlyObservableValue<string> | string;
    validateOnChange?: boolean;
    validation?: ValidationDelegate;
}

export function TextInput(props: ITextFieldProps): React.ReactElement {
    const { validateOnChange = true, validation, ...inputProps } = props;

    let textfield = (
        <Observer value={props.value}>
            {({ value }: { value?: string }): React.ReactNode => (
                <input {...inputProps} className={css(props.className, "textfield")} type="text" value={value} />
            )}
        </Observer>
    );

    if (validation || validateOnChange) {
        textfield = (
            <Validation validation={validation} value={validateOnChange ? props.value : undefined}>
                {textfield}
            </Validation>
        );
    }

    return textfield;
}
