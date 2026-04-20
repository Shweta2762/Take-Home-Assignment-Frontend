export const Config = {
  baseUrl: process.env.REACT_APP_BASE_URL || "",
};

export const BASE_URL = Config.baseUrl;

export const API_ENDPOINTS = {
    submitReport: "/api/report",
    uploadBulkReports: "/reports/upload",
    downloadBulkSampleCsv: "/reports/upload/sample-csv",
    bulkJobStatus: (jobId: string) => `/api/reports/jobs/${jobId}`,
    dashboardSummary: "/dashboard",
};