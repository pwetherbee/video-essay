import { revalidatePath } from "next/cache";

export async function revalidateChatLayout(key: string) {
  console.log("revalidating chat layout", key);
  revalidatePath(`/${key}/c/[id]`, "layout");
}
