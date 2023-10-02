// 1. GCS file interactions
// 2. Local file interactions

import { Storage } from "@google-cloud/storage";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

const storage = new Storage();

const rawVideoBucketName = "ih-yt-clone-raw-videos"; // upload to this bucket
const processedVideoBucketName = "ih-yt-clone-processed-videos"; // upload processed video to this bucket

const localRawVideoPath = "./raw-videos"; // download raw videos from rawVideoBucketName to this directory
const localProcessedVideoPath = "./processed-videos" // upload processed videos from this directory to processedVideoBucketName then clean up

// create local directory for raw and processed videos

export function setupDirectories(){
  ensureDirectoryExists(localRawVideoPath);
  ensureDirectoryExists(localProcessedVideoPath);

}

/**
 * @param rawVideoName -- name of the raw video file to convert from {@link localRawVideoPath}.
 * @param processedVideoName -- the name of the processed video file to convert to {@link localProcessedVideoPath}.
 * @returns A promise that resolves when the video has been converted.
 */

export function convertVideo(rawVideoName:string,processedVideoName:string ){
   //convert video to 360p
   return new Promise<void>((resolve, reject) =>{
    ffmpeg(`${localRawVideoPath}/${rawVideoName}`).outputOptions("-vf", "scale=-1:360").on("end", () => {
      console.log("Video processing finished successfully");
      resolve();
    }).on("error", (err) => {
      console.log(`error while processing video: ${err.message}`);
      reject(err);
    }).save(`${localProcessedVideoPath}/${processedVideoName}`);
  });
}

/**
 * @param fileName - The name of the file to download from the {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder.
 * @return A promise that resolves when the file has been uploaded.
 */

export async function downloadRawVideo(fileName:string){
  await storage.bucket(rawVideoBucketName).file(fileName).download({destination: `${localRawVideoPath}/${fileName}`});
  console.log(`gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}`);
}


/**
 * 
 * @param fileName - The name of the file to upload from the {@link localProcessedVideoPath} folder into the {@link processedVideoBucketName} bucket.
 * @return A promise that resolves when the file has been uploaded.
 */

export async function uploadProcessedVideo(fileName:string){
  const bucket =  storage.bucket(processedVideoBucketName);
  await bucket.upload(`${localProcessedVideoPath}/${fileName}`,{
    destination: fileName
  })

  console.log(`${localProcessedVideoPath}/${fileName} uploaded to gs://${processedVideoBucketName}/${fileName}`);
  await bucket.file(fileName).makePublic();
}


/**
 * @param fileName - The name if the file to delete from the {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been deleted.
*/
export function deleteRawVideo(fileName:string){
  return deleteFile(`${localRawVideoPath}/${fileName}`);
}

/**
 * @param fileName - The name if the file to delete from the {@link localProcessedVideoPath} folder.
 * @returns A promise that resolves when the file has been deleted.
 */

export function deleteProcessedVideo(fileName:string){
  return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}

/**
 * @param filePath - The path of the file to delete.
 * @returns A promise that resolves when the file has been deleted.
 */

function deleteFile(filePath:string):Promise<void>{
  return new Promise((resolve,reject) => {
    if(fs.existsSync(filePath)){
      fs.unlink(filePath,(err)=>{
        if(err){
          console.log(`error while deleting file ${filePath}: ${err.message}`);
          reject(err);
        }else{
          console.log(`File ${filePath} deleted successfully`);
          resolve();
        }
      })
    }else{
      console.log(`File ${filePath} does not exist, skipping deletion`)
      resolve();
    }
  });
}

/**
 * Ensures that the {@link localRawVideoPath} and {@link localProcessedVideoPath} directories exist.
 * @param {string} path - The path of the directory to check.
 */

function ensureDirectoryExists(dirPath:string){
  if(!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath,{recursive: true});
    console.log(`Directory ${dirPath} created successfully`)
  }
}