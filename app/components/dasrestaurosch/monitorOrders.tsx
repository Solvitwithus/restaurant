"use client";
import { GetAllActiveSessions, GetPerSessionOrders } from "@/app/hooks/access";
import React, { useEffect, useState, useMemo } from "react";
import { OrderType, SessionType } from "@/app/store/useAuth";
import { toast } from "sonner";

function MonitorOrders() {
  const [sessiond, setSessiond] = useState<SessionType[]>([]);
  const [orders, setOrders] = useState<OrderType[]>([]);

  // Search + Sorting + Date filter states (FOR SESSIONS ONLY)
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await GetAllActiveSessions();
        if (response?.status === "SUCCESS") {
          setSessiond(response.sessions);
        } else {
          toast.error("An error occurred. Please check your connection");
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchSessions();
    const interval = setInterval(fetchSessions, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDisplay = async (id: string) => {
    try {
      const res = await GetPerSessionOrders({ session_id: id });
      if (res?.status === "SUCCESS") {
        setOrders(res.orders);
        toast.success("Orders loaded!");
      } else {
        toast.error("Check your connection");
      }
    } catch (e) {
      console.log(e);
    }
  };

  // ============================
  //  FILTER + SORT LOGIC (SESSIONS)
  // ============================
  const filteredSessions = useMemo(() => {
    let result = [...sessiond];

    // 🔍 SEARCH
    if (search.trim() !== "") {
      result = result.filter((s) =>
        s.table_name.toLowerCase().includes(search.toLowerCase()) ||
        s.table_number.toString().includes(search) ||
        s.session_id.toString().includes(search)
      );
    }

    // 📅 DATE RANGE
    if (startDate) {
      result = result.filter(
        (s) =>
          new Date(s.start_time || s.created_at || "") >= new Date(startDate)
      );
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59);
      result = result.filter(
        (s) =>
          new Date(s.start_time || s.created_at || "") <= end
      );
    }

    // ↕ SORT
    result.sort((a, b) => {
      const da = new Date(a.start_time || a.created_at || "").getTime();
      const db = new Date(b.start_time || b.created_at || "").getTime();

      return sortOrder === "newest" ? db - da : da - db;
    });

    return result;
  }, [sessiond, search, sortOrder, startDate, endDate]);

  return (
    <div className="flex gap-6 px-4 py-6">

      {/* LEFT SIDE — FILTERS + SESSIONS LIST */}
      <div className="w-1/2">
        <h3 className="text-lg font-bold mb-2">Active Sessions</h3>

        {/* FILTERS UI */}
        <div className="space-y-3 mb-4 bg-white p-3 shadow rounded border">

          {/* Search */}
          <input
            type="text"
            placeholder="Search session, table name, number..."
            className="border w-full p-2 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Sorting */}
          <select
            className="border w-full p-2 rounded"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>

          {/* Date Range */}
          <div className="flex gap-3">
            <input
              type="date"
              className="border p-2 rounded w-1/2"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="border p-2 rounded w-1/2"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

        </div>

        {/* SESSION CARDS */}
        {filteredSessions.length === 0 ? (
          <p>No active sessions found</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredSessions.map((session) => (
              <div
                key={session.session_id}
                className="rounded-xl p-4 shadow cursor-pointer border bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition"
                onClick={() => handleDisplay(session.session_id)}
              >
                <h4 className="font-semibold text-lg text-green-800">
                  {session.table_name} ({session.table_number})
                </h4>

                <p className="text-sm text-gray-700">
                  Guests: <strong>{session.guest_count}</strong>
                </p>

                <p className="text-sm text-gray-700">
                  Session ID: <strong>{session.session_id}</strong>
                </p>

                <p
                  className={`mt-1 text-xs font-semibold px-2 py-1 rounded inline-block ${
                    session.status === "active"
                      ? "bg-green-600 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {session.status.toUpperCase()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT SIDE — ORDERS */}
      <div className="w-1/2">
        <h3 className="text-lg font-bold mb-2">Orders</h3>

        {orders.length === 0 ? (
          <p className="text-gray-500">Select a session to view orders</p>
        ) : (
          <div className="space-y-4">
            {orders.map((item) => (
              <div
                key={item.id}
                className="border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition"
              >
                <h4 className="font-semibold text-gray-900">
                  {item.item_description}
                </h4>

                <p className="text-sm text-gray-600">
                  Qty: {item.quantity} × KES {item.unit_price}
                </p>

                <p className="text-sm">
                  <strong>Status:</strong>{" "}
                  <span className="uppercase font-bold text-orange-600">
                    {item.status}
                  </span>
                </p>

                <p className="text-sm font-semibold">
                  Total: KES {item.line_total}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default MonitorOrders;
