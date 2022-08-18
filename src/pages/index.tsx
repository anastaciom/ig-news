import React from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "./home.module.scss";
import SubscribeButton from "../components/SubscribeButton/index";
import { GetStaticProps } from "next";
import { stripe } from "../services/stripe";

interface HomeProps {
  product: { priceId: string; amount: number };
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | IG.News</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👋 Hey, welcome</span>
          <h1>
            News about the <span>React</span> world
          </h1>
          <p>
            Get access to all the publications
            <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <Image
          src={"/images/avatar.svg"}
          alt={"avatar icon"}
          width="336"
          height="521"
        />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1LUHp3KZf0vziyzlIC3Gp5Z1");
  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-us", {
      currency: "USD",
      style: "currency",
    }).format(price.unit_amount / 100),
  };
  return {
    props: { product: product },
    revalidate: 60 * 60 * 24, //24 hours
  };
};
