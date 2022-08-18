import { signIn, useSession } from "next-auth/react";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripeClient";
import styles from "./styles.module.scss";

interface SubscribeButtonProps {
  priceId: string;
}

export default function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { data: session } = useSession();

  async function handleSubscribe() {
    if (!session) {
      signIn("github");
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
