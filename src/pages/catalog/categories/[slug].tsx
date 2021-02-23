import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { Title } from "../../../styles/pages/home";

interface IProduct {
  id: string;
  title: string;
}

interface CategoryProps {
  products: IProduct[];
}

function Category({ products }: CategoryProps) {
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
      <Title>{router.query.slug}</Title>

      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.title}</li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Used to insert the params in url automatically before build
 */
const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch(`http://localhost:3333/categories`);

  const categories = await response.json();

  const paths = categories.map((category) => ({
    params: { slug: category.id },
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

  const response = await fetch(
    `http://localhost:3333/products?category_id=${slug}`
  );

  const products = await response.json();

  return {
    props: {
      products,
    },
    /**
     * Revalidate method uses a number as seconds to recreate the page updated
     */
    revalidate: 60,
  };
};

export { getStaticProps, getStaticPaths };

export default Category;
