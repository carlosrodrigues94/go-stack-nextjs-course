import { useRouter } from "next/router";
import { useState } from "react";
import { client } from "@/lib/prismic";
import Prismic from "prismic-javascript";
import { Document } from "prismic-javascript/types/documents";
import PrismicDOM from "prismic-dom";
import Link from "next/link";

import dynamic from "next/dynamic";
import { GetStaticPaths, GetStaticProps } from "next";
import { Title } from "@/styles/pages/home";

interface ProductProps {
  product: Document;
}

const ModalAddToCart = dynamic(
  () => import("../../../components/ModalAddToCart"),
  {
    loading: () => <p>Carregando...</p>,
    /**
     * Ssr false = the component only will render in
     * the Browser side, (If component depends of Window or Document or any Browser variable)
     */
    ssr: false,
  }
);

function Product({ product }: ProductProps) {
  const router = useRouter();
  const [isOpenModal, setIsOpenModal] = useState(false);

  function handleAddToCart() {
    setIsOpenModal(true);
  }

  if (router.isFallback) {
    return <h4>Carregando...</h4>;
  }

  return (
    <div style={{ margin: "40px" }}>
      <Title>{PrismicDOM.RichText.asText(product.data.title)}</Title>

      <div
        dangerouslySetInnerHTML={{
          __html: PrismicDOM.RichText.asHtml(product.data.description),
        }}
      ></div>

      <img
        src={product.data.thumbnail.url}
        width="350px"
        style={{ borderRadius: "5px", margin: "12px 0" }}
        alt="product-img"
      />

      <p>{`Price: ${product.data.price}`}</p>

      <button type="button" onClick={handleAddToCart}>
        Add to Card
      </button>

      {isOpenModal && <ModalAddToCart />}
    </div>
  );
}

/**
 * Used to insert the params in url automatically before build
 */
const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    /**
     * Fallback - Case true, if path doens exists,
     * next automatically will try to get the static props and create the static page
     *
     * if true is setted, must use router.isFallback in component to validate
     */
    fallback: true,
  };
};

/**
 *  Used to render static pages (Pages that don´t need to be updated with frequency)
 */
const getStaticProps: GetStaticProps<ProductProps> = async (context) => {
  const { slug } = context.params;

  const product = await client().getByUID("product", String(slug), {});

  return {
    props: {
      product,
    },
    /**
     * Revalidate method uses a number as seconds to recreate the page updated
     */
    revalidate: 10,
  };
};

export { getStaticProps, getStaticPaths };

export default Product;
