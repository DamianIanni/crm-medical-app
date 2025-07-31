// "use server";
// import { Center } from "@/types/center";
// import { getUserFromCookies } from "@/lib/api/auth/getUserFromCookies";
// import { readCenters, writeCenters } from "@/lib/data/store";

// const WAIT = 200;
// function wait(ms: number) {
//   return new Promise((res) => setTimeout(res, ms));
// }

// export async function getCenters(): Promise<Center[]> {
//   await wait(WAIT);
//   const user = await getUserFromCookies();
//   if (!user) throw new Error("Unauthorized");
//   return await readCenters();
// }

// export async function createCenter(
//   newCenter: Omit<Center, "id">
// ): Promise<Center> {
//   await wait(WAIT);
//   const user = await getUserFromCookies();
//   if (!user || user.role !== "admin") throw new Error("Unauthorized");

//   const centers = await readCenters();
//   const id = Date.now();
//   const created: Center = { ...newCenter, id };
//   centers.push(created);
//   await writeCenters(centers);
//   return created;
// }

// export async function updateCenter(
//   id: number,
//   updated: Partial<Center>
// ): Promise<Center> {
//   await wait(WAIT);
//   const user = await getUserFromCookies();
//   if (!user || user.role !== "admin") throw new Error("Unauthorized");

//   const centers = await readCenters();
//   const index = centers.findIndex((c) => c.id === id);
//   if (index === -1) throw new Error("Center not found");
//   centers[index] = { ...centers[index], ...updated };
//   await writeCenters(centers);
//   return centers[index];
// }

// export async function deleteCenter(id: number): Promise<Center> {
//   await wait(WAIT);
//   const user = await getUserFromCookies();
//   if (!user || user.role !== "admin") throw new Error("Unauthorized");

//   const centers = await readCenters();
//   const index = centers.findIndex((c) => c.id === id);
//   if (index === -1) throw new Error("Center not found");
//   const removed = centers[index];
//   centers.splice(index, 1);
//   await writeCenters(centers);
//   return removed;
// }
