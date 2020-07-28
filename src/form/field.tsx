import React from "react";
import { css } from "../util/css";

import { ValidationBoundaryWithState } from "emerald-validation";

import "./field.css";

export interface IFieldProps {
    /**
     * Custom CSS class name applied to outer element of the field.
     */
    className?: string;

    /**
     * The compact form of a field is used to reduce the spacing between
     * fields.
     *
     * @default false
     */
    compact?: boolean;

    /**
     * The label is a value that is used in the UI to represent the name of
     * the field the user will see. This should be set to a human readable
     * short hand name for the field.
     *
     * @default undefined
     */
    label?: string;

    /**
     * The required property is used to render UI in the form field that
     * denotes the field is required. NOTE: This doesn't enforce the value
     * be required, that needs to be done with a validation rule.
     *
     * @default false
     */
    required?: boolean;

    /**
     * Some fields may want to participate in field validation but not render
     * the standard error section. Setting showErrors to false will prevent
     * the field from rendering the error section.
     *
     * @default true
     */
    showErrors?: boolean;

    /**
     * Should validation be performed within the field or allow the parent
     * form perform the validation. This can be set to false to avoid a
     * validation boundary be emitted to trap errors within the field.
     *
     * A field will validates its contents and set the "field-error-state"
     * css class on the field element when validation fails. This allows
     * the fields to style themselves when in an error state.
     *
     * @default true NOTE: Passing false can improve performance a small
     * amount by ommitting the valdiation boundary.
     */
    validate?: boolean;
}

/**
 * The general purpose of a field is two factor.
 *
 *  1) Render some basic HTML around an input field with some standard styling
 *     too improve the consistency of the UI.
 *  2) Generate a ValidationBoundary used to capturing and presenting errors
 *     that occur within contained inputs.
 *
 * @param props The properties used to control the look and behavior of a field.
 */
export function Field(props: IFieldProps & { children?: React.ReactNode }): React.ReactElement {
    const { showErrors = true, validate = true } = props;

    const fieldName = (): React.ReactElement | null => {
        return props.label ? (
            <div className="field-label">
                {props.label}
                {props.required && <span className="field-required" />}
            </div>
        ) : null;
    };

    // Wrap the field element in a validation boundary if the caller wants
    // localized error handling.
    return validate ? (
        <ValidationBoundaryWithState>
            {({ errors }: { errors: Error[] }) => (
                <div className={css(props.className, "field", props.compact && "field-compact", errors.length > 0 && "field-error-state")}>
                    {fieldName()}
                    <div className="field-element">{props.children}</div>
                    {showErrors &&
                        errors.length > 0 &&
                        errors.map((error, index) => (
                            <div className="field-error" key={index}>
                                {error.message}
                            </div>
                        ))}
                </div>
            )}
        </ValidationBoundaryWithState>
    ) : (
        <div className={css(props.className, "field", props.compact && "compact")}>
            {fieldName()}
            <div className="field-element">{props.children}</div>
        </div>
    );
}
