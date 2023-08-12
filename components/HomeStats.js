import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { subHours } from "date-fns";

export default function HomeStats() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
      setIsLoading(false);
    });
  }, []);

  function ordersTotal(orders) {
    let sum = 0;
    orders.forEach((order) =>
      order.line_items.forEach((specificProduct) => {
        sum +=
          parseInt(specificProduct.price_data.unit_amount) *
          parseInt(specificProduct.quantity);
      }),
    );
    sum = sum / 100; // Because the unit of Stripe is cents.
    return new Intl.NumberFormat("zh-TW").format(sum);
  }

  if (isLoading) {
    return (
      <div className="py-4">
        <Spinner fullWidth={true} />
      </div>
    );
  }

  const ordersToday = orders.filter(
    (o) => new Date(o.createdAt) > subHours(new Date(), 24),
  );
  const ordersWeek = orders.filter(
    (o) => new Date(o.createdAt) > subHours(new Date(), 24 * 7),
  );
  const ordersMonth = orders.filter(
    (o) => new Date(o.createdAt) > subHours(new Date(), 24 * 30),
  );

  return (
    <div>
      <h2>訂單銷量</h2>
      <div className="tiles-grid">
        <div className="tile">
          <h3 className="tile-header">當日銷量</h3>
          <div className="tile-number">{ordersToday.length}</div>
          <div className="tile-desc">
            今日總共有 {ordersToday.length} 份訂單
          </div>
        </div>
        <div className="tile">
          <h3 className="tile-header">本周銷量</h3>
          <div className="tile-number">{ordersWeek.length}</div>
          <div className="tile-desc">本周總共有 {ordersWeek.length} 份訂單</div>
        </div>
        <div className="tile">
          <h3 className="tile-header">本月銷量</h3>
          <div className="tile-number">{ordersMonth.length}</div>
          <div className="tile-desc">
            本月總共有 {ordersMonth.length} 份訂單
          </div>
        </div>
      </div>
      <h2>營收金額</h2>
      <div className="tiles-grid">
        <div className="tile">
          <h3 className="tile-header">當日營收</h3>
          <div className="tile-number tile-rev-num">
            ${ordersTotal(ordersToday)}
          </div>
          <div className="tile-desc">
            今日營收總額為 {ordersTotal(ordersToday)}
          </div>
        </div>
        <div className="tile">
          <h3 className="tile-header">本周營收</h3>
          <div className="tile-number tile-rev-num">
            ${ordersTotal(ordersWeek)}
          </div>
          <div className="tile-desc">
            本周營收總額為 {ordersTotal(ordersWeek)}
          </div>
        </div>
        <div className="tile">
          <h3 className="tile-header">本月營收</h3>
          <div className="tile-number tile-rev-num">
            ${ordersTotal(ordersMonth)}
          </div>
          <div className="tile-desc">
            本月營收總額為 {ordersTotal(ordersMonth)}
          </div>
        </div>
      </div>
    </div>
  );
}
