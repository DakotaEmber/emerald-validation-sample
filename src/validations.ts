import { ValidationDelegate, ValidationEvent } from "emerald-validation";
import { getValue, IReadonlyObservableValue } from "emerald-observable";

/**
 * aggregate is used to run a set of validations on a single value.
 *
 * @param validations set of validation functions that should be executed.
 */
export function aggregate(validations: Array<ValidationDelegate | undefined>): ValidationDelegate {
    return function aggregate(event: ValidationEvent) {
        for (const validation of validations) {
            validation && validation(event);
        }
    };
}

/**
 * Validation function that requires the value to match the match value.
 *
 * @param value The current value of the data element.
 * @param match The value it should match or a function that will return a match result.
 */
export function equal<T extends string | number | boolean | Date>(
    value: IReadonlyObservableValue<T> | T,
    match: T | ((event: ValidationEvent, value: T | undefined) => void)
): ValidationDelegate {
    return function equal(event: ValidationEvent) {
        const resolvedValue = getValue(value);

        if (typeof match === "function") {
            match(event, resolvedValue);
        } else {
            resolvedValue !== match && event.fail(`The value '${getValue(value)}' doesn't match the required value '${match}'.`);
        }
    };
}

/**
 * Validation function that enforces the string value have a value. Meaning it isnt,
 * undefined, null, or empty string.
 *
 * @param value The current value of the data element.
 */
export function required(value?: IReadonlyObservableValue<string | boolean> | string | boolean): ValidationDelegate {
    return function required(event: ValidationEvent) {
        const resolvedValue = getValue(value);

        // We define undefined, null and "" as failure cases.
        !resolvedValue && event.fail(`This is a required value and hasn't been supplied.`);
    };
}

/**
 * Simple example of a rule that uses a regular expression to validate the
 * format of a string value.
 *
 * @param value The value that should be tested.
 */
export function phoneNumber(value?: IReadonlyObservableValue<string> | string): ValidationDelegate {
    return function phoneNumber(event: ValidationEvent) {
        !/^\(?([0-9]{3})\)?[-]?([0-9]{3})[-]?([0-9]{4})$/g.test(getValue(value) || "") &&
            event.fail("Value should look like a phone number.");
    };
}
