import { useState, useEffect } from "react";
import { getInstitutes, approveInsititute, revokeInstitute } from "../api/api";

const InstituteList = () => {
  const [institutes, setInstitutes] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  const fetchInstitutes = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getInstitutes(statusFilter);
      setInstitutes(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch institutes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutes();
  }, [statusFilter]);

  const handleApprove = async (id, wallet) => {
    setActionLoading(id);
    try {
      await approveInsititute(id, wallet);
      await fetchInstitutes();
    } catch (err) {
      alert("Failed to approve: " + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevoke = async (id, wallet) => {
    setActionLoading(id);
    try {
      await revokeInstitute(id, wallet);
      await fetchInstitutes();
    } catch (err) {
      alert("Failed to revoke: " + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-5 bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-md p-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h3 className="text-2xl font-bold text-gray-800 tracking-tight">
          Institutes Management
        </h3>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto bg-white border border-gray-300 text-gray-700 text-sm rounded-xl shadow-sm px-3 py-2 focus:ring-2 focus:ring-indigo-400 transition"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center text-gray-500 py-10 animate-pulse">
          <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full mx-auto mb-4 animate-spin"></div>
          <p>Loading institutes...</p>
        </div>
      )}

      {error && <p className="text-center text-red-500 font-medium py-3">{error}</p>}

      {/* ===============================================================
          WEB TABLE  (hidden on mobile)
      ============================================================== */}
      {!loading && !error && (
        <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
          <table className="min-w-full text-sm text-left">
            <thead className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow">
              <tr>
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Code</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {institutes.length > 0 ? (
                institutes.map((inst) => (
                  <tr key={inst._id} className="hover:bg-indigo-50/70 transition">
                    <td className="px-5 py-3 font-medium">{inst.name}</td>
                    <td className="px-5 py-3">{inst.instituteCode}</td>
                    <td className="px-5 py-3">{inst.email}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          inst.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {inst.status || "pending"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3 text-center">
                      {inst.status !== "approved" ? (
                        <button
                          onClick={() => handleApprove(inst._id, inst.walletAddress)}
                          disabled={actionLoading === inst._id}
                          className={`px-4 py-2 rounded-xl text-white text-sm shadow ${
                            actionLoading === inst._id
                              ? "bg-green-400 cursor-not-allowed"
                              : "bg-green-500 hover:bg-green-600"
                          }`}
                        >
                          {actionLoading === inst._id ? "Approving..." : "Approve"}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRevoke(inst._id, inst.walletAddress)}
                          disabled={actionLoading === inst._id}
                          className={`px-4 py-2 rounded-xl text-white text-sm shadow ${
                            actionLoading === inst._id
                              ? "bg-red-400 cursor-not-allowed"
                              : "bg-red-500 hover:bg-red-600"
                          }`}
                        >
                          {actionLoading === inst._id ? "Revoking..." : "Revoke"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    No institutes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ===============================================================
          MOBILE CARDS  (visible only on mobile)
      ============================================================== */}
      {!loading && !error && (
        <div className="sm:hidden space-y-4 mt-4">
          {institutes.length > 0 ? (
            institutes.map((inst) => (
              <div
                key={inst._id}
                className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-semibold">{inst.name}</h4>
                  <span
                    className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      inst.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {inst.status || "pending"}
                  </span>
                </div>

                <p className="text-sm text-gray-600">
                  <span className="font-medium">Code:</span> {inst.instituteCode}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Email:</span> {inst.email}
                </p>

                <div className="mt-4">
                  {inst.status !== "approved" ? (
                    <button
                      onClick={() => handleApprove(inst._id, inst.walletAddress)}
                      disabled={actionLoading === inst._id}
                      className={`w-full px-4 py-2 rounded-lg text-white font-medium shadow ${
                        actionLoading === inst._id
                          ? "bg-green-400"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {actionLoading === inst._id ? "Approving..." : "Approve"}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRevoke(inst._id, inst.walletAddress)}
                      disabled={actionLoading === inst._id}
                      className={`w-full px-4 py-2 rounded-lg text-white font-medium shadow ${
                        actionLoading === inst._id
                          ? "bg-red-400"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {actionLoading === inst._id ? "Revoking..." : "Revoke"}
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">
              No institutes found.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default InstituteList;
