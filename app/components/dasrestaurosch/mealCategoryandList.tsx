// "use client";
// import React, { ChangeEvent, useState } from "react";
// import { supabase } from "@/lib/supabaseclient";

// function Page() {
//   const [file, setFile] = useState<File | null>(null);
//   const [url, setUrl] = useState("");

//   const handleChangeFile = async (e: ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0];
//     if (!selectedFile) return;

//     setFile(selectedFile);

//     // Upload path
//     const filePath = `MenuCategory/${Date.now()}_${selectedFile.name}`;

//     // Upload file
//     const { data, error } = await supabase.storage
//       .from("MenuCategory")
//       .upload(filePath, selectedFile);

//     if (error) {
//       console.error("Upload Error:", error);
//       return;
//     }

//     // Get public URL
//     const {
//       data: { publicUrl },
//     } = supabase.storage.from("MenuCategory").getPublicUrl(filePath);

//     setUrl(publicUrl);
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleChangeFile} />
//       <p>{url}</p>
      
//     </div>
//   );
// }

// export default Page;
