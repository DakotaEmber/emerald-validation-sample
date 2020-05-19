import React from "react";
import { Form } from "./form/form";
import { Button, Checkbox, TextInput } from "./form/input";
import { Field } from "./form/field";
import { aggregate, equal, phoneNumber, required } from "./validations";

import { useObservable } from "emerald-observable";
import { IValidationContext, ValidationContext } from "emerald-validation";

import "./styles.css";

/**
 * Standard react-create-app with typescript.
 */
export default function App() {
    // Sample features that can enabled/disabled.
    const [validateOnBlur, setValidateOnBlur] = useObservable(false);
    const [showErrors, setShowErrors] = React.useState(true);

    // Function to change the data without going through the UX controls.
    const clear = () => {
        setAddress("");
        setName("");
        setPn("");
    };

    // Sample method that would create an object from the data and submit it.
    // NOTE: This calls preventDefault and doesn't actually submit.
    const submit = (event: React.SyntheticEvent<HTMLElement>) => {
        const fieldData = {
            address: address.value,
            inc: inc.value,
            name: name.value,
            pn: pn.value
        };

        console.log(`submitting form ... with ${JSON.stringify(fieldData)}`);
        event.preventDefault();
    };

    //
    // ObservableValues given to the components.
    //
    // All components are 100% controlled components and never change the
    // values themselves, the change handlers are used to update the values.
    //
    const [address, setAddress] = useObservable("");
    const [agree, setAgree] = useObservable(false);
    const [inc, setInc] = useObservable(true);
    const [name, setName] = useObservable("DakotaEmber");
    const [pn, setPn] = useObservable("800-555-1212");

    /**
     * The UI is broken down into two sections:
     *  1) The header that allows you to control a few small features.
     *  2) A small sample form with a number of fields that demonstrate
     *     some of the basic form validation capabilities. The details
     *     of section 2 are below.
     *
     * One note, the components in this example were not intended to be
     * a component library, just a set of basic components that could be
     * used in this demonstration.
     *
     * Fields
     *  Name - this is marked required. Realize this is a UI concept
     *   only and doesnt affect the input within it. The Field contains a
     *   TextInput component which allows the user to supply a string.
     *   You will notice on all the components, an onChange that calls the
     *   appropriate set... method to update the observable's current value.
     *   This is key to the minimalistic updates that the observable pattern
     *   generates. It also tends to push the developer to a strict controlled
     *   component model. Next you see the required prop is set, this is
     *   forwarded to the input and doesn't actually apply the validation.
     *   spellCheck = false, I just like this one in general, I dont need
     *   to see red lines in a name field. validation is the key property
     *   in this property list for this example. This is the property that
     *   drives validation. You supply a single delegate that is called to
     *   validate this field when a validation pass is done. I have a helper
     *   function called aggregate that allows you to pass an array of
     *   validation functions and get back a single function. This is not
     *   required but may be helpful if you have a bunch of validations you
     *   want to run (note it will report all failures, not just one). The
     *   last property value is also important. This is the observable value
     *   that represents the data being shown in this component.
     *
     *  Phone - This component is very similar to the Name Field except it
     *   uses a single validation function that validates the input is in
     *   the shape of a phone number.
     *
     *  Address - The address is not like the first two, it has no validation
     *   rules associated with it. This means the field will never produce any
     *   errors. Instead you will notice validateOnChange is set of false.
     *   It isn't 100% true that these are mutually exclusive. It may be that
     *   address would affect rules on other components and you still want
     *   validation to run when this field changes. In this case though address
     *   is never used in any validations so passing valdiateOnChange as false
     *   improves possible performance since there is no need to run all the
     *   rules as you type in the address field.
     *
     *  Checkbox1 (mail) - The first checkbox is just a checkbox, it doesnt use
     *   a field and it is marked as validateOnChange = false since it has no
     *   effect on any validation rules.
     *
     *  Checkbox2 (licence) - This checkbox also has no field around it since it
     *   doesn't want any of the fields presentation. No styling, and it doesn't
     *   want to show errors inline in the UI. It does have a validation rule and
     *   it is different than the others. Validation rules can fail both
     *   synchronously as well as asynchronously. This allows validation to do
     *   things like make network calls to validate inputs. You need to be careful
     *   in these cases though since the UI wont fully update with the results
     *   until the validation pass is complete.
     *
     * The last point of real interest in the sample is the Submit button at the
     * bottom of the form. You will notice it uses a ValidationContext.Consumer
     * to get access to the validation context within the Form. It uses the
     * context.invalid value which is Observable to maintain the enabled state
     * of the button. If the validation context is invalid the submit button is
     * disabled. Note there is an asynchronous rule so state changes will be
     * delayed. If you want to see the effect of long running async validation
     * rules you can increase the timeout.
     */
    return (
        <div className="app">
            <div style={{ marginBottom: "50px" }}>
                <h1>Form Validation 101</h1>
                <Field>
                    <Checkbox
                        checked={validateOnBlur}
                        label="Validate On Blur"
                        onChange={(event) => setValidateOnBlur(event.target.checked)}
                    />
                </Field>
                <Field>
                    <Checkbox checked={showErrors} label="Show Errors" onChange={(event) => setShowErrors(event.target.checked)} />
                </Field>
            </div>

            <div style={{ display: "inline-block", width: "300px" }}>
                <Form action="http://localhost:4000" method="post" onSubmit={submit} validateOnBlur={validateOnBlur}>
                    <Field label="Name" required={true} showErrors={showErrors}>
                        <TextInput
                            onChange={(event) => setName(event.target.value)}
                            required={true}
                            spellCheck={false}
                            validation={aggregate([equal(name, "DakotaEmber"), required(name)])}
                            value={name}
                        />
                    </Field>
                    <Field label="Phone" required={true} showErrors={showErrors}>
                        <TextInput
                            onChange={(event) => setPn(event.target.value)}
                            spellCheck={false}
                            validation={phoneNumber(pn)}
                            value={pn}
                        />
                    </Field>
                    <Field label="Address" validate={false}>
                        <TextInput
                            onChange={(event) => setAddress(event.target.value)}
                            spellCheck={false}
                            validateOnChange={false}
                            value={address}
                        />
                    </Field>
                    <Checkbox
                        checked={inc}
                        label="Include me on the mailing list"
                        onChange={(event) => setInc(event.target.checked)}
                        validateOnChange={false}
                    />
                    <Checkbox
                        checked={agree}
                        label="I agree to the terms of service"
                        onChange={(event) => setAgree(event.target.checked)}
                        validation={(event) => {
                            event.pending(
                                new Promise<void>((resolve) => {
                                    window.setTimeout(() => {
                                        !agree.value && event.fail("You must agree to the terms of service");
                                        resolve();
                                    }, 100);
                                })
                            );
                        }}
                    />

                    <div className="flex-row horizontal-spacing-small" style={{ marginTop: "16px" }}>
                        <Button onClick={clear} value="Clear" />
                        <div className="flex-grow" />
                        <ValidationContext.Consumer>
                            {(validationContext: IValidationContext) => <Button disabled={validationContext.invalid} type="submit" />}
                        </ValidationContext.Consumer>
                    </div>
                </Form>
            </div>
        </div>
    );
}
