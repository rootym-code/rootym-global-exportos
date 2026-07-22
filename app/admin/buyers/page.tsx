"use client";

import { useEffect, useState } from "react";

import BuyerTable, {
  BuyerTableItem,
} from "@/components/admin/BuyerTable";


interface ApiResponse {

  success: boolean;

  buyers: BuyerTableItem[];

}



export default function BuyersPage() {


  const [loading, setLoading] =
    useState(true);


  const [buyers, setBuyers] =
    useState<BuyerTableItem[]>([]);



  useEffect(() => {

    loadBuyers();

  }, []);




  async function loadBuyers() {

    try {

      setLoading(true);


      const response =
        await fetch(
          "/api/admin/buyers"
        );


      const result: ApiResponse =
        await response.json();



      if (result.success) {

        setBuyers(
          result.buyers
        );

      }


    } catch (error) {

      console.error(
        "Failed to load buyers:",
        error
      );

    } finally {

      setLoading(false);

    }

  }




  return (

    <div className="space-y-6">


      <div>


        <h1 className="text-3xl font-bold">

          Buyer Management

        </h1>


        <p className="mt-1 text-gray-500">

          Manage global buyers and inquiry history.

        </p>


      </div>




      {loading ? (


        <div className="rounded-lg border bg-white p-12 text-center">

          Loading buyers...

        </div>


      ) : (


        <BuyerTable
          buyers={buyers}
        />


      )}



    </div>

  );

}