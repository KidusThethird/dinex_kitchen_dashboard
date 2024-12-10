'use client'
import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNow, format } from "date-fns";

// Define types for the API response
interface Item {
  id: number;
  name: string;
  description: string;
  type: string;
  itemType: "food" | "drink";
  price: number;
  duration: number;
  status: string;
  deleted: boolean;
  createdAt: string;
}

interface OrderItem {
  id: number;
  OrderId: string;
  ItemId: number;
  quantity: number;
  createdAt: string;
  Item: Item;
}

interface Waiter {
  id: number;
  firstName: string;
  lastName: string;
  type: string;
  status: string;
  email: string;
  password: string;
  phoneNumber: string;
  deleted: boolean;
  createdAt: string;
}

interface Order {
  id: string;
  WaiterId: number;
  SpecialDescription: string | null;
  OrderStatus: string;
  TableNumber: string;
  Seen: string;
  createdAt: string;
  Waiter: Waiter;
  OrderItems: OrderItem[];
}

const Delivered: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Order[]>("http://localhost:5000/kitchen_info/delivered");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Pagination logic
  const startIndex = (page - 1) * pageSize;
  const paginatedOrders = orders.slice(startIndex, startIndex + pageSize);

  return (
    <div className="py-14 px-4">
      <h1 className="text-3xl font-bold text-primaryColor mb-6">Delivered Orders</h1>

      {/* Table size selection */}
      <div className="flex items-center justify-between mb-4">
        <label className="text-lg font-medium text-gray-600">
          Rows per page:{" "}
          <select
            className="ml-2 border border-gray-300 rounded px-2 py-1"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20, 30, 50, 70, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-center text-lg text-gray-600">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-primaryColor">
            <thead>
              <tr className="bg-primaryColor text-white">
                <th className="border border-primaryColor px-4 py-2 text-left">Table</th>
                <th className="border border-primaryColor px-4 py-2 text-left">Waiter</th>
                <th className="border border-primaryColor px-4 py-2 text-left">Items</th>
                <th className="border border-primaryColor px-4 py-2 text-left">Ordered Time</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{order.TableNumber}</td>
                  <td className="border px-4 py-2">
                    {order.Waiter.firstName} {order.Waiter.lastName}
                  </td>
                  <td className="border px-4 py-2">
                    <ul>
                      {order.OrderItems.map((item) => (
                        <li
                          key={item.id}
                          className={`${
                            item.Item.itemType === "food"
                              ? "text-purple-600"
                              : "text-green-600"
                          }`}
                        >
                          {item.quantity} x {item.Item.name}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(order.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
                      ? `${formatDistanceToNow(new Date(order.createdAt))} ago`
                      : format(new Date(order.createdAt), "PPpp")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination controls */}
      <div className="mt-4 flex items-center justify-between">
        <button
          className="px-4 py-2 bg-primaryColor text-white rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {page} of {Math.ceil(orders.length / pageSize)}
        </span>
        <button
          className="px-4 py-2 bg-primaryColor text-white rounded disabled:opacity-50"
          disabled={page === Math.ceil(orders.length / pageSize)}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Delivered;
