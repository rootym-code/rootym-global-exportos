"use client";

import {
  useState,
} from "react";


interface AddActivityFormProps {

  followUpId: string;

  onSuccess: () => void;

}


export default function AddActivityForm({
  followUpId,
  onSuccess,
}: AddActivityFormProps) {


  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(false);



  async function handleSubmit(
    event: React.FormEvent,
  ) {

    event.preventDefault();


    if (!title.trim()) {
      return;
    }


    try {

      setLoading(true);



      const response =
        await fetch(
          `/api/admin/followups/${followUpId}/timeline`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              /*
               * Timeline API requires action.
               * For manual follow-up updates,
               * title is the activity action label.
               */

              action:
                title.trim()
                  .toUpperCase(),


              title:
                title.trim(),


              description:
                description.trim() || undefined,

            }),
          },
        );



      const data =
        await response.json();



      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.message ??
          "Unable to add activity.",
        );

      }



      setTitle("");

      setDescription("");


      onSuccess();



    } catch (error) {


      alert(
        error instanceof Error
          ? error.message
          : "Unexpected error",
      );



    } finally {

      setLoading(false);

    }

  }




  return (

    <form
      onSubmit={handleSubmit}
      className="rounded-lg border bg-white p-6"
    >


      <h3 className="mb-4 text-lg font-semibold">
        Add Activity Update
      </h3>



      <div className="space-y-4">



        <input

          value={title}

          onChange={(event) =>
            setTitle(event.target.value)
          }

          placeholder="Activity title"

          className="w-full rounded-md border px-3 py-2"

        />



        <textarea

          value={description}

          onChange={(event) =>
            setDescription(event.target.value)
          }

          placeholder="Add update details..."

          rows={4}

          className="w-full rounded-md border px-3 py-2"

        />



        <button

          type="submit"

          disabled={loading}

          className="
            rounded-md
            bg-green-600
            px-5
            py-2
            font-medium
            text-white
            disabled:opacity-50
          "

        >

          {
            loading
              ? "Saving..."
              : "Add Update"
          }


        </button>



      </div>


    </form>

  );

}