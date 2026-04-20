export const Config = {
    apiEndpoint:process.env.REACT_APP_API_ENDPOINTS || "",
    port: process.env.REACT_APP_PORT_NO || "",
    http: process.env.REACT_APP_HTTP_VALUE || "",
};

export const BASE_URL = `${Config.http}${Config.apiEndpoint}${Config.port}`;

export const API_ENDPOINTS = {
    submitReport: "/api/report",
    uploadBulkReports: "/reports/upload",
    downloadBulkSampleCsv: "/reports/upload/sample-csv",
    bulkJobStatus: (jobId: string) => `/api/reports/jobs/${jobId}`,
    dashboardSummary: "/dashboard",
};