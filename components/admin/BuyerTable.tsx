"use client";

import { Eye } from "lucide-react";


export interface BuyerTableItem {

  companyName: string;

  contactPerson: string | null;

  email: string | null;

  phone: string | null;

  country: string | null;

  totalInquiries: number;

  products: string[];

  latestInquiry: string | null;

  latestInquiryNumber: string | null;

}



interface BuyerTableProps {

  buyers: BuyerTableItem[];

}



export default function BuyerTable({
  buyers,
}: BuyerTableProps) {


  return (

    <div className="overflow-hidden rounded-lg border bg-white">


      <table className="w-full text-sm">


        <thead className="border-b bg-gray-50">


          <tr>


            <th className="px-5 py-4 text-left font-semibold">
              Company
            </th>


            <th className="px-5 py-4 text-left font-semibold">
              Contact
            </th>


            <th className="px-5 py-4 text-left font-semibold">
              Country
            </th>


            <th className="px-5 py-4 text-left font-semibold">
              Products
            </th>


            <th className="px-5 py-4 text-center font-semibold">
              Inquiries
            </th>


            <th className="px-5 py-4 text-left font-semibold">
              Latest Inquiry
            </th>


            <th className="px-5 py-4 text-center font-semibold">
              Action
            </th>


          </tr>


        </thead>



        <tbody>


          {buyers.length === 0 ? (


            <tr>

              <td
                colSpan={7}
                className="px-5 py-12 text-center text-gray-500"
              >
                No buyers found.
              </td>


            </tr>


          ) : (


            buyers.map(
              (buyer, index) => (


                <tr
                  key={`${buyer.companyName}-${index}`}
                  className="border-b last:border-0"
                >


                  <td className="px-5 py-4">


                    <div className="font-medium">
                      {buyer.companyName}
                    </div>


                    {buyer.email && (

                      <div className="text-xs text-gray-500">
                        {buyer.email}
                      </div>

                    )}


                  </td>



                  <td className="px-5 py-4">


                    <div>
                      {buyer.contactPerson || "-"}
                    </div>


                    {buyer.phone && (

                      <div className="text-xs text-gray-500">
                        {buyer.phone}
                      </div>

                    )}


                  </td>



                  <td className="px-5 py-4">

                    {buyer.country || "-"}

                  </td>



                  <td className="px-5 py-4">


                    <div className="flex flex-wrap gap-1">


                      {buyer.products.map(
                        (product) => (

                          <span
                            key={product}
                            className="rounded-full bg-green-50 px-2 py-1 text-xs text-green-700"
                          >
                            {product}
                          </span>

                        )
                      )}


                    </div>


                  </td>



                  <td className="px-5 py-4 text-center font-medium">

                    {buyer.totalInquiries}

                  </td>



                  <td className="px-5 py-4">


                    <div className="font-medium">

                      {buyer.latestInquiryNumber || "-"}

                    </div>


                    {buyer.latestInquiry && (

                      <div className="text-xs text-gray-500">

                        {new Date(
                          buyer.latestInquiry
                        ).toLocaleDateString()}

                      </div>

                    )}


                  </td>



                  <td className="px-5 py-4 text-center">


                    <button
                      className="inline-flex items-center gap-2 rounded border px-3 py-2 text-sm hover:bg-gray-50"
                    >

                      <Eye size={16} />

                      View

                    </button>


                  </td>


                </tr>


              )
            )


          )}


        </tbody>


      </table>


    </div>

  );

}