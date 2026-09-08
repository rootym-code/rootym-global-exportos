/**
 * ============================================================
 * ROOTYM Customer Website Media Folders
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the customer-facing Folders &
 *          Organization interface for the Website Media Library,
 *          including folder creation, rename and deletion.
 * ============================================================
 */

"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  CheckCircle2,
  Folder,
  FolderPlus,
  Loader2,
  Pencil,
  RefreshCw,
  Trash2,
  XCircle,
} from "lucide-react";

interface MediaFolder {
  id: string;
  websiteId: string;
  name: string;
  path: string;
  mediaCount: number;
  createdAt: string;
  updatedAt: string;
}

interface MediaFoldersApiResponse {
  success?: boolean;
  data?: MediaFolder[];
  message?: string;
  error?: string;
}

interface CreateFolderApiResponse {
  success?: boolean;
  data?: MediaFolder;
  message?: string;
  error?: string;
}

interface FolderMutationResponse {
  success?: boolean;
  data?: MediaFolder;
  message?: string;
  error?: string;
}

export default function MediaFoldersClient() {
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [folderName, setFolderName] = useState("");

  const [editingFolderId, setEditingFolderId] = useState<string | null>(
    null,
  );
  const [editingFolderName, setEditingFolderName] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [deletingFolderId, setDeletingFolderId] = useState<string | null>(
    null,
  );

  const [errorMessage, setErrorMessage] = useState<string | null>(
    null,
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(
    null,
  );

  const loadFolders = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(
        "/api/workspace/website/media/folders",
        {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
        },
      );

      const payload =
        (await response.json()) as MediaFoldersApiResponse;

      if (!response.ok || !payload.success) {
        throw new Error(
          payload.message ??
            payload.error ??
            "Unable to load media folders.",
        );
      }

      setFolders(payload.data ?? []);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load media folders.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFolders();
  }, [loadFolders]);

  async function handleCreateFolder(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErrorMessage(null);
    setSuccessMessage(null);

    const normalizedName = folderName.trim();

    if (!normalizedName) {
      setErrorMessage("Enter a folder name.");
      return;
    }

    if (normalizedName.length > 100) {
      setErrorMessage(
        "Folder name must be 100 characters or fewer.",
      );
      return;
    }

    setIsCreating(true);

    try {
      const response = await fetch(
        "/api/workspace/website/media/folders",
        {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: normalizedName,
          }),
        },
      );

      const payload =
        (await response.json()) as CreateFolderApiResponse;

      if (!response.ok || !payload.success) {
        throw new Error(
          payload.message ??
            payload.error ??
            "Unable to create the folder.",
        );
      }

      setFolderName("");

      setSuccessMessage(
        payload.message ?? "Folder created successfully.",
      );

      await loadFolders();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to create the folder.",
      );
    } finally {
      setIsCreating(false);
    }
  }

  function startRename(folder: MediaFolder) {
    setErrorMessage(null);
    setSuccessMessage(null);
    setEditingFolderId(folder.id);
    setEditingFolderName(folder.name);
  }

  function cancelRename() {
    if (isRenaming) {
      return;
    }

    setEditingFolderId(null);
    setEditingFolderName("");
  }

  async function handleRename(
    event: FormEvent<HTMLFormElement>,
    folder: MediaFolder,
  ) {
    event.preventDefault();

    setErrorMessage(null);
    setSuccessMessage(null);

    const normalizedName = editingFolderName.trim();

    if (!normalizedName) {
      setErrorMessage("Enter a folder name.");
      return;
    }

    if (normalizedName.length > 100) {
      setErrorMessage(
        "Folder name must be 100 characters or fewer.",
      );
      return;
    }

    setIsRenaming(true);

    try {
      const response = await fetch(
        `/api/workspace/website/media/folders/${encodeURIComponent(
          folder.id,
        )}`,
        {
          method: "PATCH",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: normalizedName,
          }),
        },
      );

      const payload =
        (await response.json()) as FolderMutationResponse;

      if (!response.ok || !payload.success) {
        throw new Error(
          payload.message ??
            payload.error ??
            "Unable to rename the folder.",
        );
      }

      setEditingFolderId(null);
      setEditingFolderName("");

      setSuccessMessage(
        payload.message ?? "Folder renamed successfully.",
      );

      await loadFolders();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to rename the folder.",
      );
    } finally {
      setIsRenaming(false);
    }
  }

  async function handleDelete(folder: MediaFolder) {
    setErrorMessage(null);
    setSuccessMessage(null);

    const confirmed = window.confirm(
      folder.mediaCount > 0
        ? `The folder "${folder.name}" contains ${folder.mediaCount} media ${
            folder.mediaCount === 1 ? "asset" : "assets"
          }. It cannot be deleted until those assets are moved or removed.`
        : `Delete the folder "${folder.name}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingFolderId(folder.id);

    try {
      const response = await fetch(
        `/api/workspace/website/media/folders/${encodeURIComponent(
          folder.id,
        )}`,
        {
          method: "DELETE",
          credentials: "same-origin",
        },
      );

      const payload =
        (await response.json()) as FolderMutationResponse;

      if (!response.ok || !payload.success) {
        throw new Error(
          payload.message ??
            payload.error ??
            "Unable to delete the folder.",
        );
      }

      if (editingFolderId === folder.id) {
        setEditingFolderId(null);
        setEditingFolderName("");
      }

      setSuccessMessage(
        payload.message ?? "Folder deleted successfully.",
      );

      await loadFolders();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to delete the folder.",
      );
    } finally {
      setDeletingFolderId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* ========================================================
          CREATE FOLDER
          ======================================================== */}

      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                <FolderPlus className="h-5 w-5 text-emerald-600" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  Folder Management
                </p>

                <h3 className="mt-1 text-xl font-bold text-slate-900">
                  Create a media folder
                </h3>
              </div>
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500">
              Create folders to keep your Website media assets
              organized. Empty folders are supported.
            </p>
          </div>

          <form
            onSubmit={handleCreateFolder}
            className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-xl"
          >
            <input
              type="text"
              value={folderName}
              onChange={(event) =>
                setFolderName(event.target.value)
              }
              placeholder="e.g. Product Images"
              maxLength={100}
              disabled={isCreating}
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
            />

            <button
              type="submit"
              disabled={isCreating}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FolderPlus className="h-4 w-4" />
              )}

              {isCreating ? "Creating..." : "Create Folder"}
            </button>
          </form>
        </div>
      </div>

      {/* ========================================================
          FEEDBACK
          ======================================================== */}

      {successMessage ? (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />

          <span>{successMessage}</span>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0" />

          <span>{errorMessage}</span>
        </div>
      ) : null}

      {/* ========================================================
          FOLDER LIST
          ======================================================== */}

      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Website Folders
            </p>

            <h3 className="mt-1 text-xl font-bold text-slate-900">
              Folders & Organization
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {folders.length === 0
                ? "No folders created yet."
                : `${folders.length} ${
                    folders.length === 1
                      ? "folder"
                      : "folders"
                  } available`}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadFolders()}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                isLoading ? "animate-spin" : ""
              }`}
            />

            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="mt-8 flex items-center justify-center rounded-2xl bg-slate-50 px-6 py-12 ring-1 ring-slate-100">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading folders...
            </div>
          </div>
        ) : folders.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white ring-1 ring-slate-200">
              <Folder className="h-6 w-6 text-slate-400" />
            </div>

            <h4 className="mt-4 text-sm font-semibold text-slate-900">
              No media folders yet
            </h4>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Create your first folder above to start organizing
              your website media assets.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {folders.map((folder) => {
              const isEditing =
                editingFolderId === folder.id;
              const isDeleting =
                deletingFolderId === folder.id;

              return (
                <div
                  key={folder.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-200 hover:bg-emerald-50/30"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200">
                      <Folder className="h-5 w-5 text-emerald-600" />
                    </div>

                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
                      {folder.mediaCount}{" "}
                      {folder.mediaCount === 1
                        ? "asset"
                        : "assets"}
                    </span>
                  </div>

                  {isEditing ? (
                    <form
                      onSubmit={(event) =>
                        void handleRename(event, folder)
                      }
                      className="mt-5"
                    >
                      <label
                        htmlFor={`rename-folder-${folder.id}`}
                        className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                      >
                        Folder name
                      </label>

                      <input
                        id={`rename-folder-${folder.id}`}
                        type="text"
                        value={editingFolderName}
                        onChange={(event) =>
                          setEditingFolderName(
                            event.target.value,
                          )
                        }
                        maxLength={100}
                        autoFocus
                        disabled={isRenaming}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
                      />

                      <div className="mt-3 flex items-center gap-2">
                        <button
                          type="submit"
                          disabled={isRenaming}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isRenaming ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          )}

                          {isRenaming
                            ? "Saving..."
                            : "Save"}
                        </button>

                        <button
                          type="button"
                          onClick={cancelRename}
                          disabled={isRenaming}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <h4 className="mt-5 truncate text-base font-bold text-slate-900">
                        {folder.name}
                      </h4>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        /{folder.path}
                      </p>

                      <div className="mt-4 border-t border-slate-200 pt-4">
                        <p className="text-xs text-slate-400">
                          Created{" "}
                          {new Date(
                            folder.createdAt,
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            startRename(folder)
                          }
                          disabled={isDeleting}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Rename
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            void handleDelete(folder)
                          }
                          disabled={isDeleting}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-100 bg-white px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isDeleting ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}

                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
