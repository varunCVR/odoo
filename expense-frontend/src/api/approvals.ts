import { API } from "./auth";

export const getPendingApprovals = () =>
  API.get("/approvals/pending", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

export const approveOrReject = (id: number, decision: "APPROVED" | "REJECTED", comments?: string) =>
  API.post(
    `/approvals/${id}/decision`,
    { decision, comments },
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
  );
