import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { withSwal } from "react-sweetalert2";

function SettingsPage({ swal }) {
  const [products, setProducts] = useState([]);
  const [featuredProductId, setFeaturedProductId] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [shippingFee, setShippingFee] = useState("");

  useEffect(() => {
    setisLoading(true);
    fetchAll().then(() => {
      setisLoading(false);
    });
  }, []);

  async function fetchAll() {
    await axios.get("/api/products").then((response) => {
      setProducts(response.data);
    });
    await axios.get("/api/settings?name=featuredProductId").then((response) => {
      setFeaturedProductId(response.data.value);
    });
    await axios.get("/api/settings?name=shippingFee").then((response) => {
      setShippingFee(response.data.value);
    });
  }

  async function saveSettings() {
    setisLoading(true);
    await axios.put("/api/settings", {
      name: "featuredProductId",
      value: featuredProductId,
    });
    await axios.put("/api/settings", {
      name: "shippingFee",
      value: shippingFee,
    });
    setisLoading(false);
    await swal.fire({
      title: "成功儲存設定!",
      icon: "success",
    });
  }
  return (
    <Layout>
      <h1>設定</h1>
      {isLoading && (
        <div className="py-4">
          <Spinner />
        </div>
      )}
      {!isLoading && (
        <>
          <label>首頁商品</label>
          <select
            value={featuredProductId}
            onChange={(ev) => {
              setFeaturedProductId(ev.target.value);
            }}
          >
            {products.length > 0 &&
              products.map((product) => (
                <option value={product._id} key={product._id}>
                  {product.title}
                </option>
              ))}
          </select>
          <label>運費金額 (新臺幣)</label>
          <input
            type="number"
            value={shippingFee}
            onChange={(event) => {
              setShippingFee(event.target.value);
            }}
          />
          <div>
            <button onClick={saveSettings} className="btn-primary">
              儲存設定
            </button>
          </div>
        </>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }) => <SettingsPage swal={swal} />);
