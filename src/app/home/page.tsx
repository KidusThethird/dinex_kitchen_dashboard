'use client';

import DeliverDialog from '@/components/custom_components/deliver_dialog';
import React, { useEffect, useState } from 'react';
import useStore from '../../lib/store';

interface Item {
  id: number;
  name: string;
  description: string;
  type: string;
  itemType: string;
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

const KitchenDisplay: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { update_pending_page, increment_for_pending_page } = useStore();

  // Function to fetch orders from the server
  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/kitchen_info/approved');
      const data: Order[] = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Fetch orders on initial load and set up interval
  useEffect(() => {
    fetchOrders(); // Initial fetch
    const intervalId = setInterval(fetchOrders, 10000); // Fetch every 10 seconds

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [update_pending_page]);

  // Function to format the time (e.g., "5 minutes ago", "2 hours ago")
  const formatTime = (createdAt: string): string => {
    const orderDate = new Date(createdAt);
    const now = new Date();
    const differenceInMs = now.getTime() - orderDate.getTime();

    const minutes = Math.floor(differenceInMs / (1000 * 60));
    const hours = Math.floor(differenceInMs / (1000 * 60 * 60));
    const days = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;

    return orderDate.toLocaleString();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen pt-14">
      <h2 className="text-3xl font-bold text-center mb-6 text-primaryColor">
        Kitchen Display
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="p-4 bg-white shadow-md rounded-lg border-2 border-l-primaryColor"
          >
            <div className="flex justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2 text-primaryColor">
                  Table #{order.TableNumber}
                </h3>
                <p className="text-gray-600 mb-1">
                  <strong>Waiter:</strong> {order.Waiter.firstName} {order.Waiter.lastName}
                </p>
                <p className="text-gray-600 mb-3">
                  <strong>Ordered:</strong> {formatTime(order.createdAt)}
                </p>
              </div>
              <div className="flex">
                <div className="my-auto h-fit mx-5 bg-primaryColor text-white p-2 rounded">
                  <DeliverDialog orderId={order.id} />
                </div>
              </div>
            </div>
            {order.SpecialDescription && (
              <p className="text-gray-600 mb-3">
                <strong>Special Instructions:</strong> {order.SpecialDescription}
              </p>
            )}

            <h4 className="font-semibold mb-2">Items:</h4>
            <ul className="list-disc list-inside">
              {order.OrderItems.map((item) => (
                <li
                  key={item.id}
                  className={`text-2xl ${
                    item.Item.itemType === 'food' ? 'text-purple-500' : 'text-primaryColor'
                  }`}
                >
                  {item.quantity} x {item.Item.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KitchenDisplay;
