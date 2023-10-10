import Image from "next/image";
import Link from "next/link";
import { getVideos } from "@/lib/firebase/functions";

export default async function Home() {
  const videos = await getVideos();

  return (
    <main>
      <div className="flex flex-wrap ">
        {videos.map((video) => (
          <Link href={`/watch?v=${video.filename}`} key={video.id}>
            <Image
              src={"/thumbnail.png"}
              alt="video"
              width={120}
              height={80}
              className="m-10"
            />
          </Link>
        ))}
      </div>
    </main>
  );
}

export const revalidate = 30;
