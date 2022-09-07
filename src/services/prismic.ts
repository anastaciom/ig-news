import * as Prismic from "@prismicio/client";

export const getPrismicClient = (req?: unknown) => {
  const prismic = Prismic.client(process.env.NEXT_PUBLIC_PRISMIC_API_ENDPOINT, {
    req,
    accessToken: process.env.PRISMIC_TOKEN,
  });

  return prismic;
};
