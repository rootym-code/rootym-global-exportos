"use client";


import {
  useEffect,
  useState,
} from "react";



interface InquiryHistory {

  id: string;

  inquiryNumber: string;

  product: string;

  quantity: string | null;

  unit: string | null;

  country: string | null;

  status: string;

  priority: string;

  salesStage: string;

  createdAt: string;

}



interface Buyer {


  companyName: string;

  contactPerson: string | null;

  email: string | null;

  phone: string | null;

  country: string | null;

  products: string[];

  totalInquiries: number;

  inquiryHistory: InquiryHistory[];

}



interface ApiResponse {

  success: boolean;

  buyer?: Buyer;

  message?: string;

}




export default function BuyerDetailPage() {


  const [buyer, setBuyer] =
    useState<Buyer | null>(null);


  const [loading, setLoading] =
    useState(true);




  useEffect(() => {

    loadBuyer();

  }, []);





  async function loadBuyer() {

    try {


      const pathParts =
        window.location.pathname.split("/");


      const id =
        pathParts[pathParts.length - 1];



      const response =
        await fetch(
          `/api/admin/buyers/${id}`
        );



      const result:
        ApiResponse =
        await response.json();



      if (result.success && result.buyer) {

        setBuyer(
          result.buyer
        );

      }


    } catch (error) {


      console.error(
        "Buyer loading error:",
        error
      );


    } finally {


      setLoading(false);


    }

  }






  if (loading) {

    return (

      <div className="rounded-lg border bg-white p-12 text-center">

        Loading buyer profile...

      </div>

    );

  }






  if (!buyer) {


    return (

      <div className="rounded-lg border bg-white p-12 text-center">

        Buyer profile not found.

      </div>

    );

  }






  return (

    <div className="space-y-8">



      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold">

          {buyer.companyName}

        </h1>


        <p className="mt-2 text-gray-500">

          Buyer Profile & Inquiry History

        </p>


      </div>






      {/* Buyer Information Cards */}

      <div className="grid gap-6 md:grid-cols-3">


        <div className="rounded-xl border bg-white p-6">


          <h2 className="font-semibold text-gray-900">

            Contact Information

          </h2>



          <div className="mt-4 space-y-2 text-sm">


            <p>

              <span className="font-medium">
                Name:
              </span>{" "}

              {buyer.contactPerson ?? "-"}

            </p>


            <p>

              <span className="font-medium">
                WhatsApp:
              </span>{" "}

              {buyer.phone ?? "-"}

            </p>


            <p>

              <span className="font-medium">
                Email:
              </span>{" "}

              {buyer.email ?? "-"}

            </p>


          </div>


        </div>





        <div className="rounded-xl border bg-white p-6">


          <h2 className="font-semibold text-gray-900">

            Location

          </h2>


          <p className="mt-4 text-sm">

            {buyer.country ?? "-"}

          </p>


        </div>





        <div className="rounded-xl border bg-white p-6">


          <h2 className="font-semibold text-gray-900">

            Total Inquiries

          </h2>


          <p className="mt-4 text-4xl font-bold text-green-700">

            {buyer.totalInquiries}

          </p>


        </div>



      </div>







      {/* Products */}

      <div className="rounded-xl border bg-white p-6">


        <h2 className="text-xl font-bold">

          Products Interested

        </h2>



        <div className="mt-4 flex flex-wrap gap-3">


          {buyer.products.map(

            (product) => (

              <span

                key={product}

                className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700"

              >

                {product}

              </span>

            )

          )}


        </div>


      </div>








      {/* Inquiry History */}

      <div className="rounded-xl border bg-white p-6">


        <h2 className="text-xl font-bold">

          Inquiry History

        </h2>




        <div className="mt-6 space-y-4">


          {buyer.inquiryHistory.map(

            (inquiry) => (


              <div

                key={inquiry.id}

                className="rounded-xl border p-5"

              >



                <div className="flex flex-col justify-between gap-2 md:flex-row">


                  <div>


                    <h3 className="font-bold">

                      {inquiry.inquiryNumber}

                    </h3>


                    <p className="text-sm text-gray-600">

                      {inquiry.product}

                      {" • "}

                      {inquiry.quantity ?? "-"}

                      {" "}

                      {inquiry.unit ?? ""}

                    </p>


                  </div>





                  <div className="text-sm">


                    <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">

                      {inquiry.status}

                    </span>


                  </div>


                </div>





                <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">


                  <p>

                    <span className="font-medium">
                      Country:
                    </span>{" "}

                    {inquiry.country ?? "-"}

                  </p>


                  <p>

                    <span className="font-medium">
                      Sales Stage:
                    </span>{" "}

                    {inquiry.salesStage}

                  </p>


                  <p>

                    <span className="font-medium">
                      Date:
                    </span>{" "}

                    {new Date(
                      inquiry.createdAt
                    ).toLocaleDateString()}

                  </p>


                </div>


              </div>


            )

          )}


        </div>


      </div>



    </div>

  );

}