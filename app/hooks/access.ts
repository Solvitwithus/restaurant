import axios from "axios";

type Login = {
  username: string;
  password: string;
};



export async function useLogin(
  username: string,
  password: string
): Promise<any> {
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


export async function useRestrauntTables(){
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
