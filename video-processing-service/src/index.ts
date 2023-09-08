import express from "express";
import ffmpeg from "fluent-ffmpeg"

const app = express();
app.use(express.json());

app.post("/process-video", (req, res) => {
  // get path of the input video file from request body
  const inputFilePath = req.body.inputFilePath;
  const outputFilePath = req.body.outputFilePath;
  
  if (!inputFilePath || !outputFilePath) {
    res.status(400).send("missing input or output file path");
  }
  
  //convert video to 360p
  ffmpeg(inputFilePath).outputOptions("-vf", "scale=-1:360").on("end", () => {
    res.status(200).send("Video processing finished successfully");

  }).on("error", (err) => {
    console.log(`error while processing video: ${err.message}`);
    
    res.status(500).send(`error while processing video, ${err.message}`);

  }).save(outputFilePath);
  
});
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
});  