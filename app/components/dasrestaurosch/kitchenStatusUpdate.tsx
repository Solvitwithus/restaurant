"use client";

import { GetAllActiveSessions, GetPerSessionOrders } from "@/app/hooks/access";
import React, { useEffect, useState, useCallback } from "react";
import { SessionType, OrderType } from "@/app/store/useAuth";
import { toast } from "sonner";

function KitchenStatus() {
  const [sessions, setSessions] = useState<SessionType[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<SessionType[]>([]);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [sortBy, setSortBy] = useState<"asc" | "desc">("desc"); // default newest first

  // Fetch all active sessions + auto-refresh every 60 seconds
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await GetAllActiveSessions();
        if (res?.status === "SUCCESS") {
          setSessions(res.sessions || []);
        } else {
          toast.error("Failed to fetch sessions.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error fetching sessions.");
      }
    };

    fetchSessions();
    const interval = setInterval(fetchSessions, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter, search, and sort sessions
  useEffect(() => {
    let filtered = [...sessions];

    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.table_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.table_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (startDate) {
      filtered = filtered.filter((s) => s.session_date >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter((s) => s.session_date <= endDate);
    }

    filtered.sort((a, b) =>
      sortBy === "asc"
        ? a.session_date.localeCompare(b.session_date)
        : b.session_date.localeCompare(a.session_date)
    );

    setFilteredSessions(filtered);
  }, [sessions, searchTerm, startDate, endDate, sortBy]);

  // Fetch orders when a session is selected
  const handleSessionClick = useCallback(async (sessionId: string) => {
    if (selectedSessionId === sessionId) {
      // If already selected, maybe deselect? Or just reload
      // setSelectedSessionId(null);
      // setOrders([]);
      // return;
    }

    setSelectedSessionId(sessionId);
      setLoadingOrders(true);
      setOrders([]); // clear previous

      try {
        const res = await GetPerSessionOrders({ session_id: sessionId });
        if (res?.status === "SUCCESS") {
          setOrders(res.orders || []);
          toast.success(`Orders loaded for Table ${sessionId}`);
        } else {
          toast.error("No orders found or failed to load.");
          setOrders([]);
        }
      } catch (err) {
        console.error(err);
        toast.error("Error loading orders.");
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
  }, [selectedSessionId]);

  // Optional: Auto-refresh orders for the currently selected session
  useEffect(() => {
    if (!selectedSessionId) return;

    const refreshOrders = async () => {
      try {
        const res = await GetPerSessionOrders({ session_id: selectedSessionId });
        if (res?.status === "SUCCESS") {
          setOrders(res.orders || []);
        }
      } catch (err) {
        // silent fail during auto-refresh
      }
    };

    const interval = setInterval(refreshOrders, 30 * 1000); // every 30s
    return () => clearInterval(interval);
  }, [selectedSessionId]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 max-w-7xl mx-auto">
      {/* Left Panel - Sessions */}
      <div className="w-full lg:w-1/2">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Active Sessions</h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            placeholder="Search table name/number..."
            className="border border-gray-300 rounded-lg px-4 py-2 flex-1 min-w-[200px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
            type="date"
            className="border border-gray-300 rounded-lg px-4 py-2"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="border border-gray-300 rounded-lg px-4 py-2"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <select
            className="border border-gray-300 rounded-lg px-4 py-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "asc" | "desc")}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        {/* Session Cards */}
        {filteredSessions.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No active sessions found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredSessions.map((s) => (
              <div
                key={s.session_id}
                onClick={() => handleSessionClick(s.session_id)}
                className={`p-5 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-105 ${
                  selectedSessionId === s.session_id
                    ? "border-blue-500 bg-blue-50 shadow-lg"
                    : "border-gray-200 bg-white hover:border-gray-400"
                }`}
              >
                <h3 className="font-bold text-lg">
                  {s.table_name} ({s.table_number})
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Guests: <span className="font-medium">{s.guest_count}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Status: <span className={`font-medium ${s.status === 'active' ? 'text-green-600' : 'text-orange-600'}`}>{s.status}</span>
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Started: {new Date(s.start_time).toLocaleTimeString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">ID: {s.session_id}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Panel - Orders */}
      <div className="w-full lg:w-1/2">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Orders {selectedSessionId && `(Table ${filteredSessions.find(s => s.session_id === selectedSessionId)?.table_number || ''})`}
        </h2>

        {loadingOrders ? (
          <p className="text-center py-10 text-gray-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <p className="text-gray-500 text-lg">
              {selectedSessionId
                ? "No orders yet for this table."
                : "Select a session to view orders"}
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-screen overflow-y-auto pr-2">
            {orders.map((o) => (
              <div
                key={o.id}
                className={`p-5 rounded-xl border-l-8 shadow-md transition-colors ${
                  o.status === "pending"
                    ? "bg-yellow-50 border-yellow-400"
                    : o.status === "preparing"
                    ? "bg-orange-50 border-orange-400"
                    : o.status === "ready"
                    ? "bg-green-50 border-green-500"
                    : "bg-gray-50 border-gray-300"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">{o.item_description}</h4>
                    <p className="text-sm text-gray-600">
                      Qty: <strong>{o.quantity}</strong> × KES {o.unit_price.toLocaleString()}
                    </p>
                    <p className="text-sm font-medium uppercase mt-2 text-gray-700">
                      Status: {o.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-700">
                      KES {o.line_total.toLocaleString()}
                    </p>
                  </div>
                </div>
                {o.notes && (
                  <p className="text-sm text-gray-600 mt-3 italic">Note: {o.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default KitchenStatus;