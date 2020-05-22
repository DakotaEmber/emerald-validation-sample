import React from "react";

import { Checkbox } from "azure-devops-ui/Checkbox";
import { Page } from "azure-devops-ui/Page";
import { Surface, SurfaceBackground } from "azure-devops-ui/Surface";

import { Field } from "./form/field";
import { SampleForm } from "./sample";

import "./styles.css";

/**
 * Standard react-create-app with typescript.
 */
export default function App() {
    // Sample features that can enabled/disabled.
    const [showErrors, setShowErrors] = React.useState(true);
    const [validateOnBlur, setValidateOnBlur] = React.useState(true);
    const [validateOnChange, setValidateOnChange] = React.useState(true);

    return (
        <Surface background={SurfaceBackground.neutral}>
            <Page className="app flex-grow">
                <div style={{ marginBottom: "20px" }}>
                    <h1>Form Validation 101</h1>
                    <Field>
                        <Checkbox checked={showErrors} label="Show Errors" onChange={(event, checked) => setShowErrors(checked)} />
                    </Field>
                    <Field>
                        <Checkbox
                            checked={validateOnBlur}
                            label="Validate On Blur"
                            onChange={(event, checked) => setValidateOnBlur(checked)}
                        />
                    </Field>
                    <Field>
                        <Checkbox
                            checked={validateOnChange}
                            label="Validate On Change"
                            onChange={(event, checked) => setValidateOnChange(checked)}
                        />
                    </Field>
                </div>

                <div style={{ display: "inline-block", width: "300px" }}>
                    <SampleForm showErrors={showErrors} validateOnBlur={validateOnBlur} validateOnChange={validateOnChange} />
                </div>
            </Page>
        </Surface>
    );
}
