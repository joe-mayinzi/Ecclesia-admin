"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Loading() {
  const pathnameHook = usePathname();
  const [isBiblePage, setIsBiblePage] = useState<boolean>(false);
  // const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // setProgress((oldProgress) => {
      //   if (oldProgress === 100) {
      //     clearInterval(interval);
      //     return 100;
      //   }
      //   const diff = Math.random() * 10;
      //   return Math.min(oldProgress + diff, 100);
      // });
    }, 300);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    setIsBiblePage(pathnameHook === "/bible");
  }, [pathnameHook]);

  if (isBiblePage)
    return (
      <div className="w-full max-w-md mx-auto mt-10 text-center">
        {/* <NextImage
          className="object-cover w-full"
          style={{
            height: 550,
            width: 650,
          }}
          width={1000}
          height={550}
          src="/bible.png"
          alt="Photo de la bible"
        /> */}
        {/* <h2 className="text-xl font-semibold mb-2">
          Chargement de la bible...
        </h2>
        <Progress value={progress} color="primary" />
        <div className="text-center mt-2">{progress.toFixed(0)}%</div> */}
      </div>
      // <div className="flex">
      //   <div className="w-3/10 p-4" style={{ width: "30%" }}>
      //     <div className="max-w-[300px] w-full flex items-center gap-3">
      //       <div>
      //         <Skeleton className="flex rounded-full w-12 h-12" />
      //       </div>
      //       <div className="w-full flex flex-col gap-2">
      //         <Skeleton className="h-3 w-3/5 rounded-lg" />
      //         <Skeleton className="h-3 w-4/5 rounded-lg" />
      //       </div>
      //     </div>
      //   </div>
      //   <div className="w-3/10 p-4" style={{ width: "70%" }}>
      //     <Card className="w-[200px] space-y-5 p-4" radius="lg">
      //       <Skeleton className="rounded-lg">
      //         <div className="h-24 rounded-lg bg-secondary"></div>
      //       </Skeleton>
      //       <div className="space-y-3">
      //         <Skeleton className="w-3/5 rounded-lg">
      //           <div className="h-3 w-full rounded-lg bg-secondary"></div>
      //         </Skeleton>
      //         <Skeleton className="w-4/5 rounded-lg">
      //           <div className="h-3 w-full rounded-lg bg-secondary-300"></div>
      //         </Skeleton>
      //         <Skeleton className="w-2/5 rounded-lg">
      //           <div className="h-3 w-full rounded-lg bg-secondary-200"></div>
      //         </Skeleton>
      //       </div>
      //     </Card>
      //   </div>
      // </div>
    );

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 xs:grid-cols-2 gap-4 mt-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} />
      ))}
    </section>
  );
}
