import cloudinary from "cloudinary";

// cloudinary config

cloudinary.v2.config({
  cloud_name: "dxnmvx4ka",
  api_key: "138597759618987",
  api_secret: "rzUEanvyKVzFlUCStEtNQycgs9k",
});

//file upload to cloud

export const fileUploadToCloud = async (path) => {
  const fileData = await cloudinary.v2.uploader.upload(path);
  return fileData;
};
//file delete from cloud

export const fileDeleteFromCloud = async (publicId) => {
  await cloudinary.v2.uploader.destroy(publicId);
};


// download the file from cloudinary

export const handleDownload = async () => {
  try {
    const response = await fetch(
      `https://res.cloudinary.com/dxnmvx4ka/image/upload/v1707536499/q2kjys6j9yj7zsyh50dr.jpg`
    );
    const blob = await response.blob();

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "q2kjys6j9yj7zsyh50dr.jpg";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading image:", error);
  }
};

    // <a
    //     href="http://res.cloudinary.com/dxnmvx4ka/image/upload/v1707534651/tigxvix4lakcsyfynbca.pdf"
    //     target="_blank"
    //     rel="noopener noreferrer"
    //   >
    //     Download PDF
    //   </a>
    //   <br />

    //   <a href="" onClick={handleDownload}>
    //     Download Image
    //   </a>