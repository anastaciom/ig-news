import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../services/faunaDB";
import { stripe } from "../../services/stripe";
import { query as q } from "faunadb";

type UserFauna = {
  ref: { id: string };
  data: { stripe_customer_id: string };
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { email } = await req.body.user;
    //I get the user's information by REQUEST, as "next-auth" saves the information in cookies. Information saved in "Cookies" I can get in the "backend"
    const user = await fauna.query<UserFauna>(
      q.Get(q.Match(q.Index("user_by_email"), q.Casefold(email)))
    );

    let customerId = user.data.stripe_customer_id;

    if (!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email,
      });
      await fauna.query(
        q.Update(q.Ref(q.Collection("users"), user.ref.id), {
          data: { stripe_customer_id: stripeCustomer.id },
        })
      );

      customerId = stripeCustomer.id;
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [{ price: "price_1LUHp3KZf0vziyzlIC3Gp5Z1", quantity: 1 }],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: "http://localhost:3000/posts",
      cancel_url: "http://localhost:3000/",
    });

    res.status(200).json({ sessionId: stripeCheckoutSession.id });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
};
