import React from "react";
import { css } from "../util/css";

import { getValue, IReadonlyObservableValue } from "emerald-observable";
import { ValidationContext, ValidationContextImplementation } from "emerald-validation";

import "./form.css";

/**
 * Props used to build the HTML <form />.
 */
export interface IFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
    className?: string;
    validateOnBlur?: IReadonlyObservableValue<boolean> | boolean;
}

/**
 * The Form component is used to create a form and attach the validation needed to
 * work with the form and its validation state.
 *
 * @param props The basic properties for the HTML form element.
 */
export function Form(props: IFormProps & { children?: React.ReactNode }) {
    const { validateOnBlur, ...formProps } = props;

    const [validationContext] = React.useState(() => new ValidationContextImplementation());

    const blur = (event: React.FocusEvent<HTMLElement>) => {
        getValue(validateOnBlur) && validate();
    };

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        if (!validationContext.invalid.value) {
            props.onSubmit && props.onSubmit(event);
        } else {
            event.preventDefault();
        }
    };

    const validate = () => {
        validationContext.validate().then(undefined, () => {
            // Ignore failed validation passes, they were interrupted by a new pass.
        });
    };

    // Perform validation on values when the form is initially rendered.
    // At this point the form will have the proper validation state.
    React.useEffect(validate, []);

    return (
        <form {...formProps} className={css(props.className, "form")} onBlur={blur} onSubmit={submit}>
            <ValidationContext.Provider value={validationContext}>{props.children}</ValidationContext.Provider>
        </form>
    );
}
