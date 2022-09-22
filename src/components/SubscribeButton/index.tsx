import { signIn, useSession } from "next-auth/react";
import { api } from "../../services/api";
import { useRouter } from "next/router";
import { getStripeJs } from "../../services/stripeClient";
import styles from "./styles.module.scss";
import { useEffect } from "react";

interface SubscribeButtonProps {
  priceId: string;
}

export default function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();

  async function handleSubscribe() {
    if (!session) {
      signIn("github");
      return;
    }

    if (session?.activeSubscription) {
      router.push("/posts");
      return;
    }

    try {
      const { data } = await api.post("/subscribe", { user: session.user });

      const stripe = await getStripeJs();
      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeBtn}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
