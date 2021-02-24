import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { Title } from "@/styles/pages/home";
import { client } from "@/lib/prismic";
import Prismic from "prismic-javascript";
import { Document } from "prismic-javascript/types/documents";
import PrismicDOM from "prismic-dom";
import Link from "next/link";

interface IProduct {
  id: string;
  title: string;
}

interface CategoryProps {
  category: Document;
  products: Document[];
}

function Category({ products, category }: CategoryProps) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div>
        <h2>
          <b>Loading...</b>
        </h2>
      </div>
    );
  }

  return (
    <div style={{ margin: "40px" }}>
      <Title>{PrismicDOM.RichText.asText(category.data.title)}</Title>

      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <Link href={`/catalog/products/${product.uid}`}>
              <a>{PrismicDOM.RichText.asText(product.data.title)}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Used to insert the params in url automatically before build
 */
const getStaticPaths: GetStaticPaths = async () => {
  const categories = await client().query([
    Prismic.Predicates.at("document.type", "category"),
  ]);

  const paths = categories.results.map((category) => ({
    params: { slug: category.uid },
  }));

  return {
    paths,
    /**
     * Fallback - Case true, if path doens exists,
     * next automatically will try to get the static props and create the static page
     *
     * if true is setted, must use router.isFallback in component to validate
     */
    fallback: false,
  };
};

/**
 *  Used to render static pages (Pages that don´t need to be updated with frequency)
 */
const getStaticProps: GetStaticProps<CategoryProps> = async (context) => {
  const { slug } = context.params;

  const category = await client().getByUID("category", String(slug), {});

  const products = await client().query([
    Prismic.Predicates.at("document.type", "product"),
    Prismic.Predicates.at("my.product.category", category.id),
  ]);

  return {
    props: {
      category,
      products: products.results,
    },
    /**
     * Revalidate method uses a number as seconds to recreate the page updated
     */
    revalidate: 60,
  };
};

export { getStaticProps, getStaticPaths };

export default Category;
