"use client";
import { GetAllActiveSessions, GetPerSessionOrders } from '@/app/hooks/access';
import React, { useEffect, useState } from 'react';
import { OrderType, SessionType} from '@/app/store/useAuth';
import { toast } from 'sonner';

function MonitorOrders() {
    




const [sessiond, setSessiond] = useState<SessionType[]>([])
const [orders, setOrders] = useState<OrderType[]>([])
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await GetAllActiveSessions();
                if (response?.status === "SUCCESS") {
                    setSessiond(response.sessions);
                } else {
                    toast.error("An error occurred. Please check your connection");
                }
            } catch (e: unknown) {
                console.error(e);
            }
        };

       
        fetchSessions();

       
        const interval = setInterval(() => {
           
            fetchSessions();
        }, 1 * 60 * 1000); 

        
        return () => clearInterval(interval);
    }, [setSessiond]);


const handleDisplay = async (id: string) => {
  try {
    const res = await GetPerSessionOrders({ session_id: id });

    if (res?.status === "SUCCESS") {
      setOrders(res.orders);     
      console.log("res",res);
                             
      toast.success("Order Session retrieved!");
    } else {
      toast.error("Check your connection!");
    }
  } catch (e) {
    console.log(e);
  }
};
 return (
  <div className="flex gap-4">
    {/* LEFT SECTION — sessions */}
    <div className="w-1/2">
      <h6>Select the Session to Monitor</h6>

      {sessiond.length === 0 ? (
        <p>No active sessions</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4">
          {sessiond.map((session) => (
            <li
              key={session.session_id}
              className={`border border-black p-3 rounded cursor-pointer ${
                Number(session.session_id) % 2 === 0
                  ? "bg-red-600"
                  : "bg-blue-500"
              }`}
              onClick={() => handleDisplay(session.session_id)}
            >
              <strong>Table:</strong> {session.table_name} ({session.table_number}) <br />
              <strong>Guests:</strong> {session.guest_count} <br />
              <strong>Session ID:</strong> {session.session_id} <br />
              <strong>Status:</strong> {session.status} <br />
            </li>
          ))}
        </ul>
      )}
    </div>

    {/* RIGHT SECTION — orders */}
    <div className="w-1/2 border-l pl-4">
      <h6>Orders for Selected Session</h6>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {orders.map((item) => (
            <li
              key={item.id}
              className="border p-3 rounded bg-gray-100"
            >
              <strong>{item.item_description}</strong> <br />
              Qty: {item.quantity} × KES {item.unit_price} <br />
              Status: <span className="uppercase">{item.status}</span> <br />
              Total: KES {item.line_total}
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

}

export default MonitorOrders;
