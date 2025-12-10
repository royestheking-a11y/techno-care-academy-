import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Trash2, Eye, Loader2, CheckCircle, XCircle, Clock, Package } from "lucide-react";
import { toast } from "sonner";
import { ordersAPI } from "../../utils/api";
import { Label } from "../ui/label";

interface Order {
  id: number;
  name: string;
  phone: string;
  address: string;
  bookId: number;
  bookTitle: string;
  bookAuthor: string;
  bookPrice: number;
  deliveryMethod: string;
  deliveryCharge: number;
  totalPrice: number;
  status: "pending" | "complete";
  createdAt: string;
}

export function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getAll();
      if (response.success) {
        // Sort by newest first
        const sorted = response.data.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sorted);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, status: Order["status"]) => {
    try {
      const response = await ordersAPI.update(id, { status });
      if (response.success) {
        toast.success(`Order status updated to ${status}`);
        fetchOrders();
        setViewDialogOpen(false);
      } else {
        toast.error(response.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      const response = await ordersAPI.delete(id);
      if (response.success) {
        toast.success("Order deleted successfully");
        fetchOrders();
      } else {
        toast.error(response.error || "Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    }
  };

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setViewDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "complete":
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Complete</Badge>;
      default:
        return <Badge className="bg-yellow-500 hover:bg-yellow-600"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  const handleQuickStatusToggle = async (order: Order, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = order.status === "pending" ? "complete" : "pending";
    
    try {
      const response = await ordersAPI.update(order.id, { status: newStatus });
      if (response.success) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchOrders();
      } else {
        toast.error(response.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#285046]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-[#1A202C]">Book Orders</h2>
          <p className="text-[#555555]">Manage book orders and deliveries</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="px-4 py-2">
            Total: {orders.length}
          </Badge>
          <Badge variant="outline" className="px-4 py-2 bg-yellow-50">
            Pending: {orders.filter(o => o.status === "pending").length}
          </Badge>
          <Badge variant="outline" className="px-4 py-2 bg-green-50">
            Complete: {orders.filter(o => o.status === "complete").length}
          </Badge>
        </div>
      </div>

      <Card className="rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Book</TableHead>
              <TableHead>Delivery</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-[#555555] py-8">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString('en-GB')}
                  </TableCell>
                  <TableCell>{order.name}</TableCell>
                  <TableCell>{order.phone}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={order.address}>
                    {order.address}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{order.bookTitle}</TableCell>
                  <TableCell className="text-sm">{order.deliveryMethod}</TableCell>
                  <TableCell>৳{order.totalPrice}</TableCell>
                  <TableCell>
                    <button
                      onClick={(e) => handleQuickStatusToggle(order, e)}
                      className="transition-all hover:scale-105"
                      title="Click to toggle status"
                    >
                      {getStatusBadge(order.status)}
                    </button>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(order)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(order.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Review and manage this order
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-[#285046] to-[#2F6057] text-white p-4 rounded-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl mb-1">{selectedOrder.bookTitle}</h3>
                    <p className="text-sm opacity-90">Author: {selectedOrder.bookAuthor}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl">৳{selectedOrder.totalPrice}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Order Number</Label>
                  <p className="text-[#1A202C] mt-1">#{selectedOrder.id.toString().slice(-6)}</p>
                </div>
                <div>
                  <Label>Order Date</Label>
                  <p className="text-[#1A202C] mt-1">
                    {new Date(selectedOrder.createdAt).toLocaleString('en-GB')}
                  </p>
                </div>
                <div>
                  <Label>Customer Name</Label>
                  <p className="text-[#1A202C] mt-1">{selectedOrder.name}</p>
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <p className="text-[#1A202C] mt-1">{selectedOrder.phone}</p>
                </div>
                <div className="col-span-2">
                  <Label>Delivery Address</Label>
                  <p className="text-[#1A202C] mt-1">{selectedOrder.address}</p>
                </div>
              </div>

              <Card className="p-4 bg-[#F7FAFC]">
                <h4 className="text-sm text-[#555555] mb-3">Order Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#555555]">Book Price</span>
                    <span className="text-[#1A202C]">৳{selectedOrder.bookPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#555555]">Delivery Method</span>
                    <span className="text-[#1A202C]">{selectedOrder.deliveryMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#555555]">Delivery Charge</span>
                    <span className="text-[#1A202C]">৳{selectedOrder.deliveryCharge}</span>
                  </div>
                  <div className="border-t-2 border-[#285046] pt-2 flex justify-between">
                    <span className="text-lg text-[#285046]">Total</span>
                    <span className="text-lg text-[#285046]">৳{selectedOrder.totalPrice}</span>
                  </div>
                </div>
              </Card>

              <div>
                <Label>Current Status</Label>
                <div className="mt-2">{getStatusBadge(selectedOrder.status)}</div>
              </div>

              <DialogFooter className="flex gap-2">
                {selectedOrder.status === "pending" ? (
                  <Button
                    onClick={() => handleStatusUpdate(selectedOrder.id, "complete")}
                    className="bg-gradient-to-r from-[#285046] to-[#2F6057] text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Complete
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => handleStatusUpdate(selectedOrder.id, "pending")}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Mark as Pending
                  </Button>
                )}
                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
