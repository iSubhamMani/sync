"use client";

import { removeUser, setUser } from "@/lib/features/user/userSlice";
import { useAppDispatch } from "@/lib/hooks";
import { auth } from "@/services/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatcher = useAppDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatcher(
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          })
        );
        router.replace("/chats");
      } else {
        dispatcher(removeUser());
        router.replace("/login");
      }
    });
  }, [router, dispatcher]);

  return <>{children}</>;
}
