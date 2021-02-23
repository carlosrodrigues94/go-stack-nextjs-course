import { useRouter } from "next/router";
import { useState } from "react";

import dynamic from "next/dynamic";

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

function Product() {
  const router = useRouter();
  const [isOpenModal, setIsOpenModal] = useState(false);

  function handleAddToCart() {
    setIsOpenModal(true);
  }

  return (
    <div style={{ margin: "40px" }}>
      {router.query.slug}

      <button type="button" onClick={handleAddToCart}>
        Add to Card
      </button>

      {isOpenModal && <ModalAddToCart />}
    </div>
  );
}

export default Product;
