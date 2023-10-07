import express from "express";
import {convertVideo, deleteProcessedVideo, deleteRawVideo, downloadRawVideo, setupDirectories, uploadProcessedVideo} from "./storage"
import { isVideoNew, setVideo } from "./firestore";

setupDirectories();

const app = express();
app.use(express.json());

app.post("/process-video", async (req, res) => {
  // get bucket and filename from pubsub message
  let data 
  try{
    const message = Buffer.from(req.body.message.data, "base64").toString();
    data = JSON.parse(message);
    if(!data.bucket || !data.name){
      throw new Error("Invalid payload recieved!");
    }
  }catch(err){
    console.error(err);
    return res.status(400).send("Bad Request");
  }
  const inputFileName = data.name;
  const outputFileName = `processed-${inputFileName}`;
  const videoId = inputFileName.split(".")[0];

  if(!isVideoNew(videoId)){
    return res.status(400).send("Video has already been processed or is being processed!");
  }else{
    await setVideo(videoId, {
      id: videoId,
      uid:videoId.split("-")[0],
      status: "processing"
    });
  }

  // download raw video from bucket
  await downloadRawVideo(inputFileName);

  // convert video to 360p
  try{
    await convertVideo(inputFileName, outputFileName)
  }catch(err){
    await Promise.all([deleteRawVideo(inputFileName), deleteProcessedVideo(outputFileName)]);
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }

  // upload processed video to bucket
  await uploadProcessedVideo(outputFileName);

  // update firestore with processed video status
  await setVideo(videoId, {
    status: "processed",
    filename: outputFileName,
  });

  await Promise.all([deleteRawVideo(inputFileName), deleteProcessedVideo(outputFileName)]);
  return res.status(200).send('Processing complete!');

});
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
});