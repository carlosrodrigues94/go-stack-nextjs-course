import { GetServerSideProps } from "next";
import { useState } from "react";
import { Title } from "@/styles/pages/home";
import SEO from "@/components/SEO";
import { client } from "@/lib/prismic";
import Prismic from "prismic-javascript";
import Link from "next/link";
import { Document } from "prismic-javascript/types/documents";
import PrismicDOM from "prismic-dom";

interface IProduct {
  id: string;
  title: string;
}

interface HomeProps {
  products: Document[];
}

export default function Home({ products }: HomeProps) {
  const [sumValue, setSumValue] = useState(0);

  async function handleSum() {
    const { default: math } = await import("../lib/math");

    const result = math.sum(3, 5);

    setSumValue(result);
  }

  return (
    <>
      <SEO
        title="DevCommerce, your best place to buy"
        shouldExcludeTitleSuffix
      />
      <section>
        <Title>Products</Title>

        <h4>{sumValue}</h4>

        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <Link href={`/catalog/products/${product.uid}`}>
                <a>{PrismicDOM.RichText.asText(product.data.title)}</a>
              </Link>
            </li>
          ))}
        </ul>

        <button type="button" onClick={() => handleSum()}>
          Sum
        </button>
      </section>
    </>
  );
}

/**
 * getServerSideProps
 * Must be used only when its necessary for crawlers or search engines
 */
export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const recommendedProducts = await client().query([
    /** Predicates from prismic its like a where in database */
    Prismic.Predicates.at("document.type", "product"),
  ]);
  const { results } = recommendedProducts;

  return {
    props: {
      products: results,
    },
  };
};
