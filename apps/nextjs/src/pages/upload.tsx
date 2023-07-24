import React, { useState } from "react";

import { api } from "~/utils/api";

const Upload = () => {
  const [files, setFiles] = useState<File | undefined>();
  const { mutateAsync: getPrsignedUrl } =
    api.upload.getPrsignedUrl.useMutation();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files![0]);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { url, type } = await getPrsignedUrl({
      name: "DUmmy" ?? "",
      type: "IMAGE",
    });

    const formData = new FormData(e.target);
    console.log(formData);

    const file = formData.get("file");

    if (!file) {
      return null;
    }

    // await fetch(url, {
    //   method: "PUT",
    //   body: file,
    // });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" />
      <button type="submit" onChange={onFileChange}>
        Submit
      </button>
    </form>
  );
};

export default Upload;
