This is a youtube clone which focuses mostly on backend fuctionality.

[architecture](https://github.com/Ibrahim-Hashem/youtube-backend-clone/assets/62023426/3613f00b-6f25-49b8-98d3-5be55315bd16)

[link to deployed site](https://yt-web-client-tg5uchrmtq-nw.a.run.app)

Limitations
1. Long Lived HTTP Requests
When processing videos, we face a challenge with long HTTP requests. While Pub/Sub allows a maximum acknowledgment deadline of 600 seconds, Cloud Run has a processing time limit of 3600 seconds. If video processing takes longer, Pub/Sub closes the connection, making it impossible to send an acknowledgment. This leaves messages stuck in the Pub/Sub queue.

Solution: Switch to Pull Subscription instead of Push Subscription. This gives us control over when to retrieve and process messages, allowing us to acknowledge them within the deadline and prevent message queuing issues.

2. Video Processing Failure
If video processing fails after pulling a message from Pub/Sub and updating its status in Firestore, the message becomes stuck in the queue. To address this, we need a mechanism to requeue messages if processing fails.

Solution: Consider resetting the message status to "undefined" in case of processing failures, enabling reprocessing.

3. File Upload Time Limit
Although the signed URL expires after 15 minutes, starting the upload within that timeframe ensures it continues even after the URL expires. There's no need to shorten the URL expiration time.

4. Video Streaming
Google Cloud Storage offers basic file streaming, but it's not optimized for video streaming like YouTube's DASH or HLS solutions, which serve videos efficiently in chunks. Consider exploring these options for improved streaming capabilities.

5. Content Delivery Network
Serving videos from a Content Delivery Network (CDN) located close to users can reduce latency and enhance the user experience. Consider implementing a CDN for better content delivery.

6. Illegal Videos
The app currently lacks a mechanism to check the legality of videos before serving them, posing potential legal risks. Deploying the app publicly may not be safe without addressing this issue.

Future Work
Here are some potential improvements for the app:


Add user profile pictures and emails to the Web Client.
Allow users to upload multiple videos without refreshing the page.
Enable users to upload video thumbnails.
Allow users to add titles and descriptions to their videos.
Display video uploaders.
Implement user subscriptions to other users' channels.
Implement cleanup of raw videos in Cloud Storage after processing.
Utilize a CDN for video serving.
Incorporate unit and integration testing.
Conclusion
Thank you for reading this far! Designing and architecting applications involve various trade-offs and considerations. Building apps like Twitter or YouTube takes time!
and careful planning.
