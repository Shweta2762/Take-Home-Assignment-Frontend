import { FormEvent, useMemo, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS, BASE_URL } from "./config";

type ReportFormState = {
    ngoId: string;
    month: string;
    peopleHelped: string;
    eventsConducted: string;
    fundsUtilized: string;
};

const initialFormState: ReportFormState = {
    ngoId: "",
    month: "",
    peopleHelped: "",
    eventsConducted: "",
    fundsUtilized: "",
};

const ReportSubmissionForm = () => {
    const [form, setForm] = useState<ReportFormState>(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const baseApi = useMemo(() => BASE_URL, []);
    const token = localStorage.getItem("ngo_auth_token") || "";

    const handleInputChange = (key: keyof ReportFormState, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const validate = () => {
        if (!form.ngoId.trim()) return "NGO ID is required.";
        if (!form.month) return "Month is required.";

        const peopleHelped = Number(form.peopleHelped);
        const eventsConducted = Number(form.eventsConducted);
        const fundsUtilized = Number(form.fundsUtilized);

        if (Number.isNaN(peopleHelped) || peopleHelped < 0) return "People helped must be a non-negative number.";
        if (Number.isNaN(eventsConducted) || eventsConducted < 0) return "Events conducted must be a non-negative number.";
        if (Number.isNaN(fundsUtilized) || fundsUtilized < 0) return "Funds utilized must be a non-negative number.";

        return "";
    };

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        const validationError = validate();
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        setIsSubmitting(true);
        try {
            await axios.post(`${baseApi}${API_ENDPOINTS.submitReport}`, {
                ngoId: form.ngoId.trim(),
                month: form.month,
                peopleHelped: Number(form.peopleHelped),
                eventsConducted: Number(form.eventsConducted),
                fundsUtilized: Number(form.fundsUtilized),
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setSuccessMessage("Report submitted successfully.");
            setForm(initialFormState);
        } catch (error) {
            setErrorMessage("Unable to submit report right now. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="page">
            <h1>Report Submission Form</h1>
            <p>Submit one NGO's monthly report.</p>

            <form className="form-card" onSubmit={onSubmit}>
                <label className="field">
                    <span>NGO ID</span>
                    <input
                        type="text"
                        value={form.ngoId}
                        onChange={(event) => handleInputChange("ngoId", event.target.value)}
                        placeholder="e.g. NGO-1021"
                    />
                </label>

                <label className="field">
                    <span>Month</span>
                    <input
                        type="month"
                        value={form.month}
                        onChange={(event) => handleInputChange("month", event.target.value)}
                    />
                </label>

                <label className="field">
                    <span>People Helped</span>
                    <input
                        type="number"
                        min={0}
                        value={form.peopleHelped}
                        onChange={(event) => handleInputChange("peopleHelped", event.target.value)}
                        placeholder="0"
                    />
                </label>

                <label className="field">
                    <span>Events Conducted</span>
                    <input
                        type="number"
                        min={0}
                        value={form.eventsConducted}
                        onChange={(event) => handleInputChange("eventsConducted", event.target.value)}
                        placeholder="0"
                    />
                </label>

                <label className="field">
                    <span>Funds Utilized</span>
                    <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={form.fundsUtilized}
                        onChange={(event) => handleInputChange("fundsUtilized", event.target.value)}
                        placeholder="0.00"
                    />
                </label>

                <button className="primary-btn" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Report"}
                </button>
            </form>

            {errorMessage ? <p className="feedback error">{errorMessage}</p> : null}
            {successMessage ? <p className="feedback success">{successMessage}</p> : null}
        </section>
    );
};

export default ReportSubmissionForm;