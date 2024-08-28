// import DataUriParser from "datauri/parser.js"
// import path from "path"
// const getDataUri = (file) =>{
//     const parser = new DataUriParser();
//     const extName = path.extname(file.originalName).toString()
//     return parser.format(extName, file.buffer)
// }

// export default getDataUri
import DataUriParser from "datauri/parser.js";
import path from "path";

const getDataUri = (file) => {
  const parser = new DataUriParser();
  const extName = path.extname(file.originalname).toString(); // Note the change here
  return parser.format(extName, file.buffer);
};

export default getDataUri;
