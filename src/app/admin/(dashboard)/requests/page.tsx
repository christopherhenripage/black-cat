import { Metadata } from "next";
import prisma from "@/lib/db";
import { RequestStatusUpdater } from "@/components/admin/RequestStatusUpdater";

export const metadata: Metadata = {
  title: "Order Requests",
};

export default async function RequestsPage() {
  const requests = await prisma.orderRequest.findMany({
    orderBy: [
      { status: "asc" },
      { createdAt: "desc" },
    ],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Order Requests</h1>
      </div>

      <div className="bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size / Qty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fulfillment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No order requests yet.
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">
                        {request.customerName}
                      </p>
                      <p className="text-gray-500">{request.email}</p>
                      {request.phone && (
                        <p className="text-gray-400 text-xs">{request.phone}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {request.productSlug}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {request.variantSize} x {request.quantity}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="text-gray-900">{request.fulfillmentMethod}</p>
                      {request.shippingAddress && (
                        <p className="text-gray-500 text-xs truncate max-w-[150px]">
                          {request.shippingAddress}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <RequestStatusUpdater
                      requestId={request.id}
                      currentStatus={request.status}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
