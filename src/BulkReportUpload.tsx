import axios from "axios";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { API_ENDPOINTS, BASE_URL } from "./config";
import { Upload, Download } from 'lucide-react';

type JobStatusResponse = {
    jobId: string;
    totalRows: number;
    processedRows: number;
    successfulRows: number;
    failedRows: number;
    status: "queued" | "processing" | "completed" | "failed";
    failedDetails?: string[];
};

const POLL_INTERVAL_MS = 2000;

const BulkReportUpload = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [jobId, setJobId] = useState("");
    const [jobStatus, setJobStatus] = useState<JobStatusResponse | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDownloadingSample, setIsDownloadingSample] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const baseApi = useMemo(() => BASE_URL, []);
    const token = localStorage.getItem("ngo_auth_token") || "";

    const onFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
        setErrorMessage("");
        setSuccessMessage("");
        setJobStatus(null);
        const file = event.target.files?.[0] || null;
        setSelectedFile(file);
    };

    const uploadFile = async () => {
        if (!selectedFile) {
            setErrorMessage("Please choose a CSV file first.");
            return;
        }

        setIsUploading(true);
        setErrorMessage("");
        setSuccessMessage("");
        setJobStatus(null);

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);

            const response = await axios.post<{ jobId: string }>(
                `${baseApi}${API_ENDPOINTS.uploadBulkReports}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setJobId(response.data.jobId);
            setSuccessMessage(`Upload accepted. Job ID: ${response.data.jobId}`);
        } catch (error) {
            setErrorMessage("Unable to upload file right now. Please check file format and try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const downloadSampleCsv = async () => {
        setErrorMessage("");
        setSuccessMessage("");
        setIsDownloadingSample(true);

        try {
            const response = await axios.get(`${baseApi}${API_ENDPOINTS.downloadBulkSampleCsv}`, {
                responseType: "blob",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const fileUrl = window.URL.createObjectURL(new Blob([response.data], { type: "text/csv" }));
            const anchor = document.createElement("a");
            anchor.href = fileUrl;
            anchor.download = "sample_reports.csv";
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            window.URL.revokeObjectURL(fileUrl);
        } catch (error) {
            setErrorMessage("Unable to download sample CSV right now. Please try again.");
        } finally {
            setIsDownloadingSample(false);
        }
    };

    useEffect(() => {
        if (!jobId) return undefined;

        let timer: number | undefined;
        let isMounted = true;

        const fetchStatus = async () => {
            try {
                const response = await axios.get<JobStatusResponse>(`${baseApi}${API_ENDPOINTS.bulkJobStatus(jobId)}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!isMounted) return;
                setJobStatus(response.data);

                if (response.data.status === "queued" || response.data.status === "processing") {
                    timer = window.setTimeout(fetchStatus, POLL_INTERVAL_MS);
                }
            } catch (error) {
                if (!isMounted) return;
                setErrorMessage("Unable to fetch job status. Retrying...");
                timer = window.setTimeout(fetchStatus, POLL_INTERVAL_MS);
            }
        };

        fetchStatus();

        return () => {
            isMounted = false;
            if (timer) window.clearTimeout(timer);
        };
    }, [baseApi, jobId, token]);

    return (
        <section className="page">
            <h1>Bulk Report Upload</h1>
            <p>Upload a CSV and track background processing status.</p>

            <div className="form-card">
                <label className="field">
                    <span>CSV File</span>
                    <input type="file" accept=".csv,text/csv" onChange={onFileSelect} />
                </label>
                <div className="row">
                    <div className="col-md-6">
                        <button className="primary-btn" type="button" onClick={uploadFile} disabled={isUploading}>
                        <Upload />&nbsp;
                            {isUploading ? "Uploading..." : "Upload CSV"}
                        </button>
                    </div>
                    <div className="col-md-6 text-end">
                        <button
                            className="primary-btn"
                            type="button"
                            onClick={downloadSampleCsv}
                            disabled={isDownloadingSample}
                        >
                            <Download />&nbsp;
                            {isDownloadingSample ? "Preparing..." : "Download Sample CSV"}
                        </button>
                    </div>
                </div>
            </div>

            {errorMessage ? <p className="feedback error">{errorMessage}</p> : null}
            {successMessage ? <p className="feedback success">{successMessage}</p> : null}

            {jobStatus ? (
                <div className="status-card">
                    <h3>Job Progress</h3>
                    <p><strong>Job ID:</strong> {jobStatus.jobId}</p>
                    <p><strong>Status:</strong> {jobStatus.status}</p>
                    <p>
                        <strong>Processed:</strong> {jobStatus.processedRows} of {jobStatus.totalRows} rows
                    </p>
                    <p><strong>Successful Rows:</strong> {jobStatus.successfulRows}</p>
                    <p><strong>Failed Rows:</strong> {jobStatus.failedRows}</p>
                    {jobStatus.failedDetails && jobStatus.failedDetails.length > 0 ? (
                        <div>
                            <strong>Failure Details</strong>
                            <ul className="error-list">
                                {jobStatus.failedDetails.slice(0, 10).map((detail) => (
                                    <li key={detail}>{detail}</li>
                                ))}
                            </ul>
                        </div>
                    ) : null}
                </div>
            ) : null}
        </section>
    );
};

export default BulkReportUpload;