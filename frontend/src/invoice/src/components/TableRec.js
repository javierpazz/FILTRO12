import React from 'react';

export default function Table({ receiptItems, total }) {
  total = receiptItems.reduce((a, c) => a + c.price * c.quantity, 0);

  return (
    <>
      <table width="100%" className="mb-10">
        <thead>
          <tr className="bg-gray-100 p-1">
            <td className="font-bold">Product Code</td>
            <td className="font-bold">Product Description</td>
            <td className="font-bold">Quantity</td>
            <td className="font-bold">Price</td>
            <td className="font-bold">Amount</td>
          </tr>
        </thead>
        {receiptItems.map((itemVal) => (
          <React.Fragment key={itemVal._id}>
            <tbody>
              <tr className="h-10">
                <td>{itemVal._id}</td>
                <td>{itemVal.desval}</td>
                <td>{itemVal.amount}</td>
              </tr>
            </tbody>
          </React.Fragment>
        ))}
      </table>

      <div>
        <h2 className="flex items-end justify-end text-gray-800 text-4xl font-bold">
          Total..: $ {total.toLocaleString()}
        </h2>
      </div>
    </>
  );
}
