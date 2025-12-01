

/**
 * @author John Kamiru Mwangi
 * @
 */
import axios from "axios";





export async function Login(
  username: string,
  password: string
): Promise<unknown> {
  try {
    const formData = new FormData();
    formData.append("tp", "pos_login");
    formData.append("cp", "0_");
    formData.append("username", username);
    formData.append("password", password);

    const response = await axios.postForm(
      process.env.NEXT_PUBLIC_BASEURL as string,
      formData
    );

    return response.data;
  } catch (error) {
    console.error("Login Error:", error);
    return null;
  }
}


export async function RestrauntTables(){
  try{
  const formData = new FormData();
  formData.append("tp","get_tables");
  formData.append("cp", "0_");

    const response = await axios.postForm(
      process.env.NEXT_PUBLIC_BASEURL as string,
      formData
    );

    return response.data;
  }
  catch (error) {
    console.error("Login Error:", error);
    return null;
  }
}



export async function SessionCreation(
  table_id: string,
  guest_count: number | string,
  session_type?: string,
  notes?: string
) {
  try {
    const formData = new FormData();
    formData.append("tp", "create_session");
    formData.append("cp", "0_");
    formData.append("table_id", table_id);
    formData.append("guest_count", guest_count.toString());

    if (session_type) formData.append("session_type", session_type);
    if (notes) formData.append("notes", notes);

    const response = await axios.postForm(
      process.env.NEXT_PUBLIC_BASEURL as string,
      formData
    );

    console.log("Session creation response:", response.data); // ✅ debug
    return response.data; 
  } catch (error: unknown) {
  if (axios.isAxiosError(error)) {
    console.error("useSessionCreation error:", error.response || error);

    return { 
      status: "ERROR", 
      message: error.response?.data?.message || error.message || "Request failed" 
    };
  }

  // Non-Axios error
  console.error("useSessionCreation error:", error);

  return { 
    status: "ERROR", 
    message: error instanceof Error ? error.message : "Request failed" 
  };
}

}


export async function getMenu(){
    try{
  const formData = new FormData();
  formData.append("tp","get_menu");
  formData.append("cp", "0_");

    const response = await axios.postForm(
      process.env.NEXT_PUBLIC_BASEURL as string,
      formData
    );

    return response.data;
  }
  catch (error) {
    console.error("Login Error:", error);
    return null;
  }
}


export async function CreateOrderItem({
  session_id,
  item_code,
  quantity,
  client_name,
  notes,
}: {
  session_id: string;
  item_code: string;
  quantity: number;
  client_name?: string;
  notes?: string;
}) {
  console.log("Hi i am touched");

  try {
    const formData = new FormData();
    formData.append("tp", "create_order"); // REQUIRED
    formData.append("session_id", session_id);
    formData.append("item_code", item_code);
    formData.append("quantity", quantity.toString());
    formData.append("client_name", client_name || "");
    formData.append("notes", notes || "");
    formData.append("cp", "0_"); // REQUIRED by backend

    console.log("FORMDATA OUT:", [...formData.entries()]); // test

    const response = await axios.postForm(
      process.env.NEXT_PUBLIC_BASEURL as string,
      formData
    );

    console.log("API RESPONSE:", response.data);

    return response.data;
  } catch (error) {
    console.error("CreateOrderItem Error:", error);
    return null;
  }
}



export async function GetAllActiveSessions()
{
   try{
  const formData = new FormData();
  formData.append("tp","get_sessions");
  formData.append("cp", "0_");

    const response = await axios.postForm(
      process.env.NEXT_PUBLIC_BASEURL as string,
      formData
    );

    return response.data;
  }
  catch (error) {
    console.error("Login Error:", error);
    return null;
  }
}


export async function GetPerSessionOrders(
  {
    session_id
  }:{
   session_id:string; 
  }
){
 try{
  const formData = new FormData();
  formData.append("tp","get_session_orders");
  formData.append("cp", "0_");
  formData.append("session_id", session_id);

    const response = await axios.postForm(
      process.env.NEXT_PUBLIC_BASEURL as string,
      formData
    );

    return response.data;
  }
  catch (error) {
    console.error("Login Error:", error);
    return null;
  }
}