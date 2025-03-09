import connectDB from "../config/db/index.js";
import {
  calculateSubtotal,
  getOrderExpiryDate,
  getYesterdaysDate,
} from "../utils/helper.js";
import { generateUUID } from "../utils/uuid.js";

class OrderModel {
  static getOrderById = async (orderId) => {
    const db = await connectDB();
    try {
      const order = await db.query("SELECT * FROM Orders WHERE orderId = ?", [
        orderId,
      ]);

      return order[0][0];
    } catch (error) {
      console.log("error while creating order: " + error);
    }
  };

  // update order Status
  static updateOrderStatus = async (orderStatusId, status) => {
    const db = await connectDB();
    try {
      const [updatedOrderStatus] = await db.execute(
        "UPDATE OrderStatus SET status = ?, updatedAt=? WHERE orderId = ? ",
        [status, Date().toLocaleString(), orderStatusId]
      );

      if (updatedOrderStatus.affectedRows > 0) {
        return true;
      }

      return false;
    } catch (error) {
      console.log("error while upading :", error);
    } finally {
      db.release();
    }
  };

  // get user's order status

  // method to create an order
  static createOrder = async (userId, cart = {}) => {
    // How the cart object looks like
    // cart = {
    //   pickUpTime: "2304980234",
    //   cartItems: [
    //     {
    //       productId: "",
    //       quantity: ""
    //     }, ...
    //   ]
    // }

    const db = await connectDB();
    try {
      const orderId = generateUUID();
      const pickUpTime = cart.pickUpTime;
      const cartItems = cart.cartItems || [];
      const restaurantId = cart.restaurantId;
      // start transaction
      await db.beginTransaction();

      // set expiration date for the order
      // const expiryDate = new Date();
      // expiryDate.setDate(expiryDate.getDate() + 1);

      // const expDate = Date.parse(expiryDate);

      // create a new order entry in the table
      await db.execute(
        "INSERT INTO Orders (orderId, userId, restaurantId, pickUpTime, expiryDate, total, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          orderId,
          userId,
          restaurantId,
          pickUpTime,
          getOrderExpiryDate().toString(),
          0,
          new Date().toLocaleString(),
          new Date().toLocaleString(),
        ]
      );

      // create order status and initialize to processing
      const orderStatusId = generateUUID(); // unique for each order status

      await db.execute(
        "INSERT INTO OrderStatus (orderStatusId, orderId, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)",
        [
          orderStatusId,
          orderId,
          "processing",
          new Date().toLocaleString(),
          new Date().toLocaleString(),
        ]
      );

      // iterate through each products in the cart
      for (const product of cartItems) {
        const orderItemsId = generateUUID(); // unique for each order item

        const { productId, quantity } = product;

        // calculate the subtotal for each order item
        const subtotal = await calculateSubtotal(productId, quantity);

        // insert the product items
        await db.execute(
          "INSERT INTO OrderItems (orderItemsId, orderId, productId, quantity, subtotal, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            orderItemsId,
            orderId,
            productId,
            quantity,
            subtotal,
            new Date().toLocaleString(),
            new Date().toLocaleString(),
          ]
        );
      }

      // update the overall cost of items in the orders talbe
      await db.execute(
        "UPDATE Orders SET total = (SELECT SUM(subtotal) FROM OrderItems where orderId = ?), updatedAt = ?  WHERE orderId = ?",
        [orderId, new Date().toLocaleString(), orderId]
      );

      // integrate the payment for future update
      // after successful payment update the order status to placed

      // update order status to placed
      await db.execute(
        "UPDATE OrderStatus SET status=?, updatedAt=? WHERE orderStatusId = ?",
        ["placed", new Date().toLocaleString(), orderStatusId]
      );

      db.commit(); // commit the db transaction

      return orderId;
    } catch (error) {
      db.rollback(); // rollback the db transaction
      console.log("error while placing order : ", error);
    } finally {
      if (db) db.release(); // release the db after successful transaction
    }
  };

  // update order status to expired for order placed yesterday
  static expireOrders = async () => {
    //console.log("Call triggered for expiring orders !");
    const db = await connectDB();
    try {
      const [expRes] = await db.execute(
        "UPDATE OrderStatus JOIN Orders ON OrderStatus.orderId = Orders.orderId SET OrderStatus.status = ? , OrderStatus.updatedAt = ? WHERE Orders.expiryDate + 0 <= ? AND OrderStatus.status IN ('processing', 'placed', 'ready')",
        ["expired", new Date().toLocaleString(), getYesterdaysDate()]
      );

      if (expRes.affectedRows > 0) {
        return true;
      }
    } catch (error) {
      console.log("error while expiring orders : ", error);
    } finally {
      if (db) db.release(); // release the db after successful transaction
    }
  };

  // get user order information
  static getAllUserOrders = async (userId) => {
    const db = await connectDB();
    try {
      const userOrders = await db.execute(
        "SELECT * FROM Orders JOIN OrderStatus ON Orders.orderId = OrderStatus.orderId JOIN OrderItems ON Orders.orderId = OrderItems.orderId JOIN Products ON OrderItems.productId = Products.productId WHERE Orders.userId = ? ORDER BY orderNumber DESC",
        [userId]
      );

      return userOrders[0];
    } catch (error) {
      console.log("error while getting user orders : ", error);
    } finally {
      db.release();
    }
  };


// Get user order information
static getAllOrdersByRestaurant = async (restaurantId) => {
  const db = await connectDB();
  try {
    // Query to get orders related to the restaurant
    const [orders] = await db.execute(
      "SELECT * FROM Orders " +
      "JOIN OrderStatus ON Orders.orderId = OrderStatus.orderId " +
      "JOIN OrderItems ON Orders.orderId = OrderItems.orderId " +
      "JOIN Products ON OrderItems.productId = Products.productId " +
      "WHERE Orders.restaurantId = ? " +
      "ORDER BY Orders.orderNumber DESC",
      [restaurantId]
    );

    //console.log("orders: ", JSON.stringify(orders, null, 2)); // better for debugging

    return orders; // return all orders instead of just the first row
  } catch (error) {
    console.log("Error while getting user orders: ", error);
    throw error; // You might want to throw the error to be caught elsewhere
  } finally {
    if (db) db.release();
  }
};


}


export default OrderModel;
