import { GetServerSideProps } from "next";
import { useState } from "react";
import { Title } from "@/styles/pages/home";
import SEO from "@/components/SEO";

interface IProduct {
  id: string;
  title: string;
}

interface HomeProps {
  products: IProduct[];
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
            <li key={product.id}>{product.title}</li>
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
  const response = await fetch("http://localhost:3333/recommended");

  const products = await response.json();

  return {
    props: {
      products,
    },
  };
};
