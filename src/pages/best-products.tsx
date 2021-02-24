import { GetStaticProps } from "next";
import { Title } from "@/styles/pages/home";

interface IProduct {
  id: string;
  title: string;
}

interface BestProductsProps {
  products: IProduct[];
}

function BestProducts({ products }: BestProductsProps) {
  return (
    <div>
      <Title>Products</Title>
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.title}</li>
        ))}
      </ul>
    </div>
  );
}

/**
 *  Used to render static pages (Pages that don´t need to be updated with frequency)
 */
const getStaticProps: GetStaticProps<BestProductsProps> = async (context) => {
  return {
    props: {
      products: [],
    },
    /**
     * Revalidate method uses a number as seconds to recreate the page updated
     */
    revalidate: 5,
  };
};

export { getStaticProps };

export default BestProducts;
