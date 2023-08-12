import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

export default function deleteProductPage() {
  const router = useRouter();
  const [productInfo, setProductInfo] = useState();
  const { id } = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/products?id=" + id).then((response) => {
      setProductInfo(response.data);
    });
  }, [id]);

  async function deleteProduct() {
    await axios.delete("/api/products?id=" + id);
    goBack();
  }

  function goBack() {
    router.push("/products");
  }
  return (
    <Layout>
      <h1 className="text-center">
        確定要刪除此商品？ &nbsp;"{productInfo?.title}"?
      </h1>
      <div className="flex gap-2 justify-center">
        <button onClick={deleteProduct} className="btn-red">
          刪除
        </button>
        <button className="btn-default" onClick={goBack}>
          取消
        </button>
      </div>
    </Layout>
  );
}
