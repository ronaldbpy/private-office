import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

export default async function Home() {
  const user = await currentUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-light">Private Office</h1>
      <p className="text-sm text-neutral-500">
        Hola, {user?.firstName ?? user?.emailAddresses[0]?.emailAddress ?? "usuario"}.
      </p>
      <UserButton afterSignOutUrl="/sign-in" />
    </main>
  );
}
