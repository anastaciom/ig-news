import React from "react";
import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import styles from "./styles.module.scss";
import { signIn, signOut, useSession } from "next-auth/react";
import BoxAvatarImage from "./BoxAvatarImage";
export default function SignInButton() {
  const { data: session } = useSession();

  function getFirstName() {
    const fullName = session.user?.name;
    return fullName.split(" ")[0];
  }
  return (
    <button
      type="button"
      className={styles.signInButton}
      onClick={() => {
        !session ? signIn("github") : signOut();
      }}
    >
      {!session ? (
        <FaGithub color="#eba417" />
      ) : (
        <BoxAvatarImage imageLink={session.user.image} />
      )}

      {session ? getFirstName() : "Sign in with Github"}
      {session && <FiX color="#737380" className={styles.signOutIcon} />}
    </button>
  );
}
